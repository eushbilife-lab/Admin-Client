import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import { scoreCalculationState, SetScoreCalculationsPayload } from ".";
import { config } from "config";
const default_page_size = config.PAGE_SIZE;

const initialState: scoreCalculationState = {
  count: 0,
  loading: false,
  refresh: 0,
  refreshLoader: false,
  scoreCalculations: [],
  scoreCalculation: {},
  score:{},
  scoreCalculationOptions: [],
  current_filters: {},
  filters: { page: 1, page_size: default_page_size },
};

export const scoreCalculationSlice = createSlice({
  name: "scoreCalculation",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setScore: (state, action) => {
      state.score = action.payload;
    },
    setScoreCalculation: (state, action) => {
      state.scoreCalculation = {
        ...state.scoreCalculation,
        ...action.payload,
      };
    },    
    addScoreCalculation: (state, action) => {
      state.scoreCalculations.unshift(action.payload);
    },
    setScoreCalculations: (state, action: PayloadAction<SetScoreCalculationsPayload>) => {
      const { scoreCalculations,count } = action.payload;
      state.refreshLoader = false;
      state.scoreCalculations = scoreCalculations;
      state.count = count;
      let options: SelectOption[] = [];
      state.scoreCalculationOptions = options;
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

const scoreCalculationReducer = scoreCalculationSlice.reducer;

export const scoreCalculationActions = scoreCalculationSlice.actions;
export default scoreCalculationReducer;
