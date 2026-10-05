import { level1Actions } from "redux/slices/level1";
import { NavigateFunction } from "react-router-dom";
import Promisable from "./promisable.service";
import http from "./http.service";
import { Dispatch } from "@reduxjs/toolkit";

const url = "/main-categories";

const level1Service = {
 
  create: async (data: any, navigate: NavigateFunction, dispatch: Dispatch) => {
    dispatch?.(level1Actions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      const { mainCategory } = success?.data?.data;
      dispatch?.(level1Actions.setLevel1(mainCategory));
      navigate("/level1");
    }
    dispatch?.(level1Actions.setLoading(false));
    return [success, error];
  },
  getAll: async (data: any = { all: "true" }, dispatch: Dispatch) => {
    dispatch?.(level1Actions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}`, data)
    );
    if (success) {
      const { mainCategories, totalCount } = success?.data?.data;
      dispatch?.(
        level1Actions.setLevels1({ levels1: mainCategories, count: totalCount })
      );
    }
    dispatch?.(level1Actions.setLoading(false));
    return [success, error];
  },
  getOptions: async (data: any, dispatch: Dispatch) => {
    dispatch?.(level1Actions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-options`, data)
    );
    if (success) {
      const { mainCategories } = success?.data?.data;
      dispatch?.(level1Actions.setOptions({ levels1: mainCategories }));
    }
    dispatch?.(level1Actions.setLoading(false));
    return [success, error];
  },
  get: async (id: string, dispatch: Dispatch) => {
    dispatch?.(level1Actions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );
    if (success) {
      const { mainCategory } = success.data.data;
      dispatch?.(level1Actions.setLevel1(mainCategory));
    } else dispatch?.(level1Actions.setLevel1({ data: "Not Found" }));

    dispatch?.(level1Actions.setLoading(false));
    return [success, error];
  },
  update: async (
    id: string,
    data: any,
    navigate: NavigateFunction,
    dispatch: Dispatch
  ) => {
    http.setJWT();
    http.setLanguage()
    dispatch?.(level1Actions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );
    if (success) {
      const { mainCategory } = success.data.data;
      dispatch?.(level1Actions.setLevel1(mainCategory));
      navigate("/level1");
    }
    dispatch?.(level1Actions.setLoading(false));
    return [success, error];
  },
};
export default level1Service;
