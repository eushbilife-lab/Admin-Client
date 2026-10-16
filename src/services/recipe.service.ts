import { recipeActions } from "redux/slices/recipe";
import Promisable from "./promisable.service";
import http from "./http.service";
import { Dispatch } from "@reduxjs/toolkit";

const url = "/recipes";

const recipeService = {
  getAll: async (data: any = { page: 1, page_size: 50 }, dispatch: Dispatch) => {
    dispatch?.(recipeActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-All`, { ...data, isDelete: false })
    );
    if (success) {
      const { recipes, count } = success?.data?.data || {};
      dispatch?.(
        recipeActions.setRecipes({
          recipes: recipes || [],
          count: count || 0,
        })
      );
    }
    dispatch?.(recipeActions.setLoading(false));
    return [success, error];
  },

  get: async (id: string, dispatch: Dispatch) => {
    dispatch?.(recipeActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );
    if (success) {
      dispatch?.(recipeActions.setRecipe(success?.data?.data?.recipe || null));
    }
    dispatch?.(recipeActions.setLoading(false));
    return [success, error];
  },

  create: async (data: any, dispatch: Dispatch) => {
    dispatch?.(recipeActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      dispatch?.(recipeActions.setRecipe(success?.data?.data?.recipe));
      dispatch?.(recipeActions.refresh());
    }
    dispatch?.(recipeActions.setLoading(false));
    return [success, error];
  },

  update: async (id: string, data: any, dispatch: Dispatch) => {
    dispatch?.(recipeActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );
    if (success) {
      dispatch?.(recipeActions.setRecipe(success?.data?.data?.recipe));
      dispatch?.(recipeActions.refresh());
    }
    dispatch?.(recipeActions.setLoading(false));
    return [success, error];
  },

  remove: async (id: string, dispatch: Dispatch) => {
    dispatch?.(recipeActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.delete(`${url}/${id}`)
    );
    if (success) dispatch?.(recipeActions.refresh());
    dispatch?.(recipeActions.setLoading(false));
    return [success, error];
  },
};

export default recipeService;
