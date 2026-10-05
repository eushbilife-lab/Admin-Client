import { getAppDispatch } from "utils/dispatch.util";
import Promisable from "./promisable.service";
import { rdaActions } from "redux/slices/rda";
import http from "./http.service";
import { Dispatch } from "@reduxjs/toolkit";

const url = "/rda";

const rdaService = {
  update: async (data: any,dispatch:Dispatch) => {
    dispatch?.(rdaActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.put(`${url}`, data)
    );
    if (success) {
      const { rdas } = success.data.data;
      dispatch?.(rdaActions?.setRdas({rdas}));
    }
    dispatch?.(rdaActions.setLoading(false));
    return [success, error];
  },
  getAll: async (dispatch:Dispatch) => {
    dispatch?.(rdaActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}`)
    );
    if (success) {
      const { Rdas } = success?.data?.data;
      dispatch?.(
        rdaActions.setRdas({rdas:Rdas})
      );
    }
    dispatch?.(rdaActions.setLoading(false));
    return [success, error];
  },
};
export default rdaService;
