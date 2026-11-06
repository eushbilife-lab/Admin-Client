import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type StoreCategoriesListData = {
  categories?: any[];
  count?: number;
};

export const storeCategoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllStoreCategories: build.query<
      { categories: any[]; count: number },
      Record<string, unknown> | void
    >({
      query: (body = {}) => ({
        url: "/store-categories/get-All",
        method: "POST",
        data: { ...body, isDelete: false },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<StoreCategoriesListData>(response);
        return {
          categories: data?.categories || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.categories.map(({ _id, id }: any) => ({
                type: "StoreCategory" as const,
                id: _id || id,
              })),
              { type: "StoreCategory", id: "LIST" },
            ]
          : [{ type: "StoreCategory", id: "LIST" }],
    }),

    createStoreCategory: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/store-categories/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: [{ type: "StoreCategory", id: "LIST" }],
    }),

    updateStoreCategory: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/store-categories/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "StoreCategory", id },
        { type: "StoreCategory", id: "LIST" },
      ],
    }),

    removeStoreCategory: build.mutation<unknown, string>({
      query: (id) => ({ url: `/store-categories/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "StoreCategory", id },
        { type: "StoreCategory", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllStoreCategoriesQuery,
  useLazyGetAllStoreCategoriesQuery,
  useCreateStoreCategoryMutation,
  useUpdateStoreCategoryMutation,
  useRemoveStoreCategoryMutation,
} = storeCategoryApi;
