import storeBannerReducer, { storeBannerActions } from "./storeBannerSlice";

export interface IStoreBannerState {
  count: number;
  banner: any;
  banners: any[];
  loading: boolean;
  refresh: number;
  filters: { page: number; page_size: number };
}

export type SetStoreBannersPayload = {
  banners: any[];
  count: number;
};

export { storeBannerActions };
export default storeBannerReducer;
