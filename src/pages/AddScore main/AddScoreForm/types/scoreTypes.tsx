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
};

export type ScorePayload = {
  nutritionID: string[];
  scores: {
    score: number;
    operator: string;
    min: number;
    max: number | null;
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


export const positiveNutrients: PositiveNutrient[] = [
  { key: "fiber", label: "fiber" },
  { key: "protein", label: "protein" },
  { key: "VitDCA", label: "Vit: D,C,A" },
  { key: "MinFeCaK", label: "Min: Fe,Ca,K" },
  { key: "Fort", label: "Fort" },
  { key: "UnsatFat", label: "Unsat Fat" },
  { key: "NutsFruitAndVeggies", label: "Nuts, Fruit And Veggies" },
];


  export const negativeNutrients: NegativeNutrient[] = [
    { key: "Cal", label: "Cal" },
    { key: "TCarbs", label: "TCarbs" },
    { key: "AddSug", label: "AddSug" },
    { key: "NatSug", label: "NatSug" },
    { key: "Sodium", label: "Sodium" },
    { key: "Fat", label: "Fat" },
    { key: "SatFat", label: "SatFat" }, 
    { key: "Trans", label: "Trans" }, 
    { key: "Proc", label: "Proc" }, 
  ];
  
  

  export const usePositiveNutrientOptions = (options: NutrientOption[]) =>
    useMemo(() => {
      const map: Record<string, string[]> = {
        fiber: ["fiber"],
        protein: ["protein"],
        VitDCA: ["vitamin_d", "vitamin_c", "vitamin_a"],
        MinFeCaK: ["iron", "calcium", "potassium"],
        Fort: ["folatefolic_acid", "niacin", "riboflavin", "thiamin"],
        UnsatFat: ["unsaturated_fat"],
        NutsFruitAndVeggies: ["nuts","fruit","veggies"],
  
      };
  
      return Object.entries(map).map(([label, keys]) => {
        const matched = options.filter((item) => keys.includes(item.key));
        return {
          label,
          nutrientIDs: matched.map((item) => item.value),
        };
      });
    }, [options]);
  
      
  
  export const useNegativeNutrientOptions = (options: NutrientOption[]) =>
    useMemo(() => {
      const map: Record<string, string[]> = {
        Cal: ["calories"],
        TCarbs: ["total_carbohydrate"],
        AddSug: ["added_sugars"],
        NatSug: ["natural_sugar"],
        Sodium: ["sodium"],
        Fat: ["fat"],
        SatFat: ["saturated_fat"],
        Trans: ["trans_fat"],
        Proc: ["processing_level"],
      };
  
      return Object.entries(map).map(([label, keys]) => {
        const matched = options.filter((item) => keys.includes(item.key));
        return {
          label,
          nutrientIDs: matched.map((item) => item.value),
        };
      });
    }, [options]);
  