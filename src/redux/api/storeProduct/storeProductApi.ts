import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type StoreProductsListData = {
  products?: any[];
  count?: number;
};

export const storeProductApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllStoreProducts: build.query<
      { products: any[]; count: number },
      Record<string, unknown> | void
    >({
      query: (body = { page: 1, page_size: 50 }) => ({
        url: "/store-products/get-All",
        method: "POST",
        data: { ...body, isDelete: false },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<StoreProductsListData>(response);
        return {
          products: data?.products || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }: any) => ({
                type: "StoreProduct" as const,
                id: _id,
              })),
              { type: "StoreProduct", id: "LIST" },
            ]
          : [{ type: "StoreProduct", id: "LIST" }],
    }),

    getStoreProduct: build.query<any, string>({
      query: (id) => ({ url: `/store-products/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ product: any }>(response)?.product,
      providesTags: (_r, _e, id) => [{ type: "StoreProduct", id }],
    }),

    createStoreProduct: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/store-products/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ product: any }>(response)?.product,
      invalidatesTags: [{ type: "StoreProduct", id: "LIST" }],
    }),

    updateStoreProduct: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/store-products/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ product: any }>(response)?.product,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "StoreProduct", id },
        { type: "StoreProduct", id: "LIST" },
      ],
    }),

    removeStoreProduct: build.mutation<unknown, string>({
      query: (id) => ({ url: `/store-products/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "StoreProduct", id },
        { type: "StoreProduct", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllStoreProductsQuery,
  useLazyGetAllStoreProductsQuery,
  useGetStoreProductQuery,
  useLazyGetStoreProductQuery,
  useCreateStoreProductMutation,
  useUpdateStoreProductMutation,
  useRemoveStoreProductMutation,
} = storeProductApi;
