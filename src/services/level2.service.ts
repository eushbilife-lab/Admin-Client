import type { AppDispatch } from "redux/store";
import { level2Api } from "redux/api/level2/level2Api";
import { level2Actions } from "redux/slices/level2";
import { NavigateFunction } from "react-router-dom";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const level2Service = {
  create: async (
    data: any,
    navigate: NavigateFunction,
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level2Actions.setLoading(true));
    try {
      const category = await d(
        level2Api.endpoints.createLevel2.initiate(data)
      ).unwrap();
      d(level2Actions.setLevel2(category));
      navigate("/level2");
      return [{ data: { data: { category } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(level2Actions.setLoading(false));
    }
  },

  getAll: async (data: any = { all: "true" }, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level2Actions.setLoading(true));
    try {
      const result = await d(
        level2Api.endpoints.getAllLevel2.initiate(data, { forceRefetch: true })
      ).unwrap();
      d(
        level2Actions.setLevels2({
          levels2: result.categories,
          count: result.totalCount,
        })
      );
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(level2Actions.setLoading(false));
    }
  },

  getOptions: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level2Actions.setLoading(true));
    try {
      const categories = await d(
        level2Api.endpoints.getLevel2Options.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(level2Actions.setOptions({ levels2: categories }));
      return [{ data: { data: { categories } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(level2Actions.setLoading(false));
    }
  },

  get: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level2Actions.setLoading(true));
    try {
      const categorie = await d(
        level2Api.endpoints.getLevel2.initiate(id, { forceRefetch: true })
      ).unwrap();
      d(level2Actions.setLevel2(categorie));
      return [{ data: { data: { categorie } } }, null];
    } catch (error) {
      d(level2Actions.setLevel2({ data: "Not Found" }));
      return [null, error];
    } finally {
      d(level2Actions.setLoading(false));
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
      const categorie = await d(
        level2Api.endpoints.updateLevel2.initiate({ id, data })
      ).unwrap();
      d(level2Actions.setLevel2(categorie));
      navigate("/level2");
      return [{ data: { data: { categorie } } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default level2Service;
