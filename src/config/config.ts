const ADMIN_API_PORT = 6003;
const env = import.meta.env;

function lanAwareApiUrl(): string | undefined {
  const envUrl = env.REACT_APP_API_URL;
  if (typeof window === "undefined") return envUrl;
  const { hostname, port, origin } = window.location;
  if (!hostname || hostname === "localhost" || hostname === "127.0.0.1") {
    return envUrl;
  }
  // The Vite dev server on another machine still calls the API port directly.
  if (port === "3000" || port === "5173" || port === "5175") {
    return `http://${hostname}:${ADMIN_API_PORT}/api/v1`;
  }
  return `${origin}/api/v1`;
}

export const config = {
  NODE_ENV: "production",
  APP_ENV: env.REACT_APP_ENV,

  API_URL: lanAwareApiUrl(),
  APP_URL: `${env.REACT_APP_URL}`,
  LOCAL_API_URL: env.REACT_APP_LOCAL_API_URL,

  ONE_SIGNAL_APP_ID: `${env.REACT_APP_ONE_SIGNAL_APP_ID}`,

  MUI_LICENSE_KEY: env.REACT_APP_MUIX_LICENSE,

  PAGE_SIZE: env.REACT_APP_PAGE_SIZE,
  MAX_KM_PER_HOUR: Number(env.REACT_APP_MAX_KM_PER_HOUR) || 0,

  SUPER_ADMIN_EMAIL: env.REACT_APP_SUPER_ADMIN_EMAIL,
};
