import { nutritionActions } from "redux/slices/nutrition";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import http from "./http.service";

const url = "/nutrition";

const nutritionService = {
  update: async (data: any,dispatch:Dispatch) => {
    dispatch?.(nutritionActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.put(`${url}`, data)
    );
    if (success) {
      const { nutritions } = success.data.data;
        dispatch?.(nutritionActions?.setNutritions(nutritions));
    }
    dispatch?.(nutritionActions.setLoading(false));
    return [success, error];
  },
  getAll: async (dispatch:Dispatch) => {
    dispatch?.(nutritionActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}`)
    );
    if (success) {
      const { Nutritions } = success?.data?.data;
      dispatch?.(
        nutritionActions.setNutritions({
          nutritions: Nutritions
        })
      );
    }
    dispatch?.(nutritionActions.setLoading(false));
    return [success, error];
  },
};
export default nutritionService;
