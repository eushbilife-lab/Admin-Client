import type {ScoreObject, ScorePayload } from "../types/scoreTypes";

export const transformScores = (
  scores: ScoreObject[],
  nutrients: { label: string; nutrientIDs: string[] }[]
): ScorePayload[] => {
  const result: Record<string, ScorePayload> = {};

  for (const { score, conditions } of scores) {
    const scoreValue = Number(score ?? 0);

    for (const [label, condition] of Object.entries(conditions)) {
      const group = nutrients.find((n) => n.label === label);
      if (!group) continue;

      const entry = {
        score: scoreValue,
        operator: condition.operator.value,
        min: condition.min.value,
        max: condition.max?.value != null ? condition.max.value : null,
        sign: condition.sign.value,
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


