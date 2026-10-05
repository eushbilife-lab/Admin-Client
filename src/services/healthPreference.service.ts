import { healthPrefernceActions } from "redux/slices/healthPrefernce";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import http from "./http.service";
import { modalActions } from "redux/slices/modal";

const url = "/health-preferences";

const healthPreferenceService = {
  create: async (data: any,dispatch:Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      const { healthPreference } = success?.data.data;
      if(!healthPreference){
        dispatch?.(
          healthPrefernceActions.setHp({ type: healthPreference?.type, data: healthPreference })
        )
      }else{
        healthPreferenceService.getAllHp(healthPreference?.type, { page: 1, page_size: 3 },dispatch);
      }
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },
  getAllHp: async (type: any, filters: any,dispatch:Dispatch) => {
    dispatch?.(healthPrefernceActions.setLoading({ type, loading: true }));
    http.setJWT();
    http.setLanguage()
    const payload = {
      type,
      page: filters.page,
      page_size: filters.page_size,
      isDelete:false
    };
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-All-hp`, payload)
    );
    if (success) {
      const { healthPreference, count } = success?.data?.data;
      dispatch?.(
        healthPrefernceActions.setHps({
          data: healthPreference,
          type,
          count,
        })
      );
    }
    dispatch?.(healthPrefernceActions.setLoading({ type, loading: false }));
    return [success, error];
  },
  update: async (id: string, data: any,dispatch:Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();

    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );
    if (success) {
      const { healthPreference } = success?.data?.data;
      dispatch?.(
        healthPrefernceActions.setHp({ type: healthPreference.type, data: healthPreference })
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
      const { healthPreference } = success?.data?.data?.healthPreferences;
      dispatch?.(
        healthPrefernceActions?.setOptions({
          healthPreferences: healthPreference,
          type: data?.type,
        })
      );
    }
    return [success, error];
  },
  remove: async (id: string, dispatch: Dispatch, type: any, filters: any) => {
    http.setJWT();
    http.setLanguage();
  
    dispatch?.(healthPrefernceActions.setLoading({ type, loading: true }));
  
    const [success, error]: any = await Promisable.asPromise(http.delete(`${url}/${id}`));
  
    if (success) {
      let currentPage = filters.page;
      const [fetchSuccess]: any = await healthPreferenceService.getAllHp(type, { ...filters }, dispatch);
      const currentImages = fetchSuccess?.data?.data?.image ?? [];
      if (currentImages.length === 0 && currentPage > 1) {
        currentPage -= 1;
     await healthPreferenceService.getAllHp(type, { ...filters, page: currentPage }, dispatch);
      }
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(healthPrefernceActions.setLoading({ type, loading: false }));
  
    return [success, error];
  },
};
export default healthPreferenceService;
