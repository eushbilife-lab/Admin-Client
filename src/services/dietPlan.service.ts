import type { AppDispatch } from "redux/store";
import { dietPlanApi } from "redux/api/dietPlan/dietPlanApi";
import { getAppDispatch } from "utils/dispatch.util";

const dietPlanService = {
  stats: async () => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        dietPlanApi.endpoints.getDietPlanStats.initiate(undefined, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

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

  getOne: async (id: string) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        dietPlanApi.endpoints.getDietPlan.initiate(id, { forceRefetch: true })
      ).unwrap();
      return [{ data: { data: { plan: result } } }, null];
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

  getDocuments: async (data: Record<string, unknown> = {}) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        dietPlanApi.endpoints.getDietPlanDocuments.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  getDocument: async (id: string) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        dietPlanApi.endpoints.getDietPlanDocument.initiate(id, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: { document: result } } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  getTemplates: async () => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        dietPlanApi.endpoints.getDietPlanTemplates.initiate(undefined, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  getTemplate: async (id: string) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        dietPlanApi.endpoints.getDietPlanTemplate.initiate(id, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: { template: result } } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default dietPlanService;
