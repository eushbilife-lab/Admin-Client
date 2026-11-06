import { authApi } from "redux/api/auth/authApi";
import { getAppDispatch } from "utils/dispatch.util";
import { authActions } from "redux/slices/auth";

/**
 * Thin facade over authApi for non-hook call sites (header logout, interceptors).
 * Prefer RTK Query hooks in React components.
 */
const AuthService = {
  login: async (data: any) => {
    const dispatch = getAppDispatch();
    if (!dispatch) return [null, new Error("Store not ready")];
    try {
      const result = await dispatch(
        authApi.endpoints.login.initiate(data)
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  logout: () => {
    const dispatch = getAppDispatch();
    if (!dispatch) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      return;
    }
    // Fire-and-forget; mutation clears tokens + resets API cache
    void dispatch(authApi.endpoints.logout.initiate());
    dispatch(authActions.setUser(null));
  },

  forgot: async (data: any) => {
    const dispatch = getAppDispatch();
    if (!dispatch) return [null, new Error("Store not ready")];
    try {
      const result = await dispatch(
        authApi.endpoints.forgotPassword.initiate(data)
      ).unwrap();
      return [result?.otpExpiry ?? null, null];
    } catch (error) {
      return [null, error];
    }
  },

  verifyOtp: async (data: any) => {
    const dispatch = getAppDispatch();
    if (!dispatch) return [null, new Error("Store not ready")];
    try {
      const result = await dispatch(
        authApi.endpoints.verifyOtp.initiate(data)
      ).unwrap();
      return [result?.verified ?? null, null];
    } catch (error) {
      return [null, error];
    }
  },

  reset: async (data: any) => {
    const dispatch = getAppDispatch();
    if (!dispatch) return [null, new Error("Store not ready")];
    try {
      const result = await dispatch(
        authApi.endpoints.resetPassword.initiate(data)
      ).unwrap();
      return [result?.user ?? result, null];
    } catch (error) {
      return [null, error];
    }
  },

  updateLanguage: async (language: any) => {
    const dispatch = getAppDispatch();
    if (!dispatch) return [null, new Error("Store not ready")];
    try {
      const result = await dispatch(
        authApi.endpoints.updateLanguage.initiate({ language })
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default AuthService;
