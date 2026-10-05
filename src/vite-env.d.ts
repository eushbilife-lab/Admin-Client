/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_ENV?: string;
  readonly REACT_APP_API_URL?: string;
  readonly REACT_APP_URL?: string;
  readonly REACT_APP_LOCAL_API_URL?: string;
  readonly REACT_APP_ONE_SIGNAL_APP_ID?: string;
  readonly REACT_APP_ONE_SIGNAL_API_KEY?: string;
  readonly REACT_APP_SENTRY_PUBLIC_KEY?: string;
  readonly REACT_APP_SENTRY_RELEASE_KEY?: string;
  readonly REACT_APP_MUIX_LICENSE?: string;
  readonly REACT_APP_PAGE_SIZE?: string;
  readonly REACT_APP_MAX_KM_PER_HOUR?: string;
  readonly REACT_APP_SUPER_ADMIN_EMAIL?: string;
  readonly REACT_APP_GOOGLE_MAPS_API_KEY?: string;
  readonly REACT_APP_SOCKET_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "recharts";

declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.wav" {
  const src: string;
  export default src;
}
