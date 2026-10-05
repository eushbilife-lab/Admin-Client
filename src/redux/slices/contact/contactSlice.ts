import {
  ContactLoadingPayload,
  ContactState,
  SetContactPayload,
  SetContactsPayload,
  ContactType,
  SetFiltersPayload,
  SetPagePayload
} from ".";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { config } from "config";


const default_page_size = config.PAGE_SIZE;

const initialContact = {
  contacts: [],
  loading: true,
	filters: { page: 1, page_size: default_page_size },
	count: 0,
	refresh: 0,
	current_filters: {},
	refreshLoader: false,
};

const initialState: ContactState = {
  tab: 0,
  contact: null,
  loading: true,
  open: initialContact,
  close: initialContact,
  refresh: 0,
  current_filters: {},
  refreshLoader: false,
  filters: { page: 1, page_size: default_page_size },
  count: 0,
};

export const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setTab: (state, action: PayloadAction<number>) => {
      state.tab = action.payload;
    },
    setLoader: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoading: (state, action: PayloadAction<ContactLoadingPayload>) => {
      const { type, loading } = action.payload;
      state[type].loading = loading;
    },
    setPage: (state, action: PayloadAction<SetPagePayload>) => {
      const {page,type}=action.payload
      state.refresh += 1;
      state[type].refreshLoader = true;
      state[type].filters.page =page;
    },
    resetPage: (state, action: PayloadAction<ContactType>) => {
			const type = action.payload;
			state[type].filters.page = 1;
		},
		setFilters: (state, action: PayloadAction<SetFiltersPayload>) => {
			const { type, data } = action.payload;
			state[type].filters = data;
			state.refreshLoader = true;
		},
		resetFilters: (state, action: PayloadAction<ContactType>) => {
			const type = action.payload;
			state.refresh += 1;
			state.refreshLoader = true;
			state[type].filters = initialState.filters;
			state[type].current_filters = initialState.current_filters;
		},
    setCurrentFilters: (	state,action: PayloadAction<SetFiltersPayload>) => {
			const { type, data } = action.payload;
			state[type].current_filters = data;
		},
    setContacts: (state, action: PayloadAction<SetContactsPayload>) => {
      const { type, contacts,count } = action.payload;
      state[type].count=count
      state[type].refreshLoader = false;
      state[type].contacts = contacts;
    },
    deleteContactRequestById: (
      state,
      action: PayloadAction<SetContactPayload>
    ) => {
      const { type, contact } = action.payload;

      if (!contact?._id) return;

      state[type].contacts = state[type].contacts.filter(
        ({ _id }) => _id !== contact._id
      );
    },
  },
});

const contactReducer = contactSlice.reducer;

export const contactActions = contactSlice.actions;
export default contactReducer;
