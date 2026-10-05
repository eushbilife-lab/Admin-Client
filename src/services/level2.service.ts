import { level2Actions } from "redux/slices/level2";
import { NavigateFunction } from "react-router-dom";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import http from "./http.service";

const url = "/categories";

const level2Service = {
  create: async (data: any, navigate: NavigateFunction,dispatch:Dispatch) => {
    dispatch?.(level2Actions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      const { category } = success?.data?.data;
      dispatch?.(level2Actions.setLevel2(category));
      navigate("/level2");
    }
    dispatch?.(level2Actions.setLoading(false));

    return [success, error];
  },
  getAll: async (data: any = { all: "true" },dispatch:Dispatch) => {
    dispatch?.(level2Actions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}`, data)
    );
    if (success) {
      const { categories, totalCount } = success?.data?.data;
      dispatch?.(
        level2Actions.setLevels2({
          levels2: categories,
          count: totalCount,
        })
      );
    }
    dispatch?.(level2Actions.setLoading(false));
    return [success, error];
  },
  getOptions: async (data: any,dispatch:Dispatch) => {
    dispatch?.(level2Actions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-options`, data)
    );
    if (success) {
      const { categories } = success?.data?.data;
      dispatch?.(level2Actions.setOptions({ levels2: categories }));
    }
    dispatch?.(level2Actions.setLoading(false));
    return [success, error];
  },
  get: async (id: string,dispatch:Dispatch) => {
    dispatch?.(level2Actions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );

    if (success) {
      const { categorie } = success.data.data;
      dispatch?.(level2Actions.setLevel2(categorie));
    } else dispatch?.(level2Actions.setLevel2({ data: "Not Found" }));

    dispatch?.(level2Actions.setLoading(false));
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
      dispatch?.(level2Actions.setLevel2(categorie));
      navigate("/level2");
    }

    return [success, error];
  },
};
export default level2Service;
