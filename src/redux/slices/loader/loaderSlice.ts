import { fieldsType, LoaderState } from ".";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const initialState: LoaderState = {
  loading: [],
  imgLoading: false,
  combo: false,
  select: false,
};

export const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    clearLoading: (state) => {
      state.loading = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      if (action.payload) state.loading.push(true);
      else state.loading.pop();
    },
    setImgLoading: (state, action: PayloadAction<boolean>) => {
      state.imgLoading = action.payload;
    },
    setFieldLoading: (state, action: PayloadAction<fieldsType>) => {
      state[action.payload] = !state[action.payload];
    },
  },
});

const loaderReducer = loaderSlice.reducer;

export const loaderActions = loaderSlice.actions;
export default loaderReducer;
