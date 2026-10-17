import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { config } from "config";
import type { IStoreBannerState, SetStoreBannersPayload } from ".";

const initialState: IStoreBannerState = {
  count: 0,
  banner: null,
  banners: [],
  loading: false,
  refresh: 0,
  filters: { page: 1, page_size: config.PAGE_SIZE },
};

export const storeBannerSlice = createSlice({
  name: "storeBanner",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setBanner: (state, action: PayloadAction<any>) => {
      state.banner = action.payload;
    },
    setBanners: (state, action: PayloadAction<SetStoreBannersPayload>) => {
      state.banners = action.payload.banners || [];
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

export const storeBannerActions = storeBannerSlice.actions;
export default storeBannerSlice.reducer;
