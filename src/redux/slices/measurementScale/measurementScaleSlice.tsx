import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import { config } from "config";
import {
  IMeasurementScale,
  MeasurementScaleState,
  MeasurementScaleType,
  SetMeasurementScaleLoading,
  SetMeasurementScalePayload,
  SetMeasurementScalesPayload,
  SetPagePayload,
} from ".";

const default_page_size = config.PAGE_SIZE;

const initialMeasurementScale: IMeasurementScale = {
  count: 0,
  measurementScale: {},
  measurementScales: [],
  loading: true,
  current_filters: {},
  filters: { page: 1, page_size: default_page_size },
  measurementScaleOptions: [],
};

const initialState: MeasurementScaleState = {
  refreshLoader: false,
  refresh: 0,
  uom: initialMeasurementScale,
  uoc: initialMeasurementScale,
};

export const measurementScaleSlice = createSlice({
  name: "measurementScale",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<SetMeasurementScaleLoading>) => {
      const { type, loading } = action.payload;
      state[type].loading = loading;
    },
    setMeasurementScale: (
      state,
      action: PayloadAction<SetMeasurementScalePayload>
    ) => {
      const { type, data } = action.payload;
      const existingIndex = state[type].measurementScales.findIndex(
        (item) => item._id === data._id
      );
      if (existingIndex !== -1) {
        state[type].measurementScales[existingIndex] = data;
      } else {
        state[type].measurementScales.unshift(data);
      }
    },
    setMeasurementScales: (
      state,
      action: PayloadAction<SetMeasurementScalesPayload>
    ) => {
      const { data, type, count } = action.payload;
      state[type].count = count;
      state[type].measurementScales = data;
      state.refreshLoader = false;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state, action: PayloadAction<MeasurementScaleType>) => {
      const type = action.payload;
      state[type].filters.page = 1;
    },
    setOptions: (state, action: PayloadAction<SetMeasurementScalesPayload>) => {
      const { data, type } = action.payload;
      const options: SelectOption[] = data?.map(
        ({ value, label }: any) => ({
          value: value,
          label: label
        })
      );
      state[type].measurementScaleOptions = options;
    },
    setPage: (state, action: PayloadAction<SetPagePayload>) => {
      const { type, page } = action.payload;
      state[type].filters.page = page;
      state.refresh += 1;
      state.refreshLoader = true;
    },
  },
});

const measurementScaleReducer = measurementScaleSlice.reducer;

export const measurementScaleActions = measurementScaleSlice.actions;
export default measurementScaleReducer;
