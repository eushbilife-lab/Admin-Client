import { AuthState } from ".";
import LocalStorage from "utils/localstorage.service";
import { createSlice, PayloadAction, isAnyOf } from "@reduxjs/toolkit";
import { authApi } from "redux/api/auth/authApi";

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
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.loading = true;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        LocalStorage.setItem("user", state.user);
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state) => {
        state.loading = false;
      })
      .addMatcher(
        isAnyOf(
          authApi.endpoints.forgotPassword.matchPending,
          authApi.endpoints.verifyOtp.matchPending,
          authApi.endpoints.resetPassword.matchPending,
          authApi.endpoints.updateLanguage.matchPending
        ),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        isAnyOf(
          authApi.endpoints.forgotPassword.matchFulfilled,
          authApi.endpoints.forgotPassword.matchRejected,
          authApi.endpoints.verifyOtp.matchFulfilled,
          authApi.endpoints.verifyOtp.matchRejected,
          authApi.endpoints.resetPassword.matchFulfilled,
          authApi.endpoints.resetPassword.matchRejected,
          authApi.endpoints.updateLanguage.matchFulfilled,
          authApi.endpoints.updateLanguage.matchRejected
        ),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.loading = false;
      });
  },
});

const authReducer = authSlice.reducer;

export const authActions = authSlice.actions;
export default authReducer;
