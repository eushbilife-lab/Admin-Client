import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import { SetDraftProductPayload } from ".";
import { config } from "config";
import { DraftProductState } from ".";

const default_page_size = config.PAGE_SIZE; 

const initialState: DraftProductState = {
  count: 0,
  draftProducts: [], 
  draftProduct: {},
  loading: false,
  current_filters: {},
  refreshLoader: false,
  draftProductOptions: [],
  refresh: 0,
  filters: { page: 1, page_size: default_page_size },
};

export const draftProductSlice = createSlice({
  name: "draftProduct",
  initialState,
  reducers: {
    clear_search: (state) => {
      state.draftProducts = [];
      state.draftProductOptions = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDraftProduct: (state, action) => {
      state.draftProduct = action.payload;
    },
    addDraftProduct: (state, action) => {
      state.draftProducts.unshift(action.payload);
    },
    setDraftProducts: (state, action: PayloadAction<SetDraftProductPayload>) => {
      const { count, draftProducts } = action.payload;
      state.count = count;
      state.refreshLoader = false;
      let options: SelectOption[] = [];
      draftProducts.forEach(({ _id, name, status }: any) =>
        options.push({ value: _id, label: name + " " + status })
      );
      state.draftProducts = draftProducts;
      state.draftProductOptions = options;
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
    removeDraftProduct: (state, action: PayloadAction<string>) => {
      state.draftProducts = state.draftProducts.filter(draftProduct => draftProduct._id !== action.payload);
      state.count -= 1;
    },
  },
});

const draftProductReducer = draftProductSlice.reducer;

export const draftProductActions = draftProductSlice.actions;
export default draftProductReducer;
