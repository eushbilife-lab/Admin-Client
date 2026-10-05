import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { config } from "config";
import { Level1State, SetLevel1OptionsPayload } from ".";
import { SetLevel1ItemsPayload } from ".";
import { SelectOption } from "@core/basic-components/Select";

const default_page_size = config.PAGE_SIZE;

const initialState: Level1State = {
  count: 0,
  levels1: [],
  level1: {}, 
  loading: false,
  current_filters: {},
  refreshLoader: false,
  level1Options: [],
  refresh: 0,
  filters: { page: 1, page_size: default_page_size },
};

export const level1Slice = createSlice({
  name: "level1",
  initialState,
  reducers: {
    clear_search: (state) => {
      state.levels1 = [];
      state.level1Options = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLevel1: (state, action) => {
      state.level1 = action.payload;
    },
    addLevel1Item: (state, action) => {
      state.levels1.unshift(action.payload);
    },
    setLevels1: (state, action: PayloadAction<SetLevel1ItemsPayload>) => {
      const { count, levels1 } = action.payload;
      state.count = count;
      state.refreshLoader = false;
      state.levels1 = levels1;
    },
    setOptions: (state, action: PayloadAction<SetLevel1OptionsPayload>) => {
      const { levels1 } = action.payload;
      const options: SelectOption[] = levels1?.map(({value, label }: any) => ({
        value: value,
        label:label?.en?.name || label?.name,
      }));
      state.level1Options = options;
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

const level1Reducer = level1Slice.reducer;

export const level1Actions = level1Slice.actions;
export default level1Reducer;
