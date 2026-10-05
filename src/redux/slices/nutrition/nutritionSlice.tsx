import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import {nutritionState,SetNutritionStatePayload } from ".";

const initialState: nutritionState = {
  count: 0,
  nutritions: [],
  nutritionsOptions: [],
  nutrition: {},
  loading: false,
  refreshLoader: false,
  refresh: 0,
  notFounded:false
};

export const nutritionSlice = createSlice({
  name: "nutrition",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setNutrition: (state, action) => {
      state.nutrition = action.payload;
    },
    addNutrition: (state, action) => {
      state.nutritions.unshift(action.payload);
    },
    setNutritions: (state, action: PayloadAction<SetNutritionStatePayload>) => {
      const { nutritions } = action.payload;
      state.refreshLoader = false;
      state.nutritions = nutritions;
      let options: SelectOption[] = [];
      nutritions?.forEach(({ _id, name,key }: any) =>
        options.push({ value: _id, label: name , key:key})
      );
      state.nutritionsOptions = options;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    showButton: (state, action) => {
      state.notFounded = action.payload.notFounded;
    },
  },
});

const nutritionReducer = nutritionSlice.reducer;

export const nutritionActions = nutritionSlice.actions;
export default nutritionReducer;
