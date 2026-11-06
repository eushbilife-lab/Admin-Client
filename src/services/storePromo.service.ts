import type { AppDispatch } from "redux/store";
import { storePromoApi } from "redux/api/storePromo/storePromoApi";
import { getAppDispatch } from "utils/dispatch.util";

const storePromoService = {
  getAll: async (data: Record<string, unknown> = {}) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        storePromoApi.endpoints.getAllStorePromos.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  create: async (data: Record<string, unknown>) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        storePromoApi.endpoints.createStorePromo.initiate(data)
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  update: async (id: string, data: Record<string, unknown>) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        storePromoApi.endpoints.updateStorePromo.initiate({ id, data })
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  remove: async (id: string) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      await d(storePromoApi.endpoints.removeStorePromo.initiate(id)).unwrap();
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default storePromoService;
