import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { config } from "config";
import type { IStoreOrderState, SetStoreOrdersPayload } from ".";

const initialState: IStoreOrderState = {
  count: 0,
  order: null,
  orders: [],
  loading: false,
  refresh: 0,
  filters: { page: 1, page_size: config.PAGE_SIZE },
};

export const storeOrderSlice = createSlice({
  name: "storeOrder",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setOrder: (state, action: PayloadAction<any>) => {
      state.order = action.payload;
    },
    setOrders: (state, action: PayloadAction<SetStoreOrdersPayload>) => {
      state.orders = action.payload.orders || [];
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

export const storeOrderActions = storeOrderSlice.actions;
export default storeOrderSlice.reducer;
