import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type StorePromosListData = {
  promos?: any[];
  count?: number;
};

export const storePromoApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllStorePromos: build.query<
      { promos: any[]; count: number },
      Record<string, unknown> | void
    >({
      query: (body = {}) => ({
        url: "/store-promos/get-All",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<StorePromosListData>(response);
        return {
          promos: data?.promos || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.promos.map(({ _id }: any) => ({
                type: "StorePromo" as const,
                id: _id,
              })),
              { type: "StorePromo", id: "LIST" },
            ]
          : [{ type: "StorePromo", id: "LIST" }],
    }),

    createStorePromo: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/store-promos/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: [{ type: "StorePromo", id: "LIST" }],
    }),

    updateStorePromo: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/store-promos/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "StorePromo", id },
        { type: "StorePromo", id: "LIST" },
      ],
    }),

    removeStorePromo: build.mutation<unknown, string>({
      query: (id) => ({ url: `/store-promos/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "StorePromo", id },
        { type: "StorePromo", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllStorePromosQuery,
  useLazyGetAllStorePromosQuery,
  useCreateStorePromoMutation,
  useUpdateStorePromoMutation,
  useRemoveStorePromoMutation,
} = storePromoApi;
