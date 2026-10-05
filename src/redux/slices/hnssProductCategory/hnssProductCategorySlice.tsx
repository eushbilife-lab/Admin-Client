import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { config } from "config";
import { SelectOption } from "@core/basic-components/Select";
import {
  HNSSProductCategoriesState,
  SetHNSSProductCategoriesItemsPayload,
  SetHnssProductCategoryOptionsPayload,
} from ".";

const default_page_size = config.PAGE_SIZE;

const initialState: HNSSProductCategoriesState = {
  count: 0,
  hnssProductCategories: [],
  hnssProductCategory: {},
  loading: false,
  current_filters: {},
  refreshLoader: false,
  hnssProductCategoryOptions: [],
  refresh: 0,
  filters: { page: 1, page_size: default_page_size },
};

export const hnssProductCategorySlice = createSlice({
  name: "hnssProductCategory",
  initialState,
  reducers: {
    clear_search: (state) => {
      state.hnssProductCategories = [];
      state.hnssProductCategoryOptions = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLevel1: (state, action) => {
      state.hnssProductCategory = action.payload;
    },
    addLevel1Item: (state, action) => {
      state.hnssProductCategories.unshift(action.payload);
    },
    setLevels1: (
      state,
      action: PayloadAction<SetHNSSProductCategoriesItemsPayload>
    ) => {
      const { count, hnssProductCategories } = action.payload;
      state.count = count;
      state.refreshLoader = false;
      state.hnssProductCategories = hnssProductCategories;
    },
    setOptions: (
      state,
      action: PayloadAction<SetHnssProductCategoryOptionsPayload>
    ) => {
      const { hnssProductCategories } = action.payload;
      const options: SelectOption[] = hnssProductCategories?.map(
        ({ value, label }: any) => ({
          value: value,
          label: label?.en?.name || label?.name,
        })
      );
      state.hnssProductCategoryOptions = options;
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

const hnssProductCategoryReducer = hnssProductCategorySlice.reducer;

export const hnssProductCategoryActions = hnssProductCategorySlice.actions;
export default hnssProductCategoryReducer;
