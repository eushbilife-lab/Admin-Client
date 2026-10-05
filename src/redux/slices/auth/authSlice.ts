import { AuthState } from ".";
import LocalStorage from "utils/localstorage.service";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const user = LocalStorage.getItem("user");
const initialState: AuthState = {
	user,
	loading: false,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: () => {},
		setUser: (state, action) => {
			state.user = action.payload;
			LocalStorage.setItem("user", state.user);
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
	},
});

const authReducer = authSlice.reducer;

export const authActions = authSlice.actions;
export default authReducer;
