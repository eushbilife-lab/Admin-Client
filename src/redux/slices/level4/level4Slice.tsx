import { Level4State,SetLevel4Payload,SetLevel4OptionsPayload} from ".";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import { config } from "config";

const default_page_size = config.PAGE_SIZE;

const initialState: Level4State = {
  count: 0,
  levels4: [], 
  level4: {}, 
  loading: false,
  current_filters: {},
  refreshLoader: false,
  level4Options: [], 
  refresh: 0,
  filters: { page: 1, page_size: default_page_size },
};

export const level4Slice = createSlice({
  name: "level4",
  initialState,
  reducers: {
    clear_search: (state) => {
      state.levels4 = [];
      state.level4Options = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLevel4: (state, action) => {
      state.level4 = action.payload;
    },
    addLevel4: (state, action) => {
      state.levels4.unshift(action.payload);
    },
    setLevels4: (state, action: PayloadAction<SetLevel4Payload>) => {
      const { count, levels4 } = action.payload;
      state.count = count;
      state.refreshLoader = false;

      let options: SelectOption[] = [];
      levels4.forEach(({ _id, en,ar, status }: any) =>
        options.push({ value: _id, label: en.name })
      );
      state.levels4 = levels4;
      state.level4Options = options;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state) => {
      state.filters.page = 1;
    },
    setOptions: (state, action: PayloadAction<SetLevel4OptionsPayload>) => {
      const { levels4 } = action.payload;
      const options: SelectOption[] = levels4?.map(({HNSSProductCategoryID,subCategoryID, value, label }: any) => ({
        HNSSProductCategoryID:HNSSProductCategoryID,
        subCategoryID:subCategoryID,
        value: value,
        label:label?.en?.name || label?.name,
      }));
      state.level4Options = options;
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

const level4Reducer = level4Slice.reducer;

export const level4Actions = level4Slice.actions;
export default level4Reducer;
