import { modalActions } from "redux/slices/modal";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import http from "./http.service";
import { foodIntoleranceActions } from "redux/slices/foodIntolerance";

const url = "/food-intolerances";

const foodIntoleranceService = {
  createMajor: async (data: any, dispatch: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create-major`, data)
    );
    if (success) {
      const { majorIntolerance } = success?.data.data;
      if (!majorIntolerance) {
        dispatch?.(
          foodIntoleranceActions.setFoodIntolerances(majorIntolerance)
        );
      }
      else{
        foodIntoleranceService.getAllMajor({ page: 1, page_size: 3 },dispatch);
      }
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },
  createMinor: async (data: any, dispatch: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create-minor`, data)
    );
    if (success) {
      const { minorIntolerance } = success?.data.data;
      if (!minorIntolerance) {
        dispatch?.(
          foodIntoleranceActions.setFoodIntolerances(minorIntolerance)
        );
      }
      else{
        foodIntoleranceService.getAllMinor({ page: 1, page_size: 3 },dispatch);
      }
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },
  getAllMajor: async (filters: any, dispatch: Dispatch) => {
    dispatch?.(foodIntoleranceActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const payload = {
      page: filters.page,
      page_size: filters.page_size,
    };
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/major-FoodIntolerance`, payload)
    );

    if (success) {
      const { intolerances, count } = success?.data?.data;
      dispatch?.(
        foodIntoleranceActions.setFoodIntolerances({
          foodIntolerances: intolerances,
          count,
        })
      );
    }
    dispatch?.(foodIntoleranceActions.setLoading(false));
    return [success, error];
  },
  getAllMinor: async (filters: any, dispatch: Dispatch) => {
    dispatch?.(foodIntoleranceActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const payload = {
      page: filters.page,
      page_size: filters.page_size,
    };
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/minor-FoodIntolerance`, payload)
    );
    if (success) {
    const { intolerances, count } = success?.data?.data;
      dispatch?.(
          foodIntoleranceActions.setFoodIntolerances({
          foodIntolerances: intolerances,
          count,
        })
      );
    }
    dispatch?.(foodIntoleranceActions.setLoading(false));
    return [success, error];
  },
  updateMajor: async (id: string, data: any, dispatch: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/update-Major/${id}`, data)
    );
    if (success) {
      const { updated } = success?.data?.data;
      dispatch?.(
        foodIntoleranceActions.setFoodIntolerance({data:updated})
      );
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));

    return [success, error];
  },
  updateMinor: async (id: string, data: any, dispatch: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/update-Minor/${id}`, data)
    );
    if (success) {
      const { updated } = success?.data?.data;
      dispatch?.(
          foodIntoleranceActions.setFoodIntolerance({data:updated})
      );
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));

    return [success, error];
  },
  getOptions: async (data: any,dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-Options`, data)
    );
    if (success) {
      const { options } = success?.data?.data;
      dispatch?.(
        foodIntoleranceActions.setOptions({
          foodIntolerances: options,
        })
      );
    }
    return [success, error];
  },
};
export default foodIntoleranceService;
