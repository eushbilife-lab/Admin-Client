import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { config } from "config";
import { IRecipeState, SetRecipesPayload } from ".";

const default_page_size = config.PAGE_SIZE;

const initialState: IRecipeState = {
  count: 0,
  recipe: null,
  recipes: [],
  loading: false,
  refreshLoader: false,
  refresh: 0,
  filters: { page: 1, page_size: default_page_size },
};

export const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setRecipe: (state, action: PayloadAction<any>) => {
      state.recipe = action.payload;
      if (!action.payload?._id) return;
      const idx = state.recipes.findIndex((r) => r._id === action.payload._id);
      if (idx >= 0) state.recipes[idx] = action.payload;
      else state.recipes.unshift(action.payload);
    },
    setRecipes: (state, action: PayloadAction<SetRecipesPayload>) => {
      state.recipes = action.payload.recipes || [];
      state.count = action.payload.count || 0;
      state.refreshLoader = false;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state) => {
      state.filters.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.refresh += 1;
      state.refreshLoader = true;
      state.filters.page = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.refreshLoader = true;
    },
  },
});

export const recipeActions = recipeSlice.actions;
export default recipeSlice.reducer;
