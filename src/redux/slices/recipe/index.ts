export { default, recipeActions, recipeSlice } from "./recipeSlice";

export interface IRecipeState {
  count: number;
  recipe: any;
  recipes: any[];
  loading: boolean;
  refresh: number;
  refreshLoader: boolean;
  filters: any;
}

export interface SetRecipesPayload {
  recipes: any[];
  count: number;
}
