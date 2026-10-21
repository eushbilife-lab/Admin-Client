import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { config } from "config";
import type {
  IProcessingLevelState,
  SetProcessingLevelOptionsPayload,
  SetProcessingLevelsPayload,
} from ".";

const default_page_size = Number(config.PAGE_SIZE) || 20;

const initialState: IProcessingLevelState = {
  count: 0,
  items: [],
  options: [],
  loading: false,
  refreshLoader: false,
  refresh: 0,
  filters: { page: 1, page_size: default_page_size },
};

export const processingLevelSlice = createSlice({
  name: "processingLevel",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setItems: (state, action: PayloadAction<SetProcessingLevelsPayload>) => {
      state.items = action.payload.items || [];
      state.count = action.payload.count || 0;
      state.refreshLoader = false;
    },
    setOptions: (
      state,
      action: PayloadAction<SetProcessingLevelOptionsPayload>
    ) => {
      state.options = action.payload.options || [];
    },
    upsertItem: (state, action: PayloadAction<any>) => {
      const row = action.payload;
      const idx = state.items.findIndex((item) => item._id === row._id);
      if (idx >= 0) state.items[idx] = row;
      else state.items.unshift(row);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.count = Math.max(0, state.count - 1);
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state) => {
      state.filters.page = 1;
    },
  },
});

const processingLevelReducer = processingLevelSlice.reducer;
export const processingLevelActions = processingLevelSlice.actions;
export default processingLevelReducer;
