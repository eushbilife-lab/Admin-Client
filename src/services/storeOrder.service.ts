import { storeOrderActions } from "redux/slices/storeOrder";
import Promisable from "./promisable.service";
import http from "./http.service";
import { Dispatch } from "@reduxjs/toolkit";

const url = "/store-orders";

const storeOrderService = {
  getAll: async (data: any = { page: 1, page_size: 50 }, dispatch: Dispatch) => {
    dispatch?.(storeOrderActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/get-All`, { ...data, isDelete: false })
    );
    if (success) {
      const { orders, count } = success?.data?.data || {};
      dispatch?.(
        storeOrderActions.setOrders({
          orders: orders || [],
          count: count || 0,
        })
      );
    }
    dispatch?.(storeOrderActions.setLoading(false));
    return [success, error];
  },

  get: async (id: string, dispatch: Dispatch) => {
    dispatch?.(storeOrderActions.setLoading(true));
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.get(`${url}/${id}`)
    );
    if (success) {
      dispatch?.(storeOrderActions.setOrder(success?.data?.data?.order || null));
    }
    dispatch?.(storeOrderActions.setLoading(false));
    return [success, error];
  },

  update: async (id: string, data: any, dispatch: Dispatch) => {
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.patch(`${url}/${id}`, data)
    );
    if (success) {
      dispatch?.(storeOrderActions.setOrder(success?.data?.data?.order));
      dispatch?.(storeOrderActions.refresh());
    }
    return [success, error];
  },
};

export default storeOrderService;
