import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import { config } from "config";
import {
  IAllergy,
  SetAllergiesPayload,
  SetAllergyOptionsPayload,
  SetAllergyPayload,
} from ".";

const default_page_size = config.PAGE_SIZE;

const initialState: IAllergy = {
  count: 0,
  allergy: {},
  allergies: [],
  loading: true,
  current_filters: {},
  filters: { page: 1, page_size: default_page_size },
  allergyOptions: [],
  refreshLoader: false,
  refresh: 0,
};

export const allergySlice = createSlice({
  name: "allergy",
  initialState,
  reducers: {
    clear_search: (state) => {
      state.allergies = [];
      state.allergyOptions = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAllergy: (state, action: PayloadAction<SetAllergyPayload>) => {
      const { data } = action.payload;
      const existingIndex = state.allergies.findIndex(
        (item) => item?._id === data?._id
      );
      if (existingIndex !== -1) {
        state.allergies[existingIndex] = data;
      } else {
        state.allergies.unshift(data);
      }
    },
    addAllergy: (state, action) => {
      state.allergies.unshift(action.payload);
    },
    setAllergies: (state, action: PayloadAction<SetAllergiesPayload>) => {
      const { count, allergies } = action.payload;
      state.count = count;
      state.refreshLoader = false;

      let options: SelectOption[] = [];
      allergies?.forEach(({ _id, en, ar, status }: any) =>
        options.push({
          value: _id,
          label: en?.name || "",
        })
      );
      state.allergies = allergies;
      state.allergyOptions = options;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state) => {
      state.filters.page = 1;
    },
    setOptions: (state, action: PayloadAction<SetAllergyOptionsPayload>) => {
      const { allergies } = action.payload;
      const options: SelectOption[] = allergies?.map(
        ({ value, label }: any) => ({
          value: value,
          label:label?.en?.name || label?.en?.nameKey,
        })
      );
      state.allergyOptions = options;
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

const allergyReducer = allergySlice.reducer;

export const allergyActions = allergySlice.actions;
export default allergyReducer;
