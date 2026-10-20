import CircleLoader from "@core/basic-components/CircleLoader";
import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import { change } from "redux-form";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { scoreCalculationActions } from "redux/slices/scoreCalculation";
import ToasterService from "utils/toaster.util";
import { NutrientFields } from "..";
import type { NutrientGroup } from "../types/scoreTypes";
import ScoreConditionRow, {
  type ScoreCondition,
  type ScoreRowData,
} from "./ScoreConditionRow";
import "./scoreTable.css";

type Variant = "positive" | "negative";

type Props = {
  variant: Variant;
};

const emptyCondition = (): ScoreCondition => ({
  operator: { value: "-", required: false },
  min: { value: "", required: false },
  max: { value: "", required: false },
  sign: { value: "", required: false },
});

function buildEmptyRows(groupKeys: string[]): ScoreRowData[] {
  return Array.from({ length: 21 }, (_, i) => ({
    score: i,
    conditions: groupKeys.reduce<Record<string, ScoreCondition>>((acc, key) => {
      acc[key] = emptyCondition();
      return acc;
    }, {}),
  }));
}

function mergeRows(
  base: ScoreRowData[],
  saved: any[] | undefined
): ScoreRowData[] {
  if (!saved?.length) return base;
  return base.map((row) => {
    const match = saved.find((item: any) => Number(item.score) === row.score);
    if (!match?.conditions) return row;
    const conditions = { ...row.conditions };
    for (const groupKey of Object.keys(match.conditions)) {
      if (!conditions[groupKey]) {
        conditions[groupKey] = emptyCondition();
      }
      conditions[groupKey] = {
        ...conditions[groupKey],
        ...match.conditions[groupKey],
      };
    }
    return { ...row, conditions };
  });
}

function labelForKey(key: string, options: any[]): string {
  const parts = key.split(",");
  return parts
    .map((part) => {
      const hit = options.find(
        (o) => o.key === part || o.value === part || o.label === part
      );
      return hit?.label || part.replace(/_/g, " ");
    })
    .join(", ");
}

export default function ScoreNutrientsTable({ variant }: Props) {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const isPositive = variant === "positive";
  const typeKey = isPositive ? "positive" : "negative";
  const updatedKey = isPositive
    ? "updatedPositiveScore"
    : "updatedNegativeScore";

  const [nutrientGroups, setNutrientGroups] = useState<NutrientGroup[]>([]);
  const [localScores, setLocalScores] = useState<ScoreRowData[]>([]);
  const [ready, setReady] = useState(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  const Nutrient = useAppSelector(
    (state) => state.form.AddScoreForm?.values?.NutrientID || [],
    shallowEqual
  );
  const currentTypes = useAppSelector(
    (state) => state.form.AddScoreForm?.values?.isPositive || [],
    shallowEqual
  );
  const updatedScores = useAppSelector(
    (state) => state.scoreCalculations.score?.[updatedKey] || [],
    shallowEqual
  );
  const reduxGridScores = useAppSelector(
    (state) =>
      state.scoreCalculations.scoreCalculation?.[
        isPositive ? "positiveScores" : "negativeScores"
      ] || [],
    shallowEqual
  );
  const nutritionOptions = useAppSelector(
    (state) => state.nutrition?.nutritionsOptions || [],
    shallowEqual
  );

  const selectedTypes = useMemo(
    () => currentTypes?.map((item: { value: string }) => item.value) ?? [],
    [currentTypes]
  );
  const enabled = selectedTypes.includes(typeKey);

  const columnKeys = useMemo(
    () => nutrientGroups.map((g) => g.id),
    [nutrientGroups]
  );

  useEffect(() => {
    if (!id || !updatedScores?.length) return;
    const first = updatedScores[0];
    if (!first?.conditions) return;
    const groups: NutrientGroup[] = Object.keys(first.conditions).map((key) => ({
      id: key,
      nutrients: key.split(",").map((k) => ({
        key: k,
        label: labelForKey(k, nutritionOptions),
      })),
    }));
    setNutrientGroups(groups);
    initializedRef.current = false;
  }, [id, updatedScores, nutritionOptions]);

  useEffect(() => {
    if (!enabled) {
      setLocalScores([]);
      setReady(true);
      return;
    }
    if (!nutrientGroups.length) {
      setLocalScores([]);
      setReady(true);
      return;
    }
    if (initializedRef.current && localScores.length === 21) return;

    const keys = nutrientGroups.map((g) => g.id);
    const base = buildEmptyRows(keys);
    const merged =
      id && updatedScores?.length ? mergeRows(base, updatedScores) : base;
    setLocalScores(merged);
    setReady(true);
    initializedRef.current = true;
  }, [enabled, nutrientGroups, id, updatedScores, localScores.length]);

  useEffect(() => {
    if (!enabled) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      dispatch(
        scoreCalculationActions.setScoreCalculation(
          isPositive
            ? { positiveScores: localScores }
            : { negativeScores: localScores }
        )
      );
    }, 120);
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [localScores, dispatch, isPositive, enabled]);

  useEffect(() => {
    if (!enabled || !reduxGridScores?.length) return;
    const hasErrors = reduxGridScores.some((row: ScoreRowData) =>
      Object.values(row.conditions || {}).some(
        (c) =>
          c?.operator?.required ||
          c?.min?.required ||
          c?.max?.required ||
          c?.sign?.required
      )
    );
    if (hasErrors) setLocalScores(reduxGridScores as ScoreRowData[]);
  }, [reduxGridScores, enabled]);

  const handleAddGroup = useCallback(() => {
    if (!Nutrient.length) return;
    const groupKey = Nutrient.map((n: any) => n.key).join(",");
    if (nutrientGroups.some((g) => g.id === groupKey)) {
      ToasterService.showError("That nutrient column is already on the table");
      return;
    }
    const newGroup: NutrientGroup = {
      id: groupKey,
      nutrients: Nutrient.map((n: any) => ({
        key: n.key,
        label: n.label || n.key,
      })),
    };
    setNutrientGroups((prev) => [...prev, newGroup]);
    setLocalScores((prev) => {
      if (!prev.length) return buildEmptyRows([groupKey]);
      return prev.map((row) => ({
        ...row,
        conditions: {
          ...row.conditions,
          [groupKey]: emptyCondition(),
        },
      }));
    });
    initializedRef.current = true;
    dispatch(change("AddScoreForm", "NutrientID", []));
  }, [Nutrient, dispatch, nutrientGroups]);

  const handleDeleteGroup = useCallback((groupId: string) => {
    setNutrientGroups((prev) => prev.filter((g) => g.id !== groupId));
    setLocalScores((prev) =>
      prev.map((row) => {
        const { [groupId]: _, ...rest } = row.conditions;
        return { ...row, conditions: rest };
      })
    );
  }, []);

  const handleChange = useCallback(
    (
      scoreIndex: number,
      nutrientKey: string,
      field: keyof ScoreCondition,
      value: string
    ) => {
      setLocalScores((prev) => {
        const next = [...prev];
        const row = next[scoreIndex];
        if (!row?.conditions?.[nutrientKey]) return prev;
        next[scoreIndex] = {
          ...row,
          conditions: {
            ...row.conditions,
            [nutrientKey]: {
              ...row.conditions[nutrientKey],
              [field]: {
                ...row.conditions[nutrientKey][field],
                value,
                required: false,
              },
            },
          },
        };
        if (field === "operator" && value !== "-") {
          next[scoreIndex].conditions[nutrientKey].max = {
            value: "",
            required: false,
          };
        }
        return next;
      });
    },
    []
  );

  if (!enabled) return null;

  return (
    <section
      className={`hnss-score-section hnss-score-section--${variant}`}
      aria-label={`${variant} nutrient score table`}
    >
      <div className="hnss-score-section__head">
        <div>
          <h3>{isPositive ? "Positive nutrients" : "Negative nutrients"}</h3>
          <p>
            Points 0–20. Use <strong>Range</strong> for exclusive min–max bands
            (recommended).
          </p>
        </div>
      </div>

      <div className="hnss-score-toolbar">
        <div className="hnss-score-toolbar__field">
          <ReduxFormFields fields={NutrientFields()} />
        </div>
        <Button
          variant="contained"
          onClick={handleAddGroup}
          disabled={!Nutrient.length}
        >
          Add column
        </Button>
      </div>

      {!nutrientGroups.length ? (
        <div className="hnss-score-empty">
          <h4>No nutrient columns yet</h4>
          <p>Select one or more nutrients, then click Add column.</p>
        </div>
      ) : !ready ? (
        <Box sx={{ py: 6, display: "grid", placeItems: "center" }}>
          <CircleLoader size={48} />
        </Box>
      ) : (
        <div className="hnss-score-table-wrap">
          <table className="hnss-score-table">
            <thead>
              <tr>
                <th className="hnss-score-sticky">Pts</th>
                {nutrientGroups.map((group) => (
                  <th key={group.id} className="hnss-score-col">
                    <div className="hnss-score-col__title">
                      <span>
                        {group.nutrients.map((n) => n.label).join(", ")}
                      </span>
                      <IconButton
                        aria-label={`Remove ${group.id}`}
                        onClick={() => handleDeleteGroup(group.id)}
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {localScores.map((row) => (
                <ScoreConditionRow
                  key={`${variant}-${row.score}`}
                  score={row}
                  scoreIndex={row.score}
                  columnKeys={columnKeys}
                  tone={variant}
                  onChange={handleChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
