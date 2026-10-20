import type { ScoreObject, ScorePayload } from "../types/scoreTypes";

function isFilled(condition: any): boolean {
  const op = String(condition?.operator?.value ?? "").trim();
  const min = String(condition?.min?.value ?? "").trim();
  const sign = String(condition?.sign?.value ?? "").trim();
  return Boolean(op && min !== "" && sign);
}

/** Convert UI grid rows → API nutrient blocks. Skips empty cells. */
export const transformScores = (
  scores: ScoreObject[],
  nutrients: { label: string; nutrientIDs: string[] }[]
): ScorePayload[] => {
  const result: Record<string, ScorePayload> = {};

  for (const { score, conditions } of scores || []) {
    const scoreValue = Number(score ?? 0);
    if (!Number.isFinite(scoreValue)) continue;

    for (const [label, condition] of Object.entries(conditions || {})) {
      if (!isFilled(condition)) continue;

      const group = nutrients.find((n) => n.label === label);
      if (!group?.nutrientIDs?.length) continue;

      const operator = String(condition.operator.value);
      const minRaw = condition.min.value;
      const maxRaw = condition.max?.value;
      const min = minRaw === "" || minRaw == null ? null : Number(minRaw);
      const max =
        operator === "-" && maxRaw !== "" && maxRaw != null
          ? Number(maxRaw)
          : null;

      if (min == null || Number.isNaN(min)) continue;
      if (operator === "-" && (max == null || Number.isNaN(max))) continue;
      if (operator === "-" && max! < min) continue;

      const entry = {
        score: scoreValue,
        operator,
        min,
        max: operator === "-" ? max : null,
        sign: String(condition.sign.value),
      };

      if (!result[label]) {
        result[label] = {
          nutritionID: group.nutrientIDs,
          scores: [entry],
        };
      } else {
        result[label].scores.push(entry);
      }
    }
  }

  return Object.values(result);
};

/** Mark invalid cells on the grid; returns false if submit should stop. */
export function validateScoreGrid(
  scores: ScoreObject[] | undefined,
  side: "positive" | "negative"
): { ok: boolean; message?: string; scores?: ScoreObject[] } {
  if (!scores?.length) {
    return { ok: true, scores: scores || [] };
  }

  let ok = true;
  let message = "";
  const next = scores.map((row) => {
    const conditions = { ...row.conditions };
    for (const [key, condition] of Object.entries(conditions)) {
      const op = String(condition?.operator?.value ?? "").trim();
      const minStr = String(condition?.min?.value ?? "").trim();
      const maxStr = String(condition?.max?.value ?? "").trim();
      const sign = String(condition?.sign?.value ?? "").trim();
      const any =
        Boolean(op) || minStr !== "" || maxStr !== "" || Boolean(sign);
      if (!any) continue;

      const patched = {
        ...condition,
        operator: { ...condition.operator, required: !op },
        min: { ...condition.min, required: minStr === "" },
        max: {
          ...condition.max,
          required: op === "-" && maxStr === "",
          value: condition.max?.value ?? "",
        },
        sign: { ...condition.sign, required: !sign },
      };

      if (op === "-" && minStr !== "" && maxStr !== "") {
        const min = Number(minStr);
        const max = Number(maxStr);
        if (Number.isFinite(min) && Number.isFinite(max) && max < min) {
          patched.max = { ...patched.max, required: true };
          ok = false;
          message = `${side}: max must be ≥ min (point ${row.score})`;
        }
      }

      if (
        patched.operator.required ||
        patched.min.required ||
        patched.max.required ||
        patched.sign.required
      ) {
        ok = false;
        if (!message) {
          message = `${side}: complete all fields for filled cells (point ${row.score})`;
        }
      }
      conditions[key] = patched as any;
    }
    return { ...row, conditions };
  });

  return { ok, message, scores: next };
}
