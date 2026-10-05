import { DynamicState, SetDynamicPayload,SetDynamicsPayload, SetdynamicOptionsPayload, IDynamics, SetdynamicLoading, DynamicType, SetPagePayload } from ".";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import { config } from "config";

const default_page_size = config.PAGE_SIZE;

const initialDynamics: IDynamics = {
  count: 0,
  dynamic: {},
  dynamics: [],
  loading: true,
  current_filters: {},
  filters: { page: 1, page_size: default_page_size },
  dynamicOptions: [],
};

const initialState: DynamicState = {
  refreshLoader: false,
  refresh: 0,
  manufacturer: initialDynamics,
  brand: initialDynamics,
  attribute: initialDynamics,
};

export const dynamicSlice = createSlice({
  name: "dynamic",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<SetdynamicLoading>) => {
      const { type, loading } = action.payload;
      state[type].loading = loading;
    },
    setDynamic: (state, action: PayloadAction<SetDynamicPayload>) => {
      const { type, data } = action.payload;
      const existingIndex = state[type].dynamics.findIndex(item => item._id === data._id);
      if (existingIndex !== -1) {
        state[type].dynamics[existingIndex] = data;
      } else {
        state[type].dynamics.unshift(data);
      }
    },
    setDynamics: (state, action: PayloadAction<SetDynamicsPayload>) => {
      const { data, type, count } = action.payload;
      state[type].count = count;
      state[type].dynamics = data;
      state.refreshLoader = false;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state, action: PayloadAction<DynamicType>) => {
      const type = action.payload;
      state[type].filters.page = 1;
    },
    setOptions: (state, action: PayloadAction<SetdynamicOptionsPayload>) => {
      const { dynamics, type } = action.payload;
      const options: SelectOption[] = dynamics?.map(({ value, label }: any) => ({
        value: value,
        label: label?.En_name || label?.en?.name || label?.name || "",
      }));
      state[type].dynamicOptions = options; 
    },
    setPage: (state, action: PayloadAction<SetPagePayload>) => {
      const { type, page } = action.payload;
      state[type].filters.page = page;
      state.refresh += 1;
      state.refreshLoader = true;
    },
  },
});

const dynamicReducer = dynamicSlice.reducer;

export const dynamicActions = dynamicSlice.actions;
export default dynamicReducer;
