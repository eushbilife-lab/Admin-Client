import type { AppDispatch } from "redux/store";
import { storeBannerApi } from "redux/api/storeBanner/storeBannerApi";
import { storeBannerActions } from "redux/slices/storeBanner";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const storeBannerService = {
  getAll: async (
    data: any = { page: 1, page_size: 50 },
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(storeBannerActions.setLoading(true));
    try {
      const { banners, count } = await d(
        storeBannerApi.endpoints.getAllStoreBanners.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        storeBannerActions.setBanners({
          banners: banners || [],
          count: count || 0,
        })
      );
      return [{ data: { data: { banners, count } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(storeBannerActions.setLoading(false));
    }
  },

  get: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(storeBannerActions.setLoading(true));
    try {
      const banner = await d(
        storeBannerApi.endpoints.getStoreBanner.initiate(id, {
          forceRefetch: true,
        })
      ).unwrap();
      d(storeBannerActions.setBanner(banner || null));
      return [{ data: { data: { banner } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(storeBannerActions.setLoading(false));
    }
  },

  create: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(storeBannerActions.setLoading(true));
    try {
      const banner = await d(
        storeBannerApi.endpoints.createStoreBanner.initiate(data)
      ).unwrap();
      d(storeBannerActions.setBanner(banner));
      d(storeBannerActions.refresh());
      return [{ data: { data: { banner } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(storeBannerActions.setLoading(false));
    }
  },

  update: async (id: string, data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(storeBannerActions.setLoading(true));
    try {
      const banner = await d(
        storeBannerApi.endpoints.updateStoreBanner.initiate({ id, data })
      ).unwrap();
      d(storeBannerActions.setBanner(banner));
      d(storeBannerActions.refresh());
      return [{ data: { data: { banner } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(storeBannerActions.setLoading(false));
    }
  },

  remove: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      await d(
        storeBannerApi.endpoints.removeStoreBanner.initiate(id)
      ).unwrap();
      d(storeBannerActions.removeBanner(id));
      d(storeBannerActions.refresh());
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default storeBannerService;
