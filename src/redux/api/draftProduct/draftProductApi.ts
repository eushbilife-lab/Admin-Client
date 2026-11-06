import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type DraftProductsListData = {
  products: any[];
  totalCount: number;
};

export const draftProductApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createDraftProduct: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/draft-products/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ product: any }>(response)?.product,
      invalidatesTags: [{ type: "DraftProduct", id: "LIST" }],
    }),

    getAllDraftProducts: build.query<
      { products: any[]; totalCount: number },
      Record<string, unknown>
    >({
      query: (body) => ({
        url: "/draft-products/query",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<DraftProductsListData>(response);
        return {
          products: data?.products || [],
          totalCount: data?.totalCount ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }: any) => ({
                type: "DraftProduct" as const,
                id: _id,
              })),
              { type: "DraftProduct", id: "LIST" },
            ]
          : [{ type: "DraftProduct", id: "LIST" }],
    }),

    getDraftProduct: build.query<any, string>({
      query: (id) => ({ url: `/draft-products/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ product: any }>(response)?.product,
      providesTags: (_r, _e, id) => [{ type: "DraftProduct", id }],
    }),

    updateDraftProduct: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/draft-products/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ updatedDraftProduct: any }>(response)?.updatedDraftProduct,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "DraftProduct", id },
        { type: "DraftProduct", id: "LIST" },
      ],
    }),

    removeDraftProduct: build.mutation<unknown, string>({
      query: (id) => ({ url: `/draft-products/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "DraftProduct", id },
        { type: "DraftProduct", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateDraftProductMutation,
  useGetAllDraftProductsQuery,
  useLazyGetAllDraftProductsQuery,
  useGetDraftProductQuery,
  useLazyGetDraftProductQuery,
  useUpdateDraftProductMutation,
  useRemoveDraftProductMutation,
} = draftProductApi;
