import { config } from "config";
import { SetUsersPayload, UserState } from ".";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";

const default_page_size = config.PAGE_SIZE;
const initialState: UserState = {
  count: 0,
  users: [],
  user: null,
  loading: true,
  refresh: 0,
  current_filters: {},
  refreshLoader: false,
  userOptions: [],
  filters: { page: 1, page_size: default_page_size },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clear_search: (state) => {
      state.users = [];
      state.userOptions = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    updateUser: (state, action) => {
      const { id, user } = action.payload;
      state.users.every(({ _id }, i) => {
        if (id === _id) {
          state.users[i] = user;
          return false;
        }
        return true;
      });
    },
    deleteUserById: (state, action) => {
      const id = action.payload;
      state.users.every(({ _id }, i) => {
        if (id === _id) {
          state.count -= 1;
          state.users.splice(i, 1);
          return false;
        }
        return true;
      });
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },

    addUser: (state, action) => {
      state.users.unshift(action.payload);
    },

    setUsers: (state, action: PayloadAction<SetUsersPayload>) => {
      const { count, users } = action.payload;
      state.count = count;
      state.refreshLoader = false;

      let options: SelectOption[] = [];
      users?.forEach(({ _id, first_name, last_name }: any) =>
        options.push({ value: _id, label: first_name + " " + last_name })
      );
      state.users = users;
      state.userOptions = options;
    },
    setSearchUsers: (state, action: PayloadAction<SetUsersPayload>) => {
      const { count, users } = action.payload;
      state.count = count;
      state.refreshLoader = false;

      let options: SelectOption[] = [];
      users.forEach(({ _id, first_name, last_name,phone }: any) =>
        options.push({ value: _id, label: first_name + " " + last_name +" - " +phone })
      );
      state.users = users;
      state.userOptions = options;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.refresh += 1;
      state.refreshLoader = true;
      state.filters.page = action.payload;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state) => {
      state.filters.page = 1;
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

const userReducer = userSlice.reducer;

export const userActions = userSlice.actions;
export default userReducer;
