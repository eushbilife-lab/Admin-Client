import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type StoreBannersListData = {
  banners?: any[];
  count?: number;
};

export const storeBannerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllStoreBanners: build.query<
      { banners: any[]; count: number },
      Record<string, unknown> | void
    >({
      query: (body = { page: 1, page_size: 50 }) => ({
        url: "/store-banners/get-All",
        method: "POST",
        data: { ...body, isDelete: false },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<StoreBannersListData>(response);
        return {
          banners: data?.banners || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.banners.map(({ _id }: any) => ({
                type: "StoreBanner" as const,
                id: _id,
              })),
              { type: "StoreBanner", id: "LIST" },
            ]
          : [{ type: "StoreBanner", id: "LIST" }],
    }),

    getStoreBanner: build.query<any, string>({
      query: (id) => ({ url: `/store-banners/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ banner: any }>(response)?.banner,
      providesTags: (_r, _e, id) => [{ type: "StoreBanner", id }],
    }),

    createStoreBanner: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/store-banners/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ banner: any }>(response)?.banner,
      invalidatesTags: [{ type: "StoreBanner", id: "LIST" }],
    }),

    updateStoreBanner: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/store-banners/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ banner: any }>(response)?.banner,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "StoreBanner", id },
        { type: "StoreBanner", id: "LIST" },
      ],
    }),

    removeStoreBanner: build.mutation<unknown, string>({
      query: (id) => ({ url: `/store-banners/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "StoreBanner", id },
        { type: "StoreBanner", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllStoreBannersQuery,
  useLazyGetAllStoreBannersQuery,
  useGetStoreBannerQuery,
  useLazyGetStoreBannerQuery,
  useCreateStoreBannerMutation,
  useUpdateStoreBannerMutation,
  useRemoveStoreBannerMutation,
} = storeBannerApi;
