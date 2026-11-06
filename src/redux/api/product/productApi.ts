import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type ProductsListData = {
  products: any[];
  totalCount: number;
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProduct: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({ url: "/products", method: "POST", data }),
      transformResponse: (response: unknown) =>
        unwrapData<{ product: any }>(response)?.product,
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    getAllProducts: build.query<
      { products: any[]; totalCount: number },
      Record<string, unknown>
    >({
      query: (body) => ({
        url: "/products/query",
        method: "POST",
        data: { ...body, isDelete: false },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<ProductsListData>(response);
        return {
          products: data?.products || [],
          totalCount: data?.totalCount ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }: any) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProduct: build.query<any, string>({
      query: (id) => ({ url: `/products/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ product: any }>(response)?.product,
      providesTags: (_r, _e, id) => [{ type: "Product", id }],
    }),

    updateProduct: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ updatedProduct: any }>(response)?.updatedProduct,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    updateProductImages: build.mutation<
      any,
      { id: string; formData: FormData; previousImages: string[] }
    >({
      query: ({ id, formData, previousImages }) => ({
        url: `/products/${id}/images`,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        params: { previousImages: JSON.stringify(previousImages) },
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ updatedProduct: any }>(response)?.updatedProduct,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    updateProductStatus: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}/status`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ updatedStatus: any }>(response)?.updatedStatus,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    keepProductImages: build.mutation<
      any,
      { id: string; productImages: string[] }
    >({
      query: ({ id, productImages }) => ({
        url: `/products/${id}/gallery`,
        method: "PATCH",
        data: { productImages },
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ updatedProduct: any }>(response)?.updatedProduct,
      invalidatesTags: (_r, _e, { id }) => [{ type: "Product", id }],
    }),

    updateProductImage: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}/image`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ updatedProductImage: any }>(response)?.updatedProductImage,
      invalidatesTags: (_r, _e, { id }) => [{ type: "Product", id }],
    }),

    removeProduct: build.mutation<unknown, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useLazyGetAllProductsQuery,
  useGetProductQuery,
  useLazyGetProductQuery,
  useUpdateProductMutation,
  useUpdateProductImagesMutation,
  useUpdateProductStatusMutation,
  useKeepProductImagesMutation,
  useUpdateProductImageMutation,
  useRemoveProductMutation,
} = productApi;
