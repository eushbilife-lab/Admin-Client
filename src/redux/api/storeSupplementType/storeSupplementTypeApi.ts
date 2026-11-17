import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type StoreSupplementTypeListData = {
  supplementTypes?: any[];
  count?: number;
};

export const storeSupplementTypeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllStoreSupplementTypes: build.query<
      { supplementTypes: any[]; count: number },
      Record<string, unknown> | void
    >({
      query: (body = {}) => ({
        url: "/store-supplement-types/get-All",
        method: "POST",
        data: { ...body, isDelete: false },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<StoreSupplementTypeListData>(response);
        return {
          supplementTypes: data?.supplementTypes || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.supplementTypes.map(({ _id, id }: any) => ({
                type: "StoreSupplementType" as const,
                id: _id || id,
              })),
              { type: "StoreSupplementType", id: "LIST" },
            ]
          : [{ type: "StoreSupplementType", id: "LIST" }],
    }),

    createStoreSupplementType: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/store-supplement-types/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: [{ type: "StoreSupplementType", id: "LIST" }],
    }),

    updateStoreSupplementType: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/store-supplement-types/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "StoreSupplementType", id },
        { type: "StoreSupplementType", id: "LIST" },
      ],
    }),

    removeStoreSupplementType: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/store-supplement-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "StoreSupplementType", id },
        { type: "StoreSupplementType", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllStoreSupplementTypesQuery,
  useCreateStoreSupplementTypeMutation,
  useUpdateStoreSupplementTypeMutation,
  useRemoveStoreSupplementTypeMutation,
} = storeSupplementTypeApi;
