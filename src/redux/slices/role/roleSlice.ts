import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { config } from "config";
import { roleState, SetRoleOptionsPayload } from ".";
import { SetRoleItemsPayload } from ".";

const default_page_size = config.PAGE_SIZE;

const initialState: roleState = {
  count: 0,
  Roles: [], // Array of role records
  Role: {}, // Single role item (active/inactive)
  loading: false,
  current_filters: {},
  refreshLoader: false,
  roleOptions: [], // Dropdown options for role names
  refresh: 0,
  filters: { page: 1, page_size: default_page_size },
};

export const roleslice = createSlice({
  name: "role",
  initialState,
  reducers: {
    clear_search: (state) => {
      state.Roles = [];
      state.roleOptions = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setRole: (state, action) => {
      state.Role = action.payload;
    },
    addRoleItem: (state, action) => {
      state.Roles.unshift(action.payload);
    },
    setRoles: (state, action: PayloadAction<SetRoleItemsPayload>) => {
      const { count, Roles } = action.payload;
      state.count = count;
      state.refreshLoader = false;
      state.Roles = Roles;
    },
    setOptions: (state, action: PayloadAction<SetRoleOptionsPayload>) => {
      const { Roles } = action.payload;
      state.roleOptions = Roles;
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

const roleReducer = roleslice.reducer;

export const roleActions = roleslice.actions;
export default roleReducer;
