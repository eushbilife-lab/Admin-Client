import { storeProductActions } from "redux/slices/storeProduct";
import Promisable from "./promisable.service";
import http from "./http.service";
import { Dispatch } from "@reduxjs/toolkit";

const url = "/store-products";

const storeProductService = {
  getAll: async (data: any = { page: 1, page_size: 50 }, dispatch: Dispatch) => {
    dispatch?.(storeProductActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-All`, { ...data, isDelete: false })
    );
    if (success) {
      const { products, count } = success?.data?.data || {};
      dispatch?.(
        storeProductActions.setProducts({
          products: products || [],
          count: count || 0,
        })
      );
    }
    dispatch?.(storeProductActions.setLoading(false));
    return [success, error];
  },

  get: async (id: string, dispatch: Dispatch) => {
    dispatch?.(storeProductActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );
    if (success) {
      dispatch?.(
        storeProductActions.setProduct(success?.data?.data?.product || null)
      );
    }
    dispatch?.(storeProductActions.setLoading(false));
    return [success, error];
  },

  create: async (data: any, dispatch: Dispatch) => {
    dispatch?.(storeProductActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/create`, data)
    );
    if (success) {
      dispatch?.(storeProductActions.setProduct(success?.data?.data?.product));
      dispatch?.(storeProductActions.refresh());
    }
    dispatch?.(storeProductActions.setLoading(false));
    return [success, error];
  },

  update: async (id: string, data: any, dispatch: Dispatch) => {
    dispatch?.(storeProductActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );
    if (success) {
      dispatch?.(storeProductActions.setProduct(success?.data?.data?.product));
      dispatch?.(storeProductActions.refresh());
    }
    dispatch?.(storeProductActions.setLoading(false));
    return [success, error];
  },

  remove: async (id: string, dispatch: Dispatch) => {
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.delete(`${url}/${id}`)
    );
    if (success) dispatch?.(storeProductActions.refresh());
    return [success, error];
  },
};

export default storeProductService;
