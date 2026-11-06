import type { AppDispatch } from "redux/store";
import { nutritionistApi } from "redux/api/nutritionist/nutritionistApi";
import { getAppDispatch } from "utils/dispatch.util";

const nutritionistService = {
  getAll: async (data: Record<string, unknown> = {}) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        nutritionistApi.endpoints.getAllNutritionistRequests.initiate(data, {
          forceRefetch: true,
        })
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
        nutritionistApi.endpoints.updateNutritionistRequest.initiate({
          id,
          data,
        })
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default nutritionistService;
