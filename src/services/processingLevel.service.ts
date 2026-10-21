import { Dispatch } from "@reduxjs/toolkit";
import http from "./http.service";
import Promisable from "./promisable.service";
import { modalActions } from "redux/slices/modal";
import { processingLevelActions } from "redux/slices/processingLevel";

const url = "/processing-levels";

const processingLevelService = {
  getAll: async (filters: any, dispatch: Dispatch) => {
    dispatch?.(processingLevelActions.setLoading(true));
    http.setJWT();
    http.setLanguage();
    const payload = {
      page: filters?.page || 1,
      page_size: filters?.page_size || 20,
      ...(filters?.name ? { name: filters.name } : {}),
      ...(filters?.status ? { status: filters.status } : {}),
    };
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-All`, payload)
    );
    if (success) {
      const { processingLevels, count } = success?.data?.data || {};
      dispatch?.(
        processingLevelActions.setItems({
          items: processingLevels || [],
          count: count || 0,
        })
      );
    }
    dispatch?.(processingLevelActions.setLoading(false));
    return [success, error];
  },

  getOptions: async (dispatch: Dispatch) => {
    http.setJWT();
    http.setLanguage();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-Options`, { status: "active" })
    );
    if (success) {
      const { processingLevels } = success?.data?.data || {};
      const options = (processingLevels || []).map((row: any) => ({
        value: Number(row.value ?? row.levelValue),
        label: row.label || row.name || "",
        levelValue: Number(row.value ?? row.levelValue),
        _id: row._id,
        description: row.description || "",
      }));
      dispatch?.(processingLevelActions.setOptions({ options }));
    }
    return [success, error];
  },

  create: async (data: any, filters: any, dispatch: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      await processingLevelService.getAll(filters, dispatch);
      await processingLevelService.getOptions(dispatch);
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },

  update: async (id: string, data: any, filters: any, dispatch: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );
    if (success) {
      await processingLevelService.getAll(filters, dispatch);
      await processingLevelService.getOptions(dispatch);
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },

  remove: async (id: string, filters: any, dispatch: Dispatch) => {
    http.setJWT();
    dispatch?.(processingLevelActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.delete(`${url}/${id}`)
    );
    if (success) {
      dispatch?.(processingLevelActions.removeItem(id));
      await processingLevelService.getAll(filters, dispatch);
      await processingLevelService.getOptions(dispatch);
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(processingLevelActions.setLoading(false));
    return [success, error];
  },
};

export default processingLevelService;
