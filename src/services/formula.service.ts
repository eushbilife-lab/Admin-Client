import type { AppDispatch } from "redux/store";
import { formulaApi } from "redux/api/formula/formulaApi";
import { getAppDispatch } from "utils/dispatch.util";

const formulaService = {
  getActive: async () => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const config = await d(
        formulaApi.endpoints.getActiveFormula.initiate(undefined, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: { config } } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  getDefaults: async () => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        formulaApi.endpoints.getFormulaDefaults.initiate(undefined, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  getSection: async (section: string) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        formulaApi.endpoints.getFormulaSection.initiate(section, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  saveSection: async (section: string, data: Record<string, unknown>) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const config = await d(
        formulaApi.endpoints.saveFormulaSection.initiate({ section, data })
      ).unwrap();
      return [{ data: { data: { config } } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  replace: async (data: Record<string, unknown>) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        formulaApi.endpoints.replaceFormula.initiate(data)
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  reset: async () => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const config = await d(
        formulaApi.endpoints.resetFormula.initiate()
      ).unwrap();
      return [{ data: { data: { config } } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default formulaService;
