import type { AppDispatch } from "redux/store";
import { legalApi } from "redux/api/legal/legalApi";
import { getAppDispatch } from "utils/dispatch.util";

const legalService = {
  getAll: async (data: Record<string, unknown> = {}) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        legalApi.endpoints.getAllLegalPages.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  upsert: async (data: Record<string, unknown>) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        legalApi.endpoints.upsertLegalPage.initiate(data)
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default legalService;
