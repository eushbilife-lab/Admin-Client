import { unitConversion, unitConversions } from "utils/nfUnit.conversions";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { conversionTable } from "utils/conversion.util";
import { roundabout } from "utils/roundabout";
import { useEffect, useRef } from "react";
import { change } from "redux-form";
import { useParams } from "react-router-dom";
import { roundToHalfOrWhole } from "utils/rountToHalfOrWhole.util";

const FORM = "AddProductForm";

/** Default NF rows for a new product (matched to nutrition library keys). */
const DEFAULT_NF_KEYS = [
  "calories",
  "fat",
  "total_fat",
  "saturated_fat",
  "trans_fat",
  "unsaturated_fat",
  "cholesterol",
  "sodium",
  "total_carbohydrate",
  "fiber",
  "total_sugars",
  "added_sugars",
  "natural_sugar",
  "protein",
];

type NfRow = {
  nutritionId?: { key?: string; value?: string; [k: string]: any };
  perServing?: number | string;
  uom?: { label?: string; value?: any };
  rda?: any;
  dv?: number;
  nFDv?: number;
  disabled?: boolean;
  [k: string]: any;
};

function cloneRows(rows: NfRow[] | undefined | null): NfRow[] {
  if (!Array.isArray(rows)) return [];
  return JSON.parse(JSON.stringify(rows));
}

function rowsEqual(a: NfRow[], b: NfRow[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function rowKey(row: NfRow | undefined | null): string {
  return String(row?.nutritionId?.key || "");
}

function rowNutritionValue(row: NfRow | undefined | null): string {
  const value = row?.nutritionId?.value ?? row?.nutritionId;
  return value != null ? String(value) : "";
}

function findRow(rows: NfRow[], ...keys: string[]): NfRow | undefined {
  return rows.find((row) => keys.includes(rowKey(row)));
}

function findUnit(
  options: any[] | undefined,
  ...labels: string[]
): { label?: string; value?: any } | undefined {
  if (!Array.isArray(options)) return undefined;
  return options.find((item: any) => labels.includes(String(item?.label || "")));
}

/**
 * Side-effect engine for Add/Edit Product.
 * Keeps servings, carbs count, RDA links, %DV, and derived nutrients in sync —
 * without re-creating rows the user removed.
 */
export default function Calculate() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const nf = useAppSelector((state) => state.form[FORM]?.values?.nf) as
    | NfRow[]
    | undefined;
  const ingredients = useAppSelector(
    (state) => state.form[FORM]?.values?.ingredients
  );
  const rdaSection = useAppSelector(
    (state) => state.form[FORM]?.values?.rdaSection
  );
  const formValues = useAppSelector((state) => state.form[FORM]?.values);
  const { netWeight, weightUOM, servingSize, servingUOM } = formValues || {};

  const { nutritionsOptions } = useAppSelector((state) => state?.nutrition);
  const { RDAOptions } = useAppSelector((state) => state?.rda);
  const { measurementScaleOptions } = useAppSelector(
    (state) => state?.measurementScale?.uom
  );

  const seededDefaultsRef = useRef(false);
  const lastNfWriteRef = useRef("");

  const writeNf = (next: NfRow[]) => {
    const serialized = JSON.stringify(next);
    if (serialized === lastNfWriteRef.current) return;
    if (Array.isArray(nf) && rowsEqual(next, nf)) {
      lastNfWriteRef.current = serialized;
      return;
    }
    lastNfWriteRef.current = serialized;
    dispatch(change(FORM, "nf", next));
  };

  // Reset seed flag when switching between add / edit routes.
  useEffect(() => {
    seededDefaultsRef.current = isEdit;
  }, [isEdit, id]);

  // ——— Servings per container ———
  useEffect(() => {
    if (!netWeight || !weightUOM || !servingSize || !servingUOM) return;
    const net = unitConversion(netWeight, weightUOM.label);
    const size = unitConversion(servingSize, servingUOM.label);
    if (!net || !size) return;
    dispatch(
      change(FORM, "servingsPerContainer", roundToHalfOrWhole(net / size))
    );
  }, [netWeight, weightUOM, servingSize, servingUOM, dispatch]);

  // ——— Fruit / veg / nuts % from ingredient contents ———
  useEffect(() => {
    if (!Array.isArray(ingredients) || ingredients.length === 0) return;
    const total = ingredients.reduce((sum: number, item: any) => {
      const content = Number(item?.ingredientContent);
      return Number.isFinite(content) ? sum + content : sum;
    }, 0);
    dispatch(change(FORM, "fruitsVegNutsPercent", total));
  }, [ingredients, dispatch]);

  // ——— Carbs count (label helper) ———
  useEffect(() => {
    if (!servingSize || !Array.isArray(nf)) return;
    const carb = findRow(nf, "total_carbohydrate");
    const convertedCarbs = unitConversion(
      carb?.perServing,
      carb?.uom?.label
    );
    const convertedServing = unitConversion(servingSize, servingUOM?.label);
    if (convertedCarbs == null || !convertedServing) return;
    dispatch(
      change(
        FORM,
        "carbsCount",
        roundabout((convertedCarbs / 100) * convertedServing) || 0
      )
    );
  }, [nf, servingSize, servingUOM, dispatch]);

  // ——— Seed default NF rows once on Add food ———
  useEffect(() => {
    if (isEdit) return;
    if (seededDefaultsRef.current) return;
    if (!Array.isArray(nutritionsOptions) || !nutritionsOptions.length) return;

    // Drop blank FieldArray placeholders so defaults aren't appended after an empty row.
    const current = (Array.isArray(nf) ? nf : []).filter(
      (row) => rowKey(row) || row?.nutritionId || row?.rda
    );
    const existingKeys = new Set(
      current.map((row) => rowKey(row)).filter(Boolean)
    );
    const optionByKey = new Map(
      nutritionsOptions
        .filter((o: any) => o?.key)
        .map((o: any) => [o.key, o] as const)
    );
    // Prefer total_fat when the library has both fat and total_fat.
    const hasTotalFat = optionByKey.has("total_fat");

    const toAdd = DEFAULT_NF_KEYS.filter((key) => {
      if (!optionByKey.has(key)) return false;
      if (existingKeys.has(key)) return false;
      if (key === "fat" && (hasTotalFat || existingKeys.has("total_fat"))) {
        return false;
      }
      if (key === "total_fat" && existingKeys.has("fat")) return false;
      return true;
    }).map((key) => ({
      nutritionId: optionByKey.get(key),
      disabled: key === "unsaturated_fat",
    }));

    seededDefaultsRef.current = true;
    if (!toAdd.length) return;
    writeNf([...current, ...toAdd]);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed once when options arrive
  }, [nutritionsOptions, isEdit, id]);

  // ——— Merge RDA section picks into nf (no duplicates, never revive removed keys) ———
  useEffect(() => {
    if (!Array.isArray(rdaSection) || !rdaSection.length) return;
    const current = Array.isArray(nf) ? cloneRows(nf) : [];
    const existingValues = new Set(
      current.map((row) => rowNutritionValue(row)).filter(Boolean)
    );

    let changed = false;
    for (const item of rdaSection) {
      const dataId = item?.dataId;
      const value = dataId?.value != null ? String(dataId.value) : "";
      if (!value || existingValues.has(value)) continue;
      current.push({
        nutritionId: dataId,
        rda: {
          label: item?.label,
          value: item?.value,
          data: item?.data,
          dataUnit: item?.dataUnit,
        },
      });
      existingValues.add(value);
      changed = true;
    }
    if (changed) writeNf(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rdaSection]);

  // ——— Single NF sync pass: RDA link, %DV, derived nutrients ———
  useEffect(() => {
    if (!Array.isArray(nf) || nf.length === 0) return;

    const next = cloneRows(nf);
    let touched = false;

    // Link RDA → nutritionId when row was added from RDA picker
    if (Array.isArray(nutritionsOptions) && nutritionsOptions.length) {
      for (const row of next) {
        const dataId = row?.rda?.dataId;
        if (!dataId?.value || row?.nutritionId?.key) continue;
        const match = nutritionsOptions.find(
          (option: any) => option?.value === dataId?.value
        );
        if (match) {
          row.nutritionId = match;
          touched = true;
        }
      }
    }

    // Link nutritionId → RDA option (fill missing rda only)
    if (Array.isArray(RDAOptions) && RDAOptions.length) {
      for (const row of next) {
        if (!row?.nutritionId?.value) continue;
        if (row.rda?.data != null || row.rda?.dataUnit) continue;
        const match = RDAOptions.find(
          (option: any) => option?.dataId?.value === row.nutritionId?.value
        );
        if (match) {
          row.rda = match;
          touched = true;
        }
      }
    }

    // %DV from RDA
    for (const row of next) {
      if (
        row?.perServing == null ||
        row?.perServing === "" ||
        !row?.nutritionId ||
        !row?.uom?.label ||
        !row?.rda?.data
      ) {
        continue;
      }
      const converted = conversionTable(
        row.perServing,
        row.uom.label,
        row.rda.dataUnit
      );
      const dv = roundabout((converted / row.rda.data) * 100);
      const nextDv = Number.isFinite(dv) ? dv : 0;
      if (row.dv !== nextDv) {
        row.dv = nextDv;
        touched = true;
      }
    }

    const byKey = (...keys: string[]) => findRow(next, ...keys);
    const unitGm = findUnit(measurementScaleOptions, "gm", "g");
    const unitMg = findUnit(measurementScaleOptions, "mg");

    const patchDerived = (
      key: string,
      value: number,
      uom?: { label?: string; value?: any }
    ) => {
      const index = next.findIndex((row) => rowKey(row) === key);
      if (index < 0) return; // user removed this row — leave it gone
      const option = nutritionsOptions?.find((o: any) => o?.key === key);
      if (!option || !uom?.label) return;
      const perServing = roundabout(value, 2);
      const prev = next[index];
      if (
        prev.perServing === perServing &&
        prev.uom?.label === uom.label &&
        prev.uom?.value === uom.value
      ) {
        return;
      }
      next[index] = {
        ...prev,
        nutritionId: option,
        perServing,
        uom: { label: uom.label, value: uom.value },
        disabled: key === "unsaturated_fat" ? true : prev.disabled,
      };
      touched = true;
    };

    const totalFat = byKey("total_fat", "fat");
    const satFat = byKey("saturated_fat");
    const transFat = byKey("trans_fat");
    if (totalFat && satFat && transFat && unitGm) {
      const total = unitConversions(
        parseFloat(String(totalFat.perServing)),
        totalFat.uom?.label
      );
      const sat = unitConversions(
        parseFloat(String(satFat.perServing)),
        satFat.uom?.label
      );
      const trans = unitConversions(
        parseFloat(String(transFat.perServing)),
        transFat.uom?.label
      );
      if (total != null && sat != null && trans != null) {
        patchDerived("unsaturated_fat", Math.abs(total - (sat + trans)), unitGm);
      }
    }

    const addedSugar = byKey("added_sugars");
    const totalSugar = byKey("total_sugars");
    if (addedSugar && totalSugar && unitGm) {
      const added = unitConversions(
        parseFloat(String(addedSugar.perServing)),
        addedSugar.uom?.label
      );
      const total = unitConversions(
        parseFloat(String(totalSugar.perServing)),
        totalSugar.uom?.label
      );
      if (added != null && total != null) {
        patchDerived("natural_sugar", total - added, unitGm);
      }
    }

    const salt = byKey("salt");
    if (salt && unitMg) {
      const saltG = unitConversions(
        parseFloat(String(salt.perServing)),
        salt.uom?.label
      );
      if (saltG != null && !Number.isNaN(saltG) && saltG > 0) {
        patchDerived("sodium", Number((saltG / 2.5).toFixed(2)), unitMg);
      }
    }

    if (touched) writeNf(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nf,
    RDAOptions,
    nutritionsOptions,
    measurementScaleOptions,
    servingSize,
    netWeight,
    weightUOM,
    servingUOM,
  ]);

  return null;
}
