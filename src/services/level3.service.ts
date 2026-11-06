import type { AppDispatch } from "redux/store";
import { level3Api } from "redux/api/level3/level3Api";
import { level3Actions } from "redux/slices/level3";
import { NavigateFunction } from "react-router-dom";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const level3Service = {
  create: async (
    data: any,
    navigate: NavigateFunction,
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level3Actions.setLoading(true));
    try {
      const mainCategory = await d(
        level3Api.endpoints.createLevel3.initiate(data)
      ).unwrap();
      d(level3Actions.setLevel3(mainCategory));
      navigate("/level3");
      return [{ data: { data: { mainCategory } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(level3Actions.setLoading(false));
    }
  },

  getAll: async (data: any = { all: "true" }, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level3Actions.setLoading(true));
    try {
      const result = await d(
        level3Api.endpoints.getAllLevel3.initiate(data, { forceRefetch: true })
      ).unwrap();
      d(
        level3Actions.setLevels3({
          levels3: result.subCategories,
          count: result.totalCount,
        })
      );
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(level3Actions.setLoading(false));
    }
  },

  getOptions: async (data: any = { all: "true" }, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level3Actions.setLoading(true));
    try {
      const subCategories = await d(
        level3Api.endpoints.getLevel3Options.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(level3Actions.setOptions({ levels3: subCategories }));
      return [{ data: { data: { subCategories } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(level3Actions.setLoading(false));
    }
  },

  get: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(level3Actions.setLoading(true));
    try {
      const subCategory = await d(
        level3Api.endpoints.getLevel3.initiate(id, { forceRefetch: true })
      ).unwrap();
      d(level3Actions.setLevel3(subCategory));
      return [{ data: { data: { subCategory } } }, null];
    } catch (error) {
      d(level3Actions.setLevel3({ data: "Not Found" }));
      return [null, error];
    } finally {
      d(level3Actions.setLoading(false));
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
        level3Api.endpoints.updateLevel3.initiate({ id, data })
      ).unwrap();
      d(level3Actions.setLevel3(categorie));
      navigate("/level3");
      return [{ data: { data: { categorie } } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default level3Service;
