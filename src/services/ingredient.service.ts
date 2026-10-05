import { ingredientActions } from "redux/slices/ingredient";
import { modalActions } from "redux/slices/modal";
import Promisable from "./promisable.service";
import http from "./http.service";
import { Dispatch } from "@reduxjs/toolkit";

const url = "/ingredients";

const ingredientService = {
  create: async (data: any, filters: any, dispatch: Dispatch) => {
    http.setJWT();

    dispatch?.(modalActions.setLoading(true));

    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      const { ingredient } = success?.data?.data;
      if (!ingredient)
        dispatch?.(ingredientActions.setIngredient(ingredient));
      else
        ingredientService.getAllIngredients(filters, dispatch);

      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));

    return [success, error];
  },
  getAllIngredients: async (data: any = { all: "true" }, dispatch: Dispatch) => {
    dispatch?.(ingredientActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-All-Ingredients`, data)
    );
    if (success) {
      const { ingredients, count } = success?.data?.data;
      dispatch?.(
        ingredientActions.setIngredients({
          ingredients: ingredients,
          count: count,
        })
      );
    }
    dispatch?.(ingredientActions.setLoading(false));
    return [success, error];
  },
  getOptions: async (data: any = { all: "true" }, dispatch: Dispatch) => {
    dispatch?.(ingredientActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-Options`, data)
    );
    if (success) {
      const { ingredients } = success?.data?.data;
      dispatch?.(ingredientActions.setOptions({ ingredients: ingredients }));
    }
    dispatch?.(ingredientActions.setLoading(false));
    return [success, error];
  },
  updateIngredient: async (id: string, data: any, dispatch: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    const updatedData = {
      ...data,
      ar: {
        ...data.ar,
        name: data.ar?.name?.trim() ? data.ar.name : "",
      },
    };
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, updatedData)
    );
    if (success) {
      const { ingredient } = success?.data?.data;
      dispatch?.(ingredientActions.setIngredient({ data: ingredient }));
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));

    return [success, error];
  },
  getByName: async (data: any = { all: "true" }, dispatch: Dispatch) => {
    dispatch?.(ingredientActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-By-Name`, data)
    );
    if (success) {
      const { ingredients } = success?.data?.data;
      dispatch?.(ingredientActions.setOptions({ ingredients: ingredients }));
    }
    dispatch?.(ingredientActions.setLoading(false));
    return [success, error];
  },
};
export default ingredientService;
