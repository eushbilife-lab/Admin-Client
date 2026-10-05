import { modalActions } from "redux/slices/modal";
import Promisable from "./promisable.service";
import { Dispatch } from "@reduxjs/toolkit";
import http from "./http.service";
import { measurementScaleActions } from "redux/slices/measurementScale";

const url = "/measurement-scales";

const MeasurementScaleService = {
  create: async (data: any,dispatch:Dispatch) => {
    dispatch?.(modalActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      const { measurementScale } = success?.data.data;
      if(!measurementScale){
        dispatch?.(
          measurementScaleActions.setMeasurementScale({ type: measurementScale?.type, data: measurementScale })
        )
      }else{
        MeasurementScaleService.getAll(measurementScale?.type, { page: 1, page_size: 3 },dispatch);
      }
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));
    return [success, error];
  },
  getAll: async (type: any, filters: any,dispatch:Dispatch) => {
    dispatch?.(measurementScaleActions.setLoading({ type, loading: true }));
    http.setJWT();
    const payload = {
      type,
      page: filters.page,
      page_size: filters.page_size,
      isDelete:false
    };
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-All-UOM`, payload)
    );

    if (success) {
      const { UOM, count } = success?.data?.data;
      dispatch?.(
        measurementScaleActions.setMeasurementScales({
          data: UOM,
          type,
          count,
        })
      );
    }
    dispatch?.(measurementScaleActions.setLoading({ type, loading: false }));
    return [success, error];
  },
  update: async (id: string, data: any,dispatch:Dispatch) => {
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
      const { uom } = success?.data?.data;
      dispatch?.(
        measurementScaleActions.setMeasurementScale({ type: uom.type, data: uom })
      );
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(modalActions.setLoading(false));

    return [success, error];
  },
  getOptions: async (payload: any,dispatch:Dispatch) => {
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-Options`, payload)
    );
    if (success) {
      const { uom,count } = success?.data?.data;
      dispatch?.(
        measurementScaleActions.setOptions({
          data: uom,
          count:count,
          type: payload?.type,
        })
      );
    }
    return [success, error];
  },
  remove: async (id: string, dispatch: Dispatch, type: any, filters: any) => {
    http.setJWT();
    http.setLanguage();
  
    dispatch?.(measurementScaleActions.setLoading({ type, loading: true }));
  
    const [success, error]: any = await Promisable.asPromise(http.delete(`${url}/${id}`));
  
    if (success) {
      let currentPage = filters.page;
      const [fetchSuccess]: any = await MeasurementScaleService.getAll(type, { ...filters }, dispatch);
      const currentImages = fetchSuccess?.data?.data?.image ?? [];
      if (currentImages.length === 0 && currentPage > 1) {
        currentPage -= 1;
     await MeasurementScaleService.getAll(type, { ...filters, page: currentPage }, dispatch);
      }
      dispatch?.(modalActions.closeModal());
    }
    dispatch?.(measurementScaleActions.setLoading({ type, loading: false }));
  
    return [success, error];
  },
};
export default MeasurementScaleService;
