import  { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SelectOption } from "@core/basic-components/Select";
import { config } from "config";
import type {
  IFoodIntolerance,
  SetFoodIntolerancePayload,
  SetFoodIntoleranceOptionsPayload,
  SetFoodIntolerancesPayload,
} from ".";

const default_page_size = config.PAGE_SIZE;

const initialState: IFoodIntolerance = {
  count: 0,
  foodIntolerance: {},
  foodIntolerances: [],
  loading: true,
  current_filters: {},
  filters: { page: 1, page_size: default_page_size },
  foodIntoleranceOptions: [],
  refreshLoader: false,
  refresh: 0,
};

export const foodIntoleranceSlice = createSlice({
    name: "foodIntolerance",
  initialState,
  reducers: {
    clear_search: (state) => {
      state.foodIntolerances = [];
      state.foodIntoleranceOptions = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFoodIntolerance: (state, action: PayloadAction<SetFoodIntolerancePayload>) => {
      const { data } = action.payload;
      const existingIndex = state.foodIntolerances.findIndex(
        (item) => item?._id === data?._id
      );
      if (existingIndex !== -1) {
        state.foodIntolerances[existingIndex] = data;
      } else {
        state.foodIntolerances.unshift(data);
      }
    },
    addFoodIntolerance: (state, action) => {
      state.foodIntolerances.unshift(action.payload);
    },
    setFoodIntolerances: (state, action: PayloadAction<SetFoodIntolerancesPayload>) => {
      const { count, foodIntolerances } = action.payload;
      state.count = count;
      state.refreshLoader = false;

      let options: SelectOption[] = [];
      for (const { _id, en, ar, status } of foodIntolerances) {
        options.push({
          value: _id,
          label: en?.name || "",
        });
      }
      state.foodIntolerances = foodIntolerances;
      state.foodIntoleranceOptions = options;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state) => {
      state.filters.page = 1;
    },
    setOptions: (state, action: PayloadAction<SetFoodIntoleranceOptionsPayload>) => {
      const { foodIntolerances } = action.payload;
      const options: SelectOption[] = foodIntolerances?.map(
        ({ value, label }: any) => ({
          value: value,
          label:label?.en?.name || label?.en?.nameKey,
        })
      );
        state.foodIntoleranceOptions = options;
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

const foodIntoleranceReducer = foodIntoleranceSlice.reducer;

export const foodIntoleranceActions = foodIntoleranceSlice.actions;
export default foodIntoleranceReducer;
