import { storeBannerActions } from "redux/slices/storeBanner";
import Promisable from "./promisable.service";
import http from "./http.service";
import { Dispatch } from "@reduxjs/toolkit";

const url = "/store-banners";

const storeBannerService = {
  getAll: async (data: any = { page: 1, page_size: 50 }, dispatch: Dispatch) => {
    dispatch?.(storeBannerActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-All`, { ...data, isDelete: false })
    );
    if (success) {
      const { banners, count } = success?.data?.data || {};
      dispatch?.(
        storeBannerActions.setBanners({
          banners: banners || [],
          count: count || 0,
        })
      );
    }
    dispatch?.(storeBannerActions.setLoading(false));
    return [success, error];
  },

  get: async (id: string, dispatch: Dispatch) => {
    dispatch?.(storeBannerActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );
    if (success) {
      dispatch?.(
        storeBannerActions.setBanner(success?.data?.data?.banner || null)
      );
    }
    dispatch?.(storeBannerActions.setLoading(false));
    return [success, error];
  },

  create: async (data: any, dispatch: Dispatch) => {
    dispatch?.(storeBannerActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      dispatch?.(storeBannerActions.setBanner(success?.data?.data?.banner));
      dispatch?.(storeBannerActions.refresh());
    }
    dispatch?.(storeBannerActions.setLoading(false));
    return [success, error];
  },

  update: async (id: string, data: any, dispatch: Dispatch) => {
    dispatch?.(storeBannerActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );
    if (success) {
      dispatch?.(storeBannerActions.setBanner(success?.data?.data?.banner));
      dispatch?.(storeBannerActions.refresh());
    }
    dispatch?.(storeBannerActions.setLoading(false));
    return [success, error];
  },

  remove: async (id: string, dispatch: Dispatch) => {
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.delete(`${url}/${id}`)
    );
    if (success) dispatch?.(storeBannerActions.refresh());
    return [success, error];
  },
};

export default storeBannerService;
