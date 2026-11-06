import type { AppDispatch } from "redux/store";
import { mealPlanApi } from "redux/api/mealPlan/mealPlanApi";
import { getAppDispatch } from "utils/dispatch.util";

const mealPlanService = {
  getAll: async (data: Record<string, unknown> = {}) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        mealPlanApi.endpoints.getAllMealPlans.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  getOne: async (id: string) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const plan = await d(
        mealPlanApi.endpoints.getMealPlan.initiate(id, { forceRefetch: true })
      ).unwrap();
      return [{ data: { data: { plan } } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  create: async (data: Record<string, unknown>) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        mealPlanApi.endpoints.createMealPlan.initiate(data)
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
        mealPlanApi.endpoints.updateMealPlan.initiate({ id, data })
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
      await d(mealPlanApi.endpoints.removeMealPlan.initiate(id)).unwrap();
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default mealPlanService;
