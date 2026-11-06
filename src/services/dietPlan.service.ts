import type { AppDispatch } from "redux/store";
import { dietPlanApi } from "redux/api/dietPlan/dietPlanApi";
import { getAppDispatch } from "utils/dispatch.util";

const dietPlanService = {
  getAll: async (data: Record<string, unknown> = {}) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        dietPlanApi.endpoints.getAllDietPlans.initiate(data, {
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
        dietPlanApi.endpoints.createDietPlan.initiate(data)
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
        dietPlanApi.endpoints.updateDietPlan.initiate({ id, data })
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
      await d(dietPlanApi.endpoints.removeDietPlan.initiate(id)).unwrap();
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default dietPlanService;
