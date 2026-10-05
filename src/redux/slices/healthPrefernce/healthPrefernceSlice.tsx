import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import { config } from "config";
import {
  healthPrefernceState,
  healthPrefernceType,
  IHealthPrefernce,
  SetHealthPrefernceLoading,
  SetHealthPrefernceOptionsPayload,
  SetHealthPreferncePayload,
  SetHealthPreferncesPayload,
  SetPagePayload,
} from ".";

const default_page_size = config.PAGE_SIZE;

const initialHealthPreference: IHealthPrefernce = {
  count: 0,
  hp: {},
  hps: [],
  loading: true,
  current_filters: {},
  filters: { page: 1, page_size: default_page_size },
  hpOptions: [],
};

const initialState: healthPrefernceState = {
  refreshLoader: false,
  refresh: 0,
  allergies: initialHealthPreference,
  health_issues: initialHealthPreference,
  health_issue: initialHealthPreference,
  food_concern: initialHealthPreference,
  diet: initialHealthPreference,
  target: initialHealthPreference,
  exercise_level: initialHealthPreference,
  temporary_concerns: initialHealthPreference,
};

export const healthPrefernceSlice = createSlice({
  name: "healthPreference",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<SetHealthPrefernceLoading>) => {
      const { type, loading } = action.payload;
      if (!state[type]) return;
      state[type].loading = loading;
    },
    setHp: (state, action: PayloadAction<SetHealthPreferncePayload>) => {
      const { type, data } = action.payload;
      if (!state[type]) return;
      console.log("🚀 ~ type:", type);
      console.log("🚀 ~ data:", data);
      const existingIndex = state[type].hps?.findIndex(
        (item) => item._id === data._id
      );
      if (existingIndex !== -1) {
        state[type].hps[existingIndex] = data;
      } else {
        state[type].hps.unshift(data);
      }
    },
    setHps: (state, action: PayloadAction<SetHealthPreferncesPayload>) => {
      const { data, type, count } = action.payload;
      if (!state[type]) return;
      state[type].count = count;
      state[type].hps = data;
      state.refreshLoader = false;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state, action: PayloadAction<healthPrefernceType>) => {
      const type = action.payload;
      state[type].filters.page = 1;
    },
    setOptions: (
      state,
      action: PayloadAction<SetHealthPrefernceOptionsPayload>
    ) => {
      const { healthPreferences, type } = action.payload;
      const options: SelectOption[] = healthPreferences?.map(
        ({ value, label }: any) => ({
          value: value,
          label: label?.en?.name || label?.name,
        })
      );
      state[type].hpOptions = options;
    },
    setPage: (state, action: PayloadAction<SetPagePayload>) => {
      const { type, page } = action.payload;
      state[type].filters.page = page;
      state.refresh += 1;
      state.refreshLoader = true;
    },
  },
});

const healthPrefernceReducer = healthPrefernceSlice.reducer;

export const healthPrefernceActions = healthPrefernceSlice.actions;
export default healthPrefernceReducer;
