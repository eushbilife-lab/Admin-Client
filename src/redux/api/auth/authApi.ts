import LocalStorage from "utils/localstorage.service";
import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type LoginBody = { email: string; password: string };
type LoginData = {
  user: unknown;
  jwtToken: string;
  refreshToken?: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginData, LoginBody>({
      query: (body) => ({ url: "/auth/login", method: "POST", data: body }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<LoginData>(response);
        if (data?.jwtToken) {
          LocalStorage.setItem("token", `Bearer ${data.jwtToken}`);
        }
        if (data?.refreshToken) {
          LocalStorage.setItem("refreshToken", data.refreshToken);
        }
        return data;
      },
      invalidatesTags: ["Auth"],
    }),

    logout: build.mutation<null, void>({
      async queryFn(_arg, _api, _extra, baseQuery) {
        try {
          await baseQuery({ url: "/auth/logout", method: "POST", data: {} });
        } catch {
          // Always clear locally
        }
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        return { data: null };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch({ type: "auth/logout" });
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),

    forgotPassword: build.mutation<{ otpExpiry?: string | null }, { email: string }>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ otpExpiry?: string | null }>(response) || {},
    }),

    verifyOtp: build.mutation<{ verified?: boolean | null }, { email: string; otpCode: string }>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ verified?: boolean | null }>(response) || {},
    }),

    resetPassword: build.mutation<
      { user?: unknown },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ user?: unknown }>(response) || {},
    }),

    updateLanguage: build.mutation<unknown, { language: string }>({
      query: (body) => ({
        url: "/admins/language",
        method: "PATCH",
        data: body,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useUpdateLanguageMutation,
} = authApi;
