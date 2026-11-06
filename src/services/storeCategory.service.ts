import type { AppDispatch } from "redux/store";
import { storeCategoryApi } from "redux/api/storeCategory/storeCategoryApi";
import { getAppDispatch } from "utils/dispatch.util";

const storeCategoryService = {
  getAll: async (data: any = {}) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        storeCategoryApi.endpoints.getAllStoreCategories.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  create: async (data: any) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        storeCategoryApi.endpoints.createStoreCategory.initiate(data)
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  update: async (id: string, data: any) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        storeCategoryApi.endpoints.updateStoreCategory.initiate({ id, data })
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
      await d(
        storeCategoryApi.endpoints.removeStoreCategory.initiate(id)
      ).unwrap();
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default storeCategoryService;
