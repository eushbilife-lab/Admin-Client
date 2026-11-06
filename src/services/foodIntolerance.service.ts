import type { AppDispatch } from "redux/store";
import { foodIntoleranceApi } from "redux/api/foodIntolerance/foodIntoleranceApi";
import { foodIntoleranceActions } from "redux/slices/foodIntolerance";
import { modalActions } from "redux/slices/modal";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const foodIntoleranceService = {
  createMajor: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const majorIntolerance = await d(
        foodIntoleranceApi.endpoints.createMajorFoodIntolerance.initiate(data)
      ).unwrap();
      if (!majorIntolerance) {
        d(foodIntoleranceActions.setFoodIntolerances(majorIntolerance));
      } else {
        foodIntoleranceService.getAllMajor({ page: 1, page_size: 3 }, d);
      }
      d(modalActions.closeModal());
      return [{ data: { data: { majorIntolerance } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  createMinor: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const minorIntolerance = await d(
        foodIntoleranceApi.endpoints.createMinorFoodIntolerance.initiate(data)
      ).unwrap();
      if (!minorIntolerance) {
        d(foodIntoleranceActions.setFoodIntolerances(minorIntolerance));
      } else {
        foodIntoleranceService.getAllMinor({ page: 1, page_size: 3 }, d);
      }
      d(modalActions.closeModal());
      return [{ data: { data: { minorIntolerance } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  getAllMajor: async (filters: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(foodIntoleranceActions.setLoading(true));
    try {
      const { foodIntolerances: intolerances, count } = await d(
        foodIntoleranceApi.endpoints.getAllMajorFoodIntolerances.initiate(
          filters,
          { forceRefetch: true }
        )
      ).unwrap();
      d(
        foodIntoleranceActions.setFoodIntolerances({
          foodIntolerances: intolerances,
          count,
        })
      );
      return [{ data: { data: { intolerances, count } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(foodIntoleranceActions.setLoading(false));
    }
  },

  getAllMinor: async (filters: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(foodIntoleranceActions.setLoading(true));
    try {
      const { foodIntolerances: intolerances, count } = await d(
        foodIntoleranceApi.endpoints.getAllMinorFoodIntolerances.initiate(
          filters,
          { forceRefetch: true }
        )
      ).unwrap();
      d(
        foodIntoleranceActions.setFoodIntolerances({
          foodIntolerances: intolerances,
          count,
        })
      );
      return [{ data: { data: { intolerances, count } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(foodIntoleranceActions.setLoading(false));
    }
  },

  updateMajor: async (id: string, data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const updated = await d(
        foodIntoleranceApi.endpoints.updateMajorFoodIntolerance.initiate({
          id,
          data,
        })
      ).unwrap();
      d(foodIntoleranceActions.setFoodIntolerance({ data: updated }));
      d(modalActions.closeModal());
      return [{ data: { data: { updated } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  updateMinor: async (id: string, data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const updated = await d(
        foodIntoleranceApi.endpoints.updateMinorFoodIntolerance.initiate({
          id,
          data,
        })
      ).unwrap();
      d(foodIntoleranceActions.setFoodIntolerance({ data: updated }));
      d(modalActions.closeModal());
      return [{ data: { data: { updated } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  getOptions: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      const { foodIntolerances: options } = await d(
        foodIntoleranceApi.endpoints.getFoodIntoleranceOptions.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        foodIntoleranceActions.setOptions({
          foodIntolerances: options,
        })
      );
      return [{ data: { data: { options } } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default foodIntoleranceService;
