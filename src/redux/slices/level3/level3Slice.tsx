import { Level3State,SetLevel3Payload,SetLevel3OptionsPayload } from ".";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import { config } from "config";

const default_page_size = config.PAGE_SIZE;

const initialState: Level3State = {
  count: 0,
  levels3: [], 
  level3: {}, 
  loading: false,
  current_filters: {},
  refreshLoader: false,
  level3Options: [], 
  refresh: 0,
  filters: { page: 1, page_size: default_page_size },
};

export const level3Slice = createSlice({
  name: "level3",
  initialState,
  reducers: {
    clear_search: (state) => {
      state.levels3 = [];
      state.level3Options = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLevel3: (state, action) => {
      state.level3 = action.payload;
    },
    addLevel3: (state, action) => {
      state.levels3.unshift(action.payload);
    },
    setLevels3: (state, action: PayloadAction<SetLevel3Payload>) => {
      const { count, levels3 } = action.payload;
      state.count = count;
      state.refreshLoader = false;

      let options: SelectOption[] = [];
      levels3.forEach(({ _id, en }: any) =>
        options.push({ value: _id, label: en.name })
      );
      state.levels3 = levels3;
      state.level3Options = options;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state) => {
      state.filters.page = 1;
    },
    setOptions: (state, action: PayloadAction<SetLevel3OptionsPayload>) => {
      const { levels3 } = action.payload;
      const options: SelectOption[] = levels3?.map(({categoryID, value, label }: any) => ({
        categoryID:categoryID,
        value: value,
        label:label?.en?.name || label?.name,
      }));
      state.level3Options = options;
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

const level3Reducer = level3Slice.reducer;

export const level3Actions = level3Slice.actions;
export default level3Reducer;
