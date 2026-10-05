import { config } from "config";
import { NotificationState } from ".";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const default_page_size = config.PAGE_SIZE;

const initialState: NotificationState = {
	count: 0,
	loading: true,
	notifications: [],
	notification: null,
	refresh: 0,
	refreshLoader: false,
	current_filters: {},
	filters: { page: 1, page_size: default_page_size },
};

export const notificationSlice = createSlice({
	name: "notification",
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		addNotification: (state, action) => {
			state.notifications.unshift(action.payload);
			state.count += 1;

		},
		updateNotification: (state, action) => {
			const { id, notification } = action.payload;
			state.notifications.every(({ _id }, i) => {
				if (id === _id) {
					state.notifications[i] = notification;
					return false;
				}
				return true;
			});
		},
		setNotification: (state, action) => {
			state.notification = action.payload;
		},
		setNotifications: (state,
			action: PayloadAction<{ notifications: any[]; count: number }>
		) => {
			const { count, notifications } = action.payload;
			state.notifications = notifications;
			state.count = count;
			state.refreshLoader=false
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

const notificationReducer = notificationSlice.reducer;

export const notificationActions = notificationSlice.actions;
export default notificationReducer;
