import { dynamicActions } from "redux/slices/dynamic";
import { modalActions } from "redux/slices/modal";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import http from "./http.service";

const url = "/dynamics";

const dynamicService = {
  create: async (data: any,dispatch:Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      const { dynamic } = success?.data.data;
      if(!dynamic){
        dispatch?.(
          dynamicActions.setDynamic({ type: dynamic?.type, data: dynamic })
        )
      }else{
        dynamicService.getAllDynamics(dynamic?.type, { page: 1, page_size: 3 },dispatch);
      }
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },
  getAllDynamics: async (type: any, filters: any,dispatch:Dispatch) => {
    dispatch?.(dynamicActions.setLoading({ type, loading: true }));
    http.setJWT();
    const payload = {
      type,
      page: filters.page,
      page_size: filters.page_size,
    };
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-All-Dynamics`, payload)
    );

    if (success) {
      const { dynamic, count } = success?.data?.data;
      dispatch?.(
        dynamicActions.setDynamics({
          data: dynamic,
          type,
          count,
        })
      );
    }
    dispatch?.(dynamicActions.setLoading({ type, loading: false }));
    return [success, error];
  },
  updateDynamic: async (id: string, data: any,dispatch:Dispatch) => {
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
      const { dynamics } = success?.data?.data;
      dispatch?.(
        dynamicActions.setDynamic({ type: dynamics.type, data: dynamics })
      );
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));

    return [success, error];
  },
  getOptions: async (data: any = { all: "true" },dispatch:Dispatch) => {
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-Options`, data)
    );
    if (success) {
      const { dynamics } = success?.data?.data;
      dispatch?.(
        dynamicActions.setOptions({
          dynamics: dynamics,
          type: data?.type,
        })
      );
    }
    return [success, error];
  },
};
export default dynamicService;
