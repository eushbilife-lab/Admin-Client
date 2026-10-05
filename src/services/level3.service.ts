import { getAppDispatch } from "utils/dispatch.util";
import { NavigateFunction } from "react-router-dom";
import { level3Actions } from "redux/slices/level3";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import http from "./http.service";

const url = "/sub-categories";

const level3Service = {
  create: async (data: any, navigate: NavigateFunction,dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()
    dispatch?.(level3Actions.setLoading(true));

    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      const { mainCategory } = success?.data?.data;
      dispatch?.(level3Actions.setLevel3(mainCategory));
      navigate("/level3");
    }
    dispatch?.(level3Actions.setLoading(false));

    return [success, error];
  },
  getAll: async (data: any = { all: "true" },dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()
    dispatch?.(level3Actions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}`, data)
    );
    if (success) {
      const { subCategories, totalCount } = success?.data?.data;
      dispatch?.(
        level3Actions.setLevels3({
          levels3: subCategories,
          count: totalCount,
        })
      );
    }
    dispatch?.(level3Actions.setLoading(false));
    return [success, error];
  },
  getOptions: async (data: any = { all: "true" },dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()
    dispatch?.(level3Actions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-options`, data)
    );
    if (success) {
      const { subCategories } = success?.data?.data;
      dispatch?.(level3Actions.setOptions({ levels3: subCategories }));
    }
    dispatch?.(level3Actions.setLoading(false));
    return [success, error];
  },
  get: async (id: string,dispatch:Dispatch) => {
    dispatch?.(level3Actions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );
    if (success) {
      const { subCategory } = success.data.data;
      dispatch?.(level3Actions.setLevel3(subCategory));
    } else dispatch?.(level3Actions.setLevel3({ data: "Not Found" }));

    dispatch?.(level3Actions.setLoading(false));
    return [success, error];
  },
  update: async (id: string, data: any, navigate: NavigateFunction,dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );

    if (success) {
      const { categorie } = success.data.data;
      dispatch?.(level3Actions.setLevel3(categorie));
      navigate("/level3");
    }

    return [success, error];
  },
};
export default level3Service;
