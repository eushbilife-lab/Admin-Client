import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type StoreOrdersListData = {
  orders?: any[];
  count?: number;
};

const STATUS_COUNT_KEYS = [
  "all",
  "placed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const storeOrderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllStoreOrders: build.query<
      { orders: any[]; count: number },
      Record<string, unknown> | void
    >({
      query: (body = { page: 1, page_size: 50 }) => ({
        url: "/store-orders/get-All",
        method: "POST",
        data: { ...body, isDelete: false },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<StoreOrdersListData>(response);
        return {
          orders: data?.orders || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }: any) => ({
                type: "StoreOrder" as const,
                id: _id,
              })),
              { type: "StoreOrder", id: "LIST" },
            ]
          : [{ type: "StoreOrder", id: "LIST" }],
    }),

    getStoreOrderStatusCounts: build.query<
      Record<string, number>,
      { search?: string; paymentStatus?: string } | void
    >({
      async queryFn(arg, _api, _extra, baseQuery) {
        const search = arg?.search ?? "";
        const paymentStatus = arg?.paymentStatus ?? "all";
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
            const result = await baseQuery({
              url: "/store-orders/get-All",
              method: "POST",
              data: body,
            });
            if (result.error) return [key, 0] as const;
            const data = unwrapData<{ count?: number }>(result.data);
            return [key, Number(data?.count || 0)] as const;
          })
        );
        return { data: Object.fromEntries(entries) as Record<string, number> };
      },
      providesTags: [{ type: "StoreOrder", id: "STATUS_COUNTS" }],
    }),

    getStoreOrder: build.query<any, string>({
      query: (id) => ({ url: `/store-orders/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ order: any }>(response)?.order,
      providesTags: (_r, _e, id) => [{ type: "StoreOrder", id }],
    }),

    updateStoreOrder: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/store-orders/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ order: any }>(response)?.order,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "StoreOrder", id },
        { type: "StoreOrder", id: "LIST" },
        { type: "StoreOrder", id: "STATUS_COUNTS" },
      ],
    }),

    cancelStoreOrder: build.mutation<any, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/store-orders/${id}/cancel`,
        method: "POST",
        data: { reason },
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ order: any }>(response)?.order,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "StoreOrder", id },
        { type: "StoreOrder", id: "LIST" },
        { type: "StoreOrder", id: "STATUS_COUNTS" },
      ],
    }),

    resyncStoreOrderWebhook: build.mutation<any, string>({
      query: (id) => ({
        url: `/store-orders/${id}/resync-webhook`,
        method: "POST",
        data: {},
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ order: any }>(response)?.order,
      invalidatesTags: (_r, _e, id) => [{ type: "StoreOrder", id }],
    }),
  }),
});

export const {
  useGetAllStoreOrdersQuery,
  useLazyGetAllStoreOrdersQuery,
  useGetStoreOrderStatusCountsQuery,
  useLazyGetStoreOrderStatusCountsQuery,
  useGetStoreOrderQuery,
  useLazyGetStoreOrderQuery,
  useUpdateStoreOrderMutation,
  useCancelStoreOrderMutation,
  useResyncStoreOrderWebhookMutation,
} = storeOrderApi;
