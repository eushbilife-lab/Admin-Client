import Promisable from "./promisable.service";
import http from "./http.service";

const url = "/store-payments";

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
    http.setJWT();
    return Promisable.asPromise(http.post(`${url}/get-All`, data));
  },
  get: async (id: string) => {
    http.setJWT();
    return Promisable.asPromise(http.get(`${url}/${id}`));
  },
  getByOrder: async (orderId: string) => {
    http.setJWT();
    return Promisable.asPromise(http.get(`${url}/by-order/${orderId}`));
  },
  refund: async (id: string, reason?: string) => {
    http.setJWT();
    return Promisable.asPromise(
      http.post(`${url}/${id}/refund`, reason ? { reason } : {})
    );
  },
};

export default storePaymentService;
