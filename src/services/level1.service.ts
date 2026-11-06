import type { AppDispatch } from "redux/store";
import { level1Api } from "redux/api/level1/level1Api";
import { level1Actions } from "redux/slices/level1";
import { NavigateFunction } from "react-router-dom";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const level1Service = {
  create: async (
    data: any,
    navigate: NavigateFunction,
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level1Actions.setLoading(true));
    try {
      const mainCategory = await d(
        level1Api.endpoints.createLevel1.initiate(data)
      ).unwrap();
      d(level1Actions.setLevel1(mainCategory));
      navigate("/level1");
      return [{ data: { data: { mainCategory } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(level1Actions.setLoading(false));
    }
  },

  getAll: async (data: any = { all: "true" }, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level1Actions.setLoading(true));
    try {
      const result = await d(
        level1Api.endpoints.getAllLevel1.initiate(data, { forceRefetch: true })
      ).unwrap();
      d(
        level1Actions.setLevels1({
          levels1: result.mainCategories,
          count: result.totalCount,
        })
      );
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(level1Actions.setLoading(false));
    }
  },

  getOptions: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level1Actions.setLoading(true));
    try {
      const mainCategories = await d(
        level1Api.endpoints.getLevel1Options.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(level1Actions.setOptions({ levels1: mainCategories }));
      return [{ data: { data: { mainCategories } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(level1Actions.setLoading(false));
    }
  },

  get: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level1Actions.setLoading(true));
    try {
      const mainCategory = await d(
        level1Api.endpoints.getLevel1.initiate(id, { forceRefetch: true })
      ).unwrap();
      d(level1Actions.setLevel1(mainCategory));
      return [{ data: { data: { mainCategory } } }, null];
    } catch (error) {
      d(level1Actions.setLevel1({ data: "Not Found" }));
      return [null, error];
    } finally {
      d(level1Actions.setLoading(false));
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
    d(level1Actions.setLoading(true));
    try {
      const mainCategory = await d(
        level1Api.endpoints.updateLevel1.initiate({ id, data })
      ).unwrap();
      d(level1Actions.setLevel1(mainCategory));
      navigate("/level1");
      return [{ data: { data: { mainCategory } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(level1Actions.setLoading(false));
    }
  },
};

export default level1Service;
