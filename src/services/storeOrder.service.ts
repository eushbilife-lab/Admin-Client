import { storeOrderActions } from "redux/slices/storeOrder";
import Promisable from "./promisable.service";
import http from "./http.service";
import { Dispatch } from "@reduxjs/toolkit";

const url = "/store-orders";

const STATUS_COUNT_KEYS = [
  "all",
  "placed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

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

  /** Lightweight counts per fulfillment tab (does not touch the orders list). */
  getStatusCounts: async (search = "", paymentStatus = "all") => {
    http.setJWT();
    const entries = await Promise.all(
      STATUS_COUNT_KEYS.map(async (key) => {
        const body: Record<string, unknown> = {
          page: 1,
          page_size: 1,
          isDelete: false,
        };
        if (key !== "all") body.status = key;
        if (search.trim()) body.search = search.trim();
        if (paymentStatus !== "all") body.paymentStatus = paymentStatus;
        const [success]: any = await Promisable.asPromise(
          http.post(`${url}/get-All`, body)
        );
        return [key, Number(success?.data?.data?.count || 0)] as const;
      })
    );
    return Object.fromEntries(entries) as Record<string, number>;
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

  cancel: async (id: string, reason: string, dispatch: Dispatch) => {
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/${id}/cancel`, { reason })
    );
    if (success) {
      dispatch?.(storeOrderActions.setOrder(success?.data?.data?.order));
      dispatch?.(storeOrderActions.refresh());
    }
    return [success, error];
  },

  resyncWebhook: async (id: string, dispatch: Dispatch) => {
    http.setJWT();
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}/${id}/resync-webhook`, {})
    );
    if (success) {
      dispatch?.(storeOrderActions.setOrder(success?.data?.data?.order));
    }
    return [success, error];
  },
};

export default storeOrderService;
