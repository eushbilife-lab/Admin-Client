import { getAppDispatch } from "utils/dispatch.util";
import { level4Actions } from "redux/slices/level4";
import { NavigateFunction } from "react-router-dom";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import http from "./http.service";

const url = "/nest-categories";

const level4Service = {
  create: async (data: any, navigate: NavigateFunction,dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()
    dispatch?.(level4Actions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      const { nestCategory } = success?.data?.data;
      dispatch?.(level4Actions.setLevel4(nestCategory));
      navigate("/level4");
    }
    dispatch?.(level4Actions.setLoading(false));

    return [success, error];
  },
  getAll: async (data: any = { all: "true" },dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()
    dispatch?.(level4Actions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}`, data)
    );
    if (success) {
      const { nestedCategories, totalCount } = success?.data?.data;
      dispatch?.(
        level4Actions.setLevels4({
          levels4: nestedCategories,
          count: totalCount,
        })
      );
    }
    dispatch?.(level4Actions.setLoading(false));
    return [success, error];
  },
  getOptions: async (data: any = { all: "true" },dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage()
    dispatch?.(level4Actions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-options`, data)
    );
    if (success) {
      const { nestCategories } = success?.data?.data;
      dispatch?.(level4Actions.setOptions({ levels4: nestCategories }));
    }
    dispatch?.(level4Actions.setLoading(false));
    return [success, error];
  },
  get: async (id: string,dispatch:Dispatch) => {
    dispatch?.(level4Actions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );

    if (success) {
      const { nestSubCategory } = success.data.data;
      dispatch?.(level4Actions.setLevel4(nestSubCategory));
    } else dispatch?.(level4Actions.setLevel4({ data: "Not Found" }));

    dispatch?.(level4Actions.setLoading(false));
    return [success, error];
  },
  update: async (id: string, data: any, navigate: NavigateFunction,dispatch:Dispatch) => {
    http.setJWT();
    http.setLanguage();
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );
    if (success) {
      const { nestSubCategory } = success.data.data;
      dispatch?.(level4Actions.setLevel4(nestSubCategory));
      navigate("/level4");
    }
    return [success, error];
  },
};
export default level4Service;
