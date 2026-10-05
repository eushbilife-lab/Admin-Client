export { default, nutritionActions,nutritionSlice } from "./nutritionSlice";

export interface nutritionState {
  nutrition: any;
  nutritions: any[];
  count: number;
  refresh: number;
  loading: boolean;
  refreshLoader: boolean;
  nutritionsOptions: any[];
  notFounded:boolean
}

export interface SetNutritionStatePayload {
  nutritions: any[];
}

