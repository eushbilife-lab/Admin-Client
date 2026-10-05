import LocalStorage from "utils/localstorage.service";
import http from "./http.service";
// import SocketService from "./socket.service";
import Promisable from "./promisable.service";
import { authActions } from "redux/slices/auth";
import OneSignalService from "./onesignal.service";
import { getAppDispatch } from "utils/dispatch.util";
const url="/admins"
const AuthService = {
  login: async (data: any) => {
    const dispatch = getAppDispatch();
    dispatch?.(authActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.post(`/auth/login`, data)
    );
    if (success) {
      const { user, jwtToken } = success?.data?.data;
      LocalStorage.setItem("token", `Bearer ${jwtToken}`);
      dispatch?.(authActions.setUser(user));
      OneSignalService.connect(user._id);
      // SocketService.connect(admin);
    }
    dispatch?.(authActions.setLoading(false));
    return [success, error];
  },
  logout: () => {
    const dispatch = getAppDispatch();
    // SocketService.disconnect();
    OneSignalService.disconnect();
    localStorage.removeItem("token");
    dispatch?.(authActions.logout());
    dispatch?.(authActions.setUser(null));
  },
  forgot: async (data: any) => {
    const dispatch = getAppDispatch();
    dispatch?.(authActions.setLoading(true));

    const [success, error]: any = await Promisable.asPromise(
      http.post(`/auth/forgot-password`, data)
    );

    const { otpExpiry = null } = success?.data?.data || {};

    dispatch?.(authActions.setLoading(false));
    return [otpExpiry, error];
  },
  verifyOtp: async (data: any) => {
    const dispatch = getAppDispatch();
    dispatch?.(authActions.setLoading(true));

    const [success, error]: any = await Promisable.asPromise(
      http.post(`/auth/verify-otp`, data)
    );

    const { verified = null } = success?.data?.data || {};

    dispatch?.(authActions.setLoading(false));
    return [verified, error];
  },
  reset: async (data: any) => {
    const dispatch = getAppDispatch();
    dispatch?.(authActions.setLoading(true));

    const [success, error]: any = await Promisable.asPromise(
      http.post(`/auth/reset-password`, data)
    );

    const { user = null } = success?.data?.data || {};

    dispatch?.(authActions.setLoading(false));
    return [success || user, error];
  },
  updateLanguage: async (language: any) => {
    const dispatch = getAppDispatch();
    dispatch?.(authActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/language`, {language:language})
    );
    if (success) {
      // const { updatedLanguage } = success?.data?.data;
      // LocalStorage.setItem("language",updatedLanguage );
    }
    dispatch?.(authActions.setLoading(false));
    return [success, error];
  },
};
export default AuthService;
