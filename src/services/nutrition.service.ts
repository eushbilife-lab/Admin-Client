import type { AppDispatch } from "redux/store";
import { nutritionApi } from "redux/api/nutrition/nutritionApi";
import { nutritionActions } from "redux/slices/nutrition";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const nutritionService = {
  update: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(nutritionActions.setLoading(true));
    try {
      const list = await d(
        nutritionApi.endpoints.updateNutrition.initiate(data)
      ).unwrap();
      d(nutritionActions.setNutritions({ nutritions: list }));
      return [{ data: { data: { nutritions: list } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(nutritionActions.setLoading(false));
    }
  },

  getAll: async (dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(nutritionActions.setLoading(true));
    try {
      const Nutritions = await d(
        nutritionApi.endpoints.getAllNutritions.initiate(undefined, {
          forceRefetch: true,
        })
      ).unwrap();
      d(nutritionActions.setNutritions({ nutritions: Nutritions }));
      return [{ data: { data: { Nutritions } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(nutritionActions.setLoading(false));
    }
  },
};

export default nutritionService;
