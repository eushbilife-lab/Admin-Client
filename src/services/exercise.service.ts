import { exerciseActions } from "redux/slices/exercise";
import { modalActions } from "redux/slices/modal";
import Promisable from "./promisable.service";
import http from "./http.service";
import { Dispatch } from "@reduxjs/toolkit";

const url = "/exercises";

const exerciseService = {
  create: async (data: any, filters: any, dispatch: Dispatch) => {
    http.setJWT();
    dispatch?.(modalActions.setLoading(true));

    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      exerciseService.getAll(filters, dispatch);
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },

  getAll: async (data: any = { page: 1, page_size: 10 }, dispatch: Dispatch) => {
    dispatch?.(exerciseActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-All`, { ...data, isDelete: false })
    );
    if (success) {
      const { exercises, count } = success?.data?.data;
      dispatch?.(
        exerciseActions.setExercises({
          exercises: exercises || [],
          count: count || 0,
        })
      );
    }
    dispatch?.(exerciseActions.setLoading(false));
    return [success, error];
  },

  getOptions: async (data: any = { status: "active" }, dispatch: Dispatch) => {
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-Options`, data)
    );
    if (success) {
      const { exercises } = success?.data?.data;
      dispatch?.(exerciseActions.setOptions({ exercises: exercises || [] }));
    }
    return [success, error];
  },

  update: async (id: string, data: any, dispatch: Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );
    if (success) {
      const { exercise } = success?.data?.data;
      dispatch?.(exerciseActions.setExercise({ data: exercise }));
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },

  remove: async (id: string, filters: any, dispatch: Dispatch) => {
    http.setJWT();
    dispatch?.(exerciseActions.setLoading(true));
    const [success, error]: any = await Promisable.asPromise(
      http.delete(`${url}/${id}`)
    );
    if (success) {
      await exerciseService.getAll(filters, dispatch);
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(exerciseActions.setLoading(false));
    return [success, error];
  },
};

export default exerciseService;
