import type { AppDispatch } from "redux/store";
import { storePaymentApi } from "redux/api/storePayment/storePaymentApi";
import { getAppDispatch } from "utils/dispatch.util";

export type StorePayment = {
  _id?: string;
  id?: string;
  paymentNo: string;
  purpose?: string;
  purposeLabel?: string;
  method: string;
  status: string;
  provider?: string;
  providerRef?: string;
  currency?: string;
  amount: number;
  subtotal?: number;
  tax?: number;
  title?: string;
  orderId?: string;
  orderNumber?: string;
  canRefund?: boolean;
  user?: { id?: string; name?: string; email?: string; phone?: string } | null;
  paidAt?: string | null;
  refundedAt?: string | null;
  refundReason?: string;
  refundProviderRef?: string;
  failureReason?: string;
  createdAt?: string;
  updatedAt?: string;
};

const storePaymentService = {
  getAll: async (data: Record<string, unknown> = {}) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        storePaymentApi.endpoints.getAllStorePayments.initiate(data, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  get: async (id: string) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const payment = await d(
        storePaymentApi.endpoints.getStorePayment.initiate(id, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: { payment } } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  getByOrder: async (orderId: string) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const payment = await d(
        storePaymentApi.endpoints.getStorePaymentByOrder.initiate(orderId, {
          forceRefetch: true,
        })
      ).unwrap();
      return [{ data: { data: { payment } } }, null];
    } catch (error) {
      return [null, error];
    }
  },

  refund: async (id: string, reason?: string) => {
    const d = getAppDispatch();
    if (!d) return [null, new Error("Store not ready")];
    try {
      const result = await d(
        storePaymentApi.endpoints.refundStorePayment.initiate({
          id,
          reason,
        })
      ).unwrap();
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default storePaymentService;
