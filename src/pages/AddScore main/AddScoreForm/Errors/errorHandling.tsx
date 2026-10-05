import { useMemo } from "react";
import type { NutrientOption, ScoreObject, ScorePayload } from "../types/scoreTypes";

export const errorHandling = (positiveData: ScoreObject[], negativeData: ScoreObject[]) => {
  if (!Array.isArray(positiveData)) return;

  // 🛡️ Deep clone the full structure
  const plusData = JSON.parse(JSON.stringify(positiveData)) as ScoreObject[];
  const negData = JSON.parse(JSON.stringify(negativeData)) as ScoreObject[];

  for (const DataItem of plusData) {
    const conditions = DataItem.conditions;
    if (!conditions) continue;

    for (const [nutrientKey, nutrient] of Object.entries(conditions)) {
      const operatorVal = typeof nutrient.operator === 'object' ? nutrient.operator.value : nutrient.operator || "";
      const minVal = typeof nutrient.min === 'object' ? nutrient.min.value : nutrient.min || "";
      const maxVal = nutrient.max ? (typeof nutrient.max === 'object' ? nutrient.max.value : nutrient.max) : "";
      const signVal = typeof nutrient.sign === 'object' ? nutrient.sign.value : nutrient.sign || "";

      // Set required state for each field based on validation rules
      conditions[nutrientKey] = {
        min: {
          value: minVal,
          required: minVal.toString().trim() === "" && operatorVal !== "-"
        },
        max: {
          value: maxVal,
          required: operatorVal === "-" && maxVal?.toString().trim() === ""
        },
        operator: {
          value: operatorVal,
          required: operatorVal.toString().trim() === ""
        },
        sign: {
          value: signVal,
          required: signVal.toString().trim() === ""
        },
      };

      if (operatorVal === "-") {
        const minField = conditions[nutrientKey].min;
        const maxField = conditions[nutrientKey].max;
        
        if (minField) {
          minField.required = minVal.toString().trim() === "";
        }
        if (maxField) {
          maxField.required = maxVal?.toString().trim() === "";
        }
      }
    }
  }

  for (const DataItem of negData) {
    const conditions = DataItem.conditions;
    if (!conditions) continue;

    for (const [nutrientKey, nutrient] of Object.entries(conditions)) {
      const operatorVal = typeof nutrient.operator === 'object' ? nutrient.operator.value : nutrient.operator || "";
      const minVal = typeof nutrient.min === 'object' ? nutrient.min.value : nutrient.min || "";
      const maxVal = nutrient.max ? (typeof nutrient.max === 'object' ? nutrient.max.value : nutrient.max) : "";
      const signVal = typeof nutrient.sign === 'object' ? nutrient.sign.value : nutrient.sign || "";
      // Set required state for each field based on validation rules
      conditions[nutrientKey] = {
        min: {
          value: minVal,
          required: minVal.toString().trim() === "" && operatorVal !== "-"
        },
        max: {
          value: maxVal,
          required: operatorVal === "-" && maxVal?.toString().trim() === ""
        },
        operator: {
          value: operatorVal,
          required: operatorVal.toString().trim() === ""
        },
        sign: {
          value: signVal,
          required: signVal.toString().trim() === ""
        },
      };

      if (operatorVal === "-") {
        const minField = conditions[nutrientKey].min;
        const maxField = conditions[nutrientKey].max;
        
        if (minField) {
          minField.required = minVal.toString().trim() === "";
        }
        if (maxField) {
          maxField.required = maxVal?.toString().trim() === "";
        }
      }
    }
  }


  return {plusData,negData};
};


// ------------------- Score Transformation ------------------------

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
        min: Number(condition.min.value),
        max: condition.max?.value != null ? Number(condition.max.value) : null,
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


