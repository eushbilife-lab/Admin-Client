import type { AppDispatch } from "redux/store";
import { recipeApi } from "redux/api/recipe/recipeApi";
import { recipeActions } from "redux/slices/recipe";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const recipeService = {
  getAll: async (
    data: any = { page: 1, page_size: 50 },
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(recipeActions.setLoading(true));
    try {
      const { recipes, count } = await d(
        recipeApi.endpoints.getAllRecipes.initiate(data, { forceRefetch: true })
      ).unwrap();
      d(
        recipeActions.setRecipes({
          recipes: recipes || [],
          count: count || 0,
        })
      );
      return [{ data: { data: { recipes, count } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(recipeActions.setLoading(false));
    }
  },

  get: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(recipeActions.setLoading(true));
    try {
      const recipe = await d(
        recipeApi.endpoints.getRecipe.initiate(id, { forceRefetch: true })
      ).unwrap();
      d(recipeActions.setRecipe(recipe || null));
      return [{ data: { data: { recipe } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(recipeActions.setLoading(false));
    }
  },

  create: async (data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(recipeActions.setLoading(true));
    try {
      const recipe = await d(
        recipeApi.endpoints.createRecipe.initiate(data)
      ).unwrap();
      d(recipeActions.setRecipe(recipe));
      d(recipeActions.refresh());
      return [{ data: { data: { recipe } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(recipeActions.setLoading(false));
    }
  },

  update: async (id: string, data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(recipeActions.setLoading(true));
    try {
      const recipe = await d(
        recipeApi.endpoints.updateRecipe.initiate({ id, data })
      ).unwrap();
      d(recipeActions.setRecipe(recipe));
      d(recipeActions.refresh());
      return [{ data: { data: { recipe } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(recipeActions.setLoading(false));
    }
  },

  remove: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(recipeActions.setLoading(true));
    try {
      await d(recipeApi.endpoints.removeRecipe.initiate(id)).unwrap();
      d(recipeActions.removeRecipe(id));
      d(recipeActions.refresh());
      return [{ data: { data: {} } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(recipeActions.setLoading(false));
    }
  },
};

export default recipeService;
