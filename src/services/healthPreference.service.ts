import type { AppDispatch } from "redux/store";
import { healthPreferenceApi } from "redux/api/healthPreference/healthPreferenceApi";
import { healthPrefernceActions } from "redux/slices/healthPrefernce";
import { modalActions } from "redux/slices/modal";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const healthPreferenceService = {
  create: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const healthPreference = await d(
        healthPreferenceApi.endpoints.createHealthPreference.initiate(data)
      ).unwrap();
      if (!healthPreference) {
        d(
          healthPrefernceActions.setHp({
            type: healthPreference?.type,
            data: healthPreference,
          })
        );
      } else {
        healthPreferenceService.getAllHp(
          healthPreference?.type,
          { page: 1, page_size: 3 },
          d
        );
      }
      d(modalActions.closeModal());
      return [{ data: { data: { healthPreference } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  getAllHp: async (type: any, filters: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(healthPrefernceActions.setLoading({ type, loading: true }));
    try {
      const { healthPreference, count } = await d(
        healthPreferenceApi.endpoints.getAllHealthPreferences.initiate(
          {
            type,
            page: filters.page,
            page_size: filters.page_size,
            ...(filters.name ? { name: filters.name } : {}),
            ...(filters.status ? { status: filters.status } : {}),
          },
          { forceRefetch: true }
        )
      ).unwrap();
      d(
        healthPrefernceActions.setHps({
          data: healthPreference,
          type,
          count,
        })
      );
      return [{ data: { data: { healthPreference, count } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(healthPrefernceActions.setLoading({ type, loading: false }));
    }
  },

  update: async (id: string, data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const healthPreference = await d(
        healthPreferenceApi.endpoints.updateHealthPreference.initiate({
          id,
          data,
        })
      ).unwrap();
      d(
        healthPrefernceActions.setHp({
          type: healthPreference.type,
          data: healthPreference,
        })
      );
      d(modalActions.closeModal());
      return [{ data: { data: { healthPreference } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  getOptions: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    if (data?.type) {
      d(healthPrefernceActions.setLoading({ type: data.type, loading: true }));
    }
    try {
      const { healthPreferences: healthPreference } = await d(
        healthPreferenceApi.endpoints.getHealthPreferenceOptions.initiate(
          data,
          { forceRefetch: true }
        )
      ).unwrap();
      d(
        healthPrefernceActions?.setOptions({
          healthPreferences: healthPreference,
          type: data?.type,
        })
      );
      return [{ data: { data: { healthPreferences: healthPreference } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      if (data?.type) {
        d(
          healthPrefernceActions.setLoading({ type: data.type, loading: false })
        );
      }
    }
  },

  remove: async (
    id: string,
    dispatch?: AppDispatch,
    type?: any,
    filters?: any
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(healthPrefernceActions.setLoading({ type, loading: true }));
    try {
      await d(
        healthPreferenceApi.endpoints.removeHealthPreference.initiate(id)
      ).unwrap();
      let currentPage = filters.page;
      const [fetchSuccess]: any = await healthPreferenceService.getAllHp(
        type,
        { ...filters },
        d
      );
      const currentImages = fetchSuccess?.data?.data?.image ?? [];
      if (currentImages.length === 0 && currentPage > 1) {
        currentPage -= 1;
        await healthPreferenceService.getAllHp(
          type,
          { ...filters, page: currentPage },
          d
        );
      }
      d(modalActions.closeModal());
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(healthPrefernceActions.setLoading({ type, loading: false }));
    }
  },
};

export default healthPreferenceService;
