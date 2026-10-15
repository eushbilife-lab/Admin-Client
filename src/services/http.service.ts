import axios from "axios";
import AuthService from "./auth.service";
import { log } from "../utils/logger.util";
import { config as configs } from "config";
import ToasterService from "../utils/toaster.util";
import { getLanguage } from "utils/language.util";
import LocalStorage from "utils/localstorage.service";

axios.defaults.baseURL = configs.API_URL;
const CancelToken = axios.CancelToken;

let source = CancelToken.source();

function readBearer(): string {
  const raw = LocalStorage.getItem("token");
  if (!raw) return "";
  if (typeof raw === "string") {
    // LocalStorage may JSON-stringify the Bearer string — strip surrounding quotes.
    const trimmed = raw.replace(/^"|"$/g, "");
    return trimmed.startsWith("Bearer ") ? trimmed : `Bearer ${trimmed.replace(/^Bearer\s+/i, "")}`;
  }
  return "";
}

axios.interceptors.request.use(
  (config: any) => {
    const bearer = readBearer();
    if (bearer) {
      config.headers = config.headers || {};
      config.headers.Authorization = bearer;
    }
    config.headers = config.headers || {};
    config.headers["Accept-Language"] = getLanguage();
    return { ...config, cancelToken: source.token };
  },
  (error: any) => Promise.reject(error)
);

axios.interceptors.response.use(
  (res: any) => {
    const { config } = res;
    const { message } = res.data;

    const skipToast =
      config?.headers?.["X-Skip-Toast"] ||
      config?.headers?.["x-skip-toast"] ||
      (typeof config?.headers?.get === "function" &&
        config.headers.get("X-Skip-Toast"));
    if (!skipToast) {
      ToasterService.showSuccess(message);
    }

    return res;
  },
  (err: any) => {
    const { config, message: msg, response } = err;
    const message = response?.data?.message;

    log(`http ${config?.method} error`, config?.url, message || msg);
    const skipToast =
      config?.headers?.["X-Skip-Toast"] ||
      config?.headers?.["x-skip-toast"] ||
      (typeof config?.headers?.get === "function" &&
        config.headers.get("X-Skip-Toast"));
    if (!skipToast) {
      ToasterService.showError(message || msg);
    }

    if (!response) throw err;

    const { code } = response.data;

    if (
      code === 401 &&
      (message === "Unauthorized" ||
        message === "Session revoked. Please log in again." ||
        message === "Password has been changed, Login again" ||
        message === "Login session has been expired, Login again")
    ) {
      AuthService.logout();
      source.cancel(message);

      setTimeout(() => {
        source = CancelToken.source();

        if (window.location.pathname !== "/") window.location.assign("/");
      }, 300);
    }

    throw err;
  }
);

const http = {
  get: axios.get,
  put: axios.put,
  post: axios.post,
  patch: axios.patch,
  delete: axios.delete,
  /** @deprecated Auth header is attached by the request interceptor. */
  setJWT: () => {
    const bearer = readBearer();
    if (bearer) axios.defaults.headers.common["Authorization"] = bearer;
  },
  setMultiPart: () => {
    axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
  },
  setLanguage: () => {
    axios.defaults.headers.common["Accept-Language"] = getLanguage();
  },
};

export default http;
