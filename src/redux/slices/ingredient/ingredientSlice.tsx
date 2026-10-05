import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import { config } from "config";
import {
  IIngredient,
  SetIngredientOptionsPayload,
  SetIngredientPayload,
  SetIngredientsPayload,
} from ".";

const default_page_size = config.PAGE_SIZE;

const initialState: IIngredient = {
  count: 0,
  ingredient: {},
  ingredients: [],
  loading: true,
  current_filters: {},
  filters: { page: 1, page_size: default_page_size },
  ingredientOptions: [],
  refreshLoader: false,
  refresh: 0,
};

export const ingredientSlice = createSlice({
  name: "ingredient",
  initialState,
  reducers: {
    clear_search: (state) => {
      state.ingredients = [];
      state.ingredientOptions = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setIngredient: (state, action: PayloadAction<SetIngredientPayload>) => {
      const { data } = action.payload;
      const existingIndex = state.ingredients.findIndex(
        (item) => item._id === data._id
      );
      if (existingIndex !== -1) {
        state.ingredients[existingIndex] = data;
      } else {
        state.ingredients.unshift(data);
      }
    },
    addIntredient: (state, action) => {
      state.ingredients.unshift(action.payload);
    },
    setIngredients: (state, action: PayloadAction<SetIngredientsPayload>) => {
      const { count, ingredients } = action.payload;
      state.count = count;
      state.refreshLoader = false;

      let options: SelectOption[] = [];
      ingredients.forEach(({ _id, en, ar, status }: any) =>
        options.push({
          value: _id,
          label: en?.name || "",
        })
      );
      state.ingredients = ingredients;
      state.ingredientOptions = options;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state) => {
      state.filters.page = 1;
    },
    setOptions: (state, action: PayloadAction<SetIngredientOptionsPayload>) => {
      const { ingredients } = action.payload;
      const options: SelectOption[] = ingredients?.map(
        ({ value, label }: any) => ({
          value: value,
          label: label?.En_name || label?.en?.name || label?.name || "",
        })
      );
      state.ingredientOptions = options;
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
    setCurrentFilters: (state, action) => {
      state.current_filters = action.payload;
    },
    resetFilters: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
      state.filters = initialState.filters;
      state.current_filters = initialState.current_filters;
    },
  },
});

const ingredientReducer = ingredientSlice.reducer;

export const ingredientActions = ingredientSlice.actions;
export default ingredientReducer;
