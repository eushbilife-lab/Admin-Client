export { default, ingredientActions, ingredientSlice } from "./ingredientSlice";


export interface IIngredient {
  count: number;
  ingredient: {};
  ingredients: any[];
  loading: boolean;
  refresh: number;
  refreshLoader: boolean;
  current_filters: any;
  filters: any;
  ingredientOptions: any[];
}

export interface SetIngredientsPayload{
  ingredients: any[];
  count: number;
}
export interface SetIngredientOptionsPayload{
  ingredients: any[];
}
export interface SetIngredientPayload{
  data: {
    _id: any
  };
}