import { useMemo } from "react";

export type PositiveConditions = {
  min: { value: string; required: boolean };
  max: { value: string; required: boolean };
  operator: { value: string; required: boolean };
  sign: { value: string; required: boolean };
};

export type PositiveScore = {
  score: number;
  conditions: Record<string, PositiveConditions>;
};

export type PositiveNutrient = {
  key: string;
  label: string;
};

export type Condition = {
  operator: { value: string; required: boolean };
  min: { value: string | number; required: boolean };
  max?: { value: string | number | null; required: boolean };
  sign: { value: string; required: boolean };
};

export type ScoreObject = {
  score: number | string;
  conditions: Record<string, Condition>;
};

export type NutrientOption = {
  key: string;
  value: string;
  label:string
};

export type ScorePayload = {
  nutritionID: string[];
  scores: {
    score: number;
    operator: string;
    min: any;
    max: any | null;
    sign: string;
  }[];
};
export type NegativeConditions= {
  min: { value: string; required: boolean };
  max: { value: string; required: boolean };
  operator: { value: string; required: boolean };
  sign: { value: string; required: boolean };
};

export type NegativeScore = {
  score: number;
  conditions: Record<string, NegativeConditions>;
};

export type NegativeNutrient = {
  key: string;
  label: string;
};


export interface Nutrient {
  key: string;
  label: string;
}

export interface NutrientGroup {
  id: string;
  nutrients: Nutrient[];
}



  export const usePositiveNutrientOptions = (
    positiveScores: any[],
    options: NutrientOption[]
  ) =>
    useMemo(() => {
      const allKeys = new Set<string>();
      positiveScores.forEach((scoreItem) => {
        Object.keys(scoreItem.conditions || {}).forEach((key) => {
          allKeys.add(key);
        });
      });
      // Transform to nutrient groups
      return Array.from(allKeys).map((key) => {
        const keyParts = key.split(',');
        const matched = options.filter((item) => keyParts.includes(item.key));
  
        return {
          label: key, 
          nutrientIDs: matched.map((item) => item.value),
        };
      });
    }, [positiveScores, options]);
  

  export const useNegativeNutrientOptions = (
    negativeScores: any[],
    options: NutrientOption[]
  ) =>
    useMemo(() => {
      const allKeys = new Set<string>();
      negativeScores.forEach((scoreItem) => {
        Object.keys(scoreItem.conditions || {}).forEach((key) => {
          allKeys.add(key);
        });
      });
  
      // Transform to nutrient groups
      return Array.from(allKeys).map((key) => {
        const keyParts = key.split(','); // handle combined keys like "vitamin_d,vitamin_c"
        const matched = options.filter((item) => keyParts.includes(item.key));
  
        return {
          label: key, // optionally format this (e.g., titleCase or predefined label map)
          nutrientIDs: matched.map((item) => item.value),
        };
      });
    }, [negativeScores, options]);
  
  