import { unitConversion, unitConversions } from "utils/nfUnit.conversions";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { conversionTable } from "utils/conversion.util";
import { roundabout } from "utils/roundabout";
import { useEffect, useRef } from "react";
import { change } from "redux-form";
import { useParams } from "react-router-dom";
import { roundToHalfOrWhole } from "utils/rountToHalfOrWhole.util";

export default function Calculate() {
  const form = "AddProductForm";
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const nf = useAppSelector((state) => state.form[form]?.values?.nf);
  const ingredients = useAppSelector(
    (state) => state.form[form]?.values?.ingredients
  );
  const prevNfRef = useRef<string>(JSON.stringify(nf));
  const { nutritionsOptions } = useAppSelector((state) => state?.nutrition);
  const { RDAOptions } = useAppSelector((state) => state?.rda);
  const { measurementScaleOptions } = useAppSelector(
    (state) => state?.measurementScale?.uom
  );

  // nutri factor
  const formValues = useAppSelector((state) => state.form[form]?.values);
  const { netWeight, weightUOM, servingSize, servingUOM } = formValues || {};

  // level 4
  const level4 = useAppSelector((state) => state.form[form]?.values?.level4_id);
  const level3 = useAppSelector((state) => state.form[form]?.values?.level3_id);
  const level2 = useAppSelector((state) => state.form[form]?.values?.level2_id);

  // levels Options
  const level3Options = useAppSelector((state) => state.level3?.level3Options);
  const level2Options = useAppSelector((state) => state.level2?.level2Options);
  const level1Options = useAppSelector((state) => state.level1?.level1Options);

  // rda
  const rdaSection = useAppSelector(
    (state) => state.form[form]?.values?.rdaSection
  );

  // per serving container
  useEffect(() => {
    if (!netWeight || !weightUOM || !servingSize || !servingUOM) return;
    const net = unitConversion(netWeight, weightUOM.label);
    const size = unitConversion(servingSize, servingUOM.label);
    if (net && size && size !== 0) {
      const spcValue = roundToHalfOrWhole(net / size);
      dispatch(change(form, "servingsPerContainer", spcValue));
    }
  }, [netWeight, weightUOM, servingSize, servingUOM, dispatch]);

  useEffect(() => {
    if (!ingredients || ingredients.length === 0) return;

    const totalIngredientContent = ingredients.reduce(
      (sum: number, item: any) => {
        const content = Number(item.ingredientContent);
        if (isNaN(content)) return sum; // skip invalid numbers
        return sum + content;
      },
      0
    );

    dispatch(change(form, "fruitsVegNutsPercent", totalIngredientContent));
  }, [ingredients, dispatch]);

  // default calories and sodium value to 0
  useEffect(() => {
    if (!nf || nf.length === 0) return;
    let nfInfo = JSON.parse(JSON.stringify(nf));
    nfInfo = nfInfo.map((item: any) => {
      if (
        item?.nutritionId?.key === "calories" ||
        item?.nutritionId?.key === "sodium"
      ) {
        item.dv = 0;
        // item.nFDv = 0;
      }
      return item;
    });

    if (JSON.stringify(nfInfo) !== JSON.stringify(nf)) {
      dispatch(change(form, "nf", nfInfo));
    }
  }, [nf, nutritionsOptions, dispatch]);

  // carbs count
  useEffect(() => {
    if (!servingSize) return;
    const totalCarbohydrate = nf.find(
      (item: any) => item.nutritionId?.key === "total_carbohydrate"
    );
    const convertedCarbs = unitConversion(
      totalCarbohydrate?.perServing,
      totalCarbohydrate?.uom?.label
    );
    const convertedServingSize = unitConversion(servingSize, servingUOM?.label);
    if (convertedCarbs && convertedServingSize) {
      const carbsCountValue = roundabout(
        (convertedCarbs / 100) * convertedServingSize
      );
      dispatch(change(form, "carbsCount", carbsCountValue || 0));
    }
  }, [nf, servingSize, dispatch]);

  // rda to nutrition
  useEffect(() => {
    if (
      !nf ||
      nf.length === 0 ||
      !nutritionsOptions ||
      nutritionsOptions.length === 0
    )
      return;
    let nfInfo = JSON.parse(JSON.stringify(nf));
    const rdaItems = nfInfo.filter((item: any) => item?.rda?.dataId);
    if (rdaItems.length > 0) {
      rdaItems.forEach((rdaItem: any) => {
        const { dataId } = rdaItem.rda;
        const matchingNutritionOption = nutritionsOptions.find(
          (option: any) => option?.value === dataId?.value
        );
        if (matchingNutritionOption) {
          rdaItem.nutritionId = matchingNutritionOption;
        }
      });

      if (JSON.stringify(nfInfo) !== JSON.stringify(nf)) {
        dispatch(change(form, "nf", nfInfo));
      }
    }
  }, [nf, dispatch]);

  // nutriotion to rda
  useEffect(() => {
    if (!nf || nf.length === 0 || !RDAOptions || RDAOptions.length === 0)
      return;

    let nfInfo = JSON.parse(JSON.stringify(nf));
    const nutritionItems = nfInfo.filter((item: any) => item?.nutritionId);

    if (nutritionItems.length > 0) {
      nutritionItems.forEach((nutrition: any) => {
        const { nutritionId } = nutrition;
        const matchingRdaOption = RDAOptions?.find(
          (option: any) => option?.dataId?.value === nutritionId?.value
        );
        if (matchingRdaOption) {
          nutrition.rda = matchingRdaOption;
        }
      });

      // If the state has changed (i.e., new rda added), dispatch the updated nf
      if (JSON.stringify(nfInfo) !== JSON.stringify(nf)) {
        dispatch(change(form, "nf", nfInfo));
      }
    }
  }, [nf, RDAOptions, dispatch]);

  // set dv
  useEffect(() => {
    if (!nf || nf.length === 0) return;
    let nfInfo = JSON.parse(JSON.stringify(nf));
    nfInfo.filter((item: any) => {
      if (
        // item.per100g &&
        item?.perServing &&
        item?.nutritionId &&
        item?.uom?.label &&
        item?.rda
      ) {
        let conValue = conversionTable(
          item?.perServing,
          item.uom?.label,
          item?.rda?.dataUnit
        );
        let dv = roundabout((conValue / item?.rda?.data) * 100);
        item.dv = Number.isNaN(dv) || dv == null ? 0 : dv;
      }
      return item;
    });

    if (JSON.stringify(nfInfo) !== JSON.stringify(nf)) {
      dispatch(change(form, "nf", nfInfo));
    }
  }, [nf, rdaSection, dispatch]);

  useEffect(() => {
    if (!rdaSection || rdaSection.length === 0) return;
    let nfDataValue = nf.filter((item: any) => Object.keys(item).length > 0);
    let nfData = [
      ...nfDataValue,
      ...rdaSection.map((item: any) => ({
        nutritionId: item?.dataId,
        rda: {
          label: item?.label,
          value: item?.value,
          data: item?.data,
          dataUnit: item?.dataUnit,
        },
      })),
    ];

    if (JSON.stringify(nfData) !== JSON.stringify(nf)) {
      dispatch(change(form, "nf", nfData));
    }
  }, [rdaSection, dispatch]);

  //level 4
  useEffect(() => {
    if (!level4) return;

    const subCategoryID = level4?.subCategoryID;
    const HNSSProductCategory = level4?.HNSSProductCategoryID;
    const categoryID = subCategoryID?.categoryID;
    const mainCategoryID = categoryID?.mainCategoryID;

    const level3Match = level3Options.find(
      (item: any) => item.value === subCategoryID?._id
    );
    const level2Match = level2Options.find(
      (item: any) => item.value === categoryID?._id
    );
    const level1Match = level1Options.find(
      (item: any) => item.value === mainCategoryID
    );

    if (level3Match) dispatch(change(form, "level3_id", level3Match));
    if (level2Match) dispatch(change(form, "level2_id", level2Match));
    if (level1Match) dispatch(change(form, "level1_id", level1Match));

    if (HNSSProductCategory?._id) {
      dispatch(
        change(form, "HNSSProductCategory", {
          label: HNSSProductCategory?.en?.name,
          value: HNSSProductCategory?._id,
        })
      );
    }
  }, [level4, level3Options, level2Options, level1Options, dispatch, form]);

  // level 3
  useEffect(() => {
    if (!level3 || level3?.length === 0) return;

    const categoryID = level3?.categoryID;
    const mainCategoryID = level3?.categoryID?.mainCategoryID;

    const level2Match = level2Options.find(
      (item: any) => item.value === categoryID?._id
    );
    const level1Match = level1Options.find(
      (item: any) => item.value === mainCategoryID
    );

    if (level2Match) dispatch(change(form, "level2_id", level2Match));
    if (level1Match) dispatch(change(form, "level1_id", level1Match));
  }, [level3, level2Options, level1Options, dispatch]);

  // level2
  useEffect(() => {
    if (!level2 || level2?.length === 0) return;

    const mainCategoryID = level2?.mainCategoryID;

    const level1Match = level1Options.find(
      (item: any) => item.value === mainCategoryID?._id
    );

    if (level1Match) dispatch(change(form, "level1_id", level1Match));
  }, [level2, level1Options, dispatch]);

  useEffect(() => {
    if (!nf) return;
    let nfInfo = JSON.parse(JSON.stringify(nf));

    const getNutritionItem = (key: string) =>
      nf.find((item: any) => item?.nutritionId?.key === key);
    const getUnitItem = (key: string) =>
      measurementScaleOptions.find((item: any) => item.label === key);

    const saltItem = getNutritionItem("salt");
    const addedSugarItem = getNutritionItem("added_sugars");
    const totalSugarItem = getNutritionItem("total_sugars");
    const totalfatItem = getNutritionItem("total_fat");
    const transFatItem = getNutritionItem("trans_fat");
    const saturatedFatItem = getNutritionItem("saturated_fat");

    const updateNutritionInfo = (key: string, value: number, uom: any) => {
      const nutritionOption = nutritionsOptions.find(
        (option: any) => option.key === key
      );
      if (nutritionOption) {
        const existingIndex = nfInfo.findIndex(
          (item: any) => item?.nutritionId?.key === key
        );

        const newEntry = {
          nutritionId: nutritionOption,
          perServing: roundabout(value, 2),
          uom: { label: uom.label, value: uom.value },
        };

        if (existingIndex !== -1) {
          nfInfo[existingIndex] = newEntry; // Update existing entry
        } else {
          nfInfo.push(newEntry); // Add at the end
        }
      }
    };

    // Process unsaturated fat
    if (totalfatItem && transFatItem && saturatedFatItem) {
      const totalfat = unitConversions(
        parseFloat(totalfatItem?.perServing),
        totalfatItem.uom?.label
      );
      const saturatedFat = unitConversions(
        parseFloat(saturatedFatItem?.perServing),
        saturatedFatItem.uom?.label
      );
      const transFat = unitConversions(
        parseFloat(transFatItem?.perServing),
        transFatItem.uom?.label
      );

      if (
        totalfat !== undefined &&
        saturatedFat !== undefined &&
        transFat !== undefined
      ) {
        const gramUnitItem = getUnitItem("gm");
        let unsatFat = totalfat - (saturatedFat + transFat);
        updateNutritionInfo("unsaturated_fat", Math.abs(unsatFat), {
          label: gramUnitItem?.label,
          value: gramUnitItem?.value,
        });
      }
    }

    // Process natural sugar
    if (addedSugarItem && totalSugarItem) {
      const addedSugar = unitConversions(
        parseFloat(addedSugarItem?.perServing),
        addedSugarItem.uom?.label
      );
      const totalSugar = unitConversions(
        parseFloat(totalSugarItem?.perServing),
        totalSugarItem.uom?.label
      );

      if (addedSugar !== undefined && totalSugar !== undefined) {
        const gramUnitItem = getUnitItem("gm");
        updateNutritionInfo("natural_sugar", totalSugar - addedSugar, {
          label: gramUnitItem?.label,
          value: gramUnitItem?.value,
        });
      }
    }

    // Process sodium (from salt)
    if (saltItem) {
      const saltValue = unitConversions(
        parseFloat(saltItem?.perServing),
        saltItem.uom?.label
      );
      if (saltValue !== undefined) {
        const sodium = saltValue / 2.5;
        if (!isNaN(sodium) && sodium > 0) {
          const unitInMilliGram = getUnitItem("mg");
          updateNutritionInfo("sodium", parseFloat(sodium.toFixed(2)), {
            label: unitInMilliGram?.label,
            value: unitInMilliGram?.value,
          });
        }
      }
    }

    // Maintain field order when updating state
    const newNfInfo = JSON.stringify(nfInfo);
    if (newNfInfo !== prevNfRef.current) {
      dispatch(
        change(form, "nf", [
          ...nf.filter(
            (oldItem: any) =>
              !nfInfo.some(
                (newItem: any) =>
                  newItem.nutritionId?.key === oldItem.nutritionId?.key
              )
          ),
          ...nfInfo,
        ])
      );
      prevNfRef.current = newNfInfo;
    }
  }, [nf, servingSize, netWeight, weightUOM, servingUOM, dispatch]);

  useEffect(() => {
    if (!nf || !nutritionsOptions?.length || id) return;
    const requiredKeys = [
      "calories",
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
    const existingKeys = new Set(nf.map((item: any) => item?.nutritionId?.key));

    const newOptions = nutritionsOptions.filter(
      (item: any) =>
        requiredKeys.includes(item?.key) && !existingKeys.has(item?.key)
    );

    const sortedNewOptions = newOptions.sort(
      (a, b) => requiredKeys.indexOf(a?.key) - requiredKeys.indexOf(b?.key)
    );

    if (!sortedNewOptions.length) return;

    const updatedNf = [
      ...sortedNewOptions.map((item: any) => ({
        nutritionId: item,
        disabled: item?.key === "unsaturated_fat", // Add disabled property
      })),
    ];
    dispatch(change(form, "nf", updatedNf));
  }, [nutritionsOptions, dispatch]);

  return null;
}
