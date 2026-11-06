import type { AppDispatch } from "redux/store";
import { level4Api } from "redux/api/level4/level4Api";
import { level4Actions } from "redux/slices/level4";
import { NavigateFunction } from "react-router-dom";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const level4Service = {
  create: async (
    data: any,
    navigate: NavigateFunction,
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level4Actions.setLoading(true));
    try {
      const nestCategory = await d(
        level4Api.endpoints.createLevel4.initiate(data)
      ).unwrap();
      d(level4Actions.setLevel4(nestCategory));
      navigate("/level4");
      return [{ data: { data: { nestCategory } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(level4Actions.setLoading(false));
    }
  },

  getAll: async (data: any = { all: "true" }, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level4Actions.setLoading(true));
    try {
      const result = await d(
        level4Api.endpoints.getAllLevel4.initiate(data, { forceRefetch: true })
      ).unwrap();
      d(
        level4Actions.setLevels4({
          levels4: result.nestedCategories,
          count: result.totalCount,
        })
      );
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(level4Actions.setLoading(false));
    }
  },

  getOptions: async (data: any = { all: "true" }, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level4Actions.setLoading(true));
    try {
      const nestCategories = await d(
        level4Api.endpoints.getLevel4Options.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(level4Actions.setOptions({ levels4: nestCategories }));
      return [{ data: { data: { nestCategories } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(level4Actions.setLoading(false));
    }
  },

  get: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level4Actions.setLoading(true));
    try {
      const nestSubCategory = await d(
        level4Api.endpoints.getLevel4.initiate(id, { forceRefetch: true })
      ).unwrap();
      d(level4Actions.setLevel4(nestSubCategory));
      return [{ data: { data: { nestSubCategory } } }, null];
    } catch (error) {
      d(level4Actions.setLevel4({ data: "Not Found" }));
      return [null, error];
    } finally {
      d(level4Actions.setLoading(false));
    }
  },

  update: async (
    id: string,
    data: any,
    navigate: NavigateFunction,
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      const nestSubCategory = await d(
        level4Api.endpoints.updateLevel4.initiate({ id, data })
      ).unwrap();
      d(level4Actions.setLevel4(nestSubCategory));
      navigate("/level4");
      return [{ data: { data: { nestSubCategory } } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default level4Service;
