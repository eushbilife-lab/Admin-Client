import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { config } from "config";
import type { IStoreProductState, SetStoreProductsPayload } from ".";

const initialState: IStoreProductState = {
  count: 0,
  product: null,
  products: [],
  loading: false,
  refresh: 0,
  filters: { page: 1, page_size: config.PAGE_SIZE },
};

export const storeProductSlice = createSlice({
  name: "storeProduct",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProduct: (state, action: PayloadAction<any>) => {
      state.product = action.payload;
    },
    setProducts: (state, action: PayloadAction<SetStoreProductsPayload>) => {
      state.products = action.payload.products || [];
      state.count = action.payload.count || 0;
    },
    refresh: (state) => {
      state.refresh += 1;
    },
    resetPage: (state) => {
      state.filters.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.refresh += 1;
      state.filters.page = action.payload;
    },
  },
});

export const storeProductActions = storeProductSlice.actions;
export default storeProductSlice.reducer;
