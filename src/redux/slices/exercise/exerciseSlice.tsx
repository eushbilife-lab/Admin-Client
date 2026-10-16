import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import { config } from "config";
import {
  IExerciseState,
  SetExerciseOptionsPayload,
  SetExercisePayload,
  SetExercisesPayload,
} from ".";

const default_page_size = config.PAGE_SIZE;

const initialState: IExerciseState = {
  count: 0,
  exercise: {},
  exercises: [],
  loading: true,
  current_filters: {},
  filters: { page: 1, page_size: default_page_size },
  exerciseOptions: [],
  refreshLoader: false,
  refresh: 0,
};

export const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setExercise: (state, action: PayloadAction<SetExercisePayload>) => {
      const { data } = action.payload;
      const existingIndex = state.exercises.findIndex(
        (item) => item._id === data._id
      );
      if (existingIndex !== -1) {
        state.exercises[existingIndex] = data;
      } else {
        state.exercises.unshift(data);
      }
    },
    setExercises: (state, action: PayloadAction<SetExercisesPayload>) => {
      const { count, exercises } = action.payload;
      state.count = count;
      state.refreshLoader = false;
      state.exercises = exercises;
      state.exerciseOptions = exercises.map(({ _id, name, en }: any) => ({
        value: _id,
        label: name || en?.name || "",
        name: name || en?.name || "",
      })) as SelectOption[];
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state) => {
      state.filters.page = 1;
    },
    setOptions: (state, action: PayloadAction<SetExerciseOptionsPayload>) => {
      const { exercises } = action.payload;
      state.exerciseOptions = (exercises || []).map(
        ({ value, label, name }: any) =>
          ({
            value,
            label: name || (typeof label === "string" ? label : ""),
            name: name || (typeof label === "string" ? label : ""),
          } as SelectOption)
      );
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

const exerciseReducer = exerciseSlice.reducer;

export const exerciseActions = exerciseSlice.actions;
export default exerciseReducer;
