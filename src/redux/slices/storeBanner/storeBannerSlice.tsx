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
    removeBanner: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const before = state.banners.length;
      state.banners = state.banners.filter((b: any) => b._id !== id);
      if (state.banners.length < before) {
        state.count = Math.max(0, (state.count || 0) - 1);
      }
      if (state.banner?._id === id) state.banner = null;
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
