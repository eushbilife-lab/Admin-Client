import type { AppDispatch } from "redux/store";
import { ingredientApi } from "redux/api/ingredient/ingredientApi";
import { ingredientActions } from "redux/slices/ingredient";
import { modalActions } from "redux/slices/modal";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const ingredientService = {
  create: async (data: any, filters: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const ingredient = await d(
        ingredientApi.endpoints.createIngredient.initiate(data)
      ).unwrap();
      if (!ingredient) d(ingredientActions.setIngredient(ingredient));
      else ingredientService.getAllIngredients(filters, d);
      d(modalActions.closeModal());
      return [{ data: { data: { ingredient } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  getAllIngredients: async (data: any = { all: "true" }, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(ingredientActions.setLoading(true));
    try {
      const result = await d(
        ingredientApi.endpoints.getAllIngredients.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        ingredientActions.setIngredients({
          ingredients: result.ingredients,
          count: result.count,
        })
      );
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(ingredientActions.setLoading(false));
    }
  },

  getOptions: async (data: any = { all: "true" }, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(ingredientActions.setLoading(true));
    try {
      const ingredients = await d(
        ingredientApi.endpoints.getIngredientOptions.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(ingredientActions.setOptions({ ingredients }));
      return [{ data: { data: { ingredients } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(ingredientActions.setLoading(false));
    }
  },

  updateIngredient: async (id: string, data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(modalActions.setLoading(true));
    try {
      const ingredient = await d(
        ingredientApi.endpoints.updateIngredient.initiate({ id, data })
      ).unwrap();
      d(ingredientActions.setIngredient({ data: ingredient }));
      d(modalActions.closeModal());
      return [{ data: { data: { ingredient } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(modalActions.setLoading(false));
    }
  },

  getByName: async (data: any = { all: "true" }, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(ingredientActions.setLoading(true));
    try {
      const ingredients = await d(
        ingredientApi.endpoints.getIngredientsByName.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(ingredientActions.setOptions({ ingredients }));
      return [{ data: { data: { ingredients } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(ingredientActions.setLoading(false));
    }
  },
};

export default ingredientService;
