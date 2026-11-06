import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

export type { StorePayment } from "services/storePayment.service";

type StorePaymentsListData = {
  payments?: any[];
  count?: number;
  pagination?: { total?: number };
  stats?: unknown;
  policy?: unknown;
};

export const storePaymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllStorePayments: build.query<
      {
        payments: any[];
        count: number;
        stats: unknown;
        policy: unknown;
      },
      Record<string, unknown> | void
    >({
      query: (body = {}) => ({
        url: "/store-payments/get-All",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<StorePaymentsListData>(response);
        return {
          payments: data?.payments || [],
          count: data?.pagination?.total ?? data?.count ?? 0,
          stats: data?.stats ?? null,
          policy: data?.policy ?? null,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.payments.map(({ _id, id }: any) => ({
                type: "StorePayment" as const,
                id: _id || id,
              })),
              { type: "StorePayment", id: "LIST" },
            ]
          : [{ type: "StorePayment", id: "LIST" }],
    }),

    getStorePayment: build.query<any, string>({
      query: (id) => ({ url: `/store-payments/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ payment: any }>(response)?.payment,
      providesTags: (_r, _e, id) => [{ type: "StorePayment", id }],
    }),

    getStorePaymentByOrder: build.query<any, string>({
      query: (orderId) => ({
        url: `/store-payments/by-order/${orderId}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ payment: any }>(response)?.payment,
      providesTags: (_r, _e, orderId) => [
        { type: "StorePayment", id: `ORDER_${orderId}` },
      ],
    }),

    refundStorePayment: build.mutation<any, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/store-payments/${id}/refund`,
        method: "POST",
        data: reason ? { reason } : {},
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "StorePayment", id },
        { type: "StorePayment", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllStorePaymentsQuery,
  useLazyGetAllStorePaymentsQuery,
  useGetStorePaymentQuery,
  useLazyGetStorePaymentQuery,
  useGetStorePaymentByOrderQuery,
  useLazyGetStorePaymentByOrderQuery,
  useRefundStorePaymentMutation,
} = storePaymentApi;
