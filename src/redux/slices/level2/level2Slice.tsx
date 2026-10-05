import { Level2State,SetLevel2Payload,SetLevel2OptionsPayload } from ".";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import { config } from "config";

const default_page_size = config.PAGE_SIZE;

const initialState: Level2State = {
  count: 0,
  levels2: [], 
  level2: {}, 
  loading: false,
  current_filters: {},
  refreshLoader: false,
  level2Options: [],
  refresh: 0,
  filters: { page: 1, page_size: default_page_size },
};

export const level2Slice = createSlice({
  name: "level2",
  initialState,
  reducers: {
    clear_search: (state) => {
      state.levels2 = [];
      state.level2Options = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLevel2: (state, action) => {
      state.level2 = action.payload;
    },
    addLevel2: (state, action) => {
      state.levels2.unshift(action.payload);
    },
    setLevels2: (state, action: PayloadAction<SetLevel2Payload>) => {
      const { count, levels2 } = action.payload;
      state.count = count;
      state.refreshLoader = false;
      let options: SelectOption[] = [];
      levels2.forEach(({ _id, en }: any) =>
        options.push({ value: _id, label: en.name })
      );
      state.levels2 = levels2;
      state.level2Options = options;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state) => {
      state.filters.page = 1;
    },
    setOptions: (state, action: PayloadAction<SetLevel2OptionsPayload>) => {
      const { levels2 } = action.payload;
      const options: SelectOption[] = levels2?.map(({mainCategoryID,value, label }: any) => ({
        mainCategoryID:mainCategoryID,
        value: value,
        label:label?.en?.name || label?.name,
      }));
      state.level2Options = options;
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

const level2Reducer = level2Slice.reducer;

export const level2Actions = level2Slice.actions;
export default level2Reducer;
