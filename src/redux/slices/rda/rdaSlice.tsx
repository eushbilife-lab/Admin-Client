import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { rdaState, SetRdaPayload } from ".";
import { SelectOption } from "@core/basic-components/Select";

const initialState: rdaState = {
  count: 0,
  rdas: [],
  RDAOptions: [],
  rda: {},
  loading: false,
  refreshLoader: false,
  refresh: 0,
};

export const rdaSlice = createSlice({
  name: "rda",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setRda: (state, action) => {
      state.rda = action.payload;
    },
    addRda: (state, action) => {
      state.rdas.unshift(action.payload);
    },
    setRdas: (state, action: PayloadAction<SetRdaPayload>) => {
      const { rdas } = action.payload;
      state.refreshLoader = false;
      state.rdas = rdas;
      let options: SelectOption[] = [];
      rdas?.forEach(({ _id, dailyValue, uom,nutrition_id }: any) =>
        options.push({
            value: _id,
            label: nutrition_id?.name,
            data: dailyValue,
            dataUnit: uom,
          dataId: { 
            value: nutrition_id?._id, // Nutrition ID
            label: nutrition_id?.name // Nutrition name
          },         
        })
      );
      state.RDAOptions = options;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
  },
});

const rdaReducer = rdaSlice.reducer;

export const rdaActions = rdaSlice.actions;
export default rdaReducer;
