import type { AppDispatch } from "redux/store";
import { storeOrderApi } from "redux/api/storeOrder/storeOrderApi";
import { storeOrderActions } from "redux/slices/storeOrder";
import { getAppDispatch } from "utils/dispatch.util";

function dispatchOr(d?: AppDispatch) {
  return d || getAppDispatch();
}

const storeOrderService = {
  getAll: async (
    data: any = { page: 1, page_size: 50 },
    dispatch?: AppDispatch
  ) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(storeOrderActions.setLoading(true));
    try {
      const { orders, count } = await d(
        storeOrderApi.endpoints.getAllStoreOrders.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        storeOrderActions.setOrders({
          orders: orders || [],
          count: count || 0,
        })
      );
      return [{ data: { data: { orders, count } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(storeOrderActions.setLoading(false));
    }
  },

  /** Lightweight counts per fulfillment tab (does not touch the orders list). */
  getStatusCounts: async (search = "", paymentStatus = "all") => {
    const d = getAppDispatch();
    if (!d) return {} as Record<string, number>;
    try {
      return await d(
        storeOrderApi.endpoints.getStoreOrderStatusCounts.initiate(
          { search, paymentStatus },
          { forceRefetch: true }
        )
      ).unwrap();
    } catch {
      return {} as Record<string, number>;
    }
  },

  get: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(storeOrderActions.setLoading(true));
    try {
      const order = await d(
        storeOrderApi.endpoints.getStoreOrder.initiate(id, {
          forceRefetch: true,
        })
      ).unwrap();
      d(storeOrderActions.setOrder(order || null));
      return [{ data: { data: { order } } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(storeOrderActions.setLoading(false));
    }
  },

  update: async (id: string, data: any, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      const order = await d(
        storeOrderApi.endpoints.updateStoreOrder.initiate({ id, data })
      ).unwrap();
      d(storeOrderActions.setOrder(order));
      d(storeOrderActions.refresh());
      return [{ data: { data: { order } } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  cancel: async (id: string, reason: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      const order = await d(
        storeOrderApi.endpoints.cancelStoreOrder.initiate({ id, reason })
      ).unwrap();
      d(storeOrderActions.setOrder(order));
      d(storeOrderActions.refresh());
      return [{ data: { data: { order } } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  resyncWebhook: async (id: string, dispatch?: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    try {
      const order = await d(
        storeOrderApi.endpoints.resyncStoreOrderWebhook.initiate(id)
      ).unwrap();
      d(storeOrderActions.setOrder(order));
      return [{ data: { data: { order } } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default storeOrderService;
