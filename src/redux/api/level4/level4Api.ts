import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type Level4ListData = {
  nestedCategories: any[];
  totalCount: number;
};

export const level4Api = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createLevel4: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/nest-categories/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ nestCategory: any }>(response)?.nestCategory,
      invalidatesTags: [
        { type: "Level4", id: "LIST" },
        { type: "Level4", id: "OPTIONS" },
      ],
    }),

    getAllLevel4: build.query<
      { nestedCategories: any[]; totalCount: number },
      Record<string, unknown> | void
    >({
      query: (body = { all: "true" }) => ({
        url: "/nest-categories",
        method: "POST",
        data: body || { all: "true" },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<Level4ListData>(response);
        return {
          nestedCategories: data?.nestedCategories || [],
          totalCount: data?.totalCount ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.nestedCategories.map(({ _id }: any) => ({
                type: "Level4" as const,
                id: _id,
              })),
              { type: "Level4", id: "LIST" },
            ]
          : [{ type: "Level4", id: "LIST" }],
    }),

    getLevel4Options: build.query<
      any[],
      Record<string, unknown> | void
    >({
      query: (body = { all: "true" }) => ({
        url: "/nest-categories/get-options",
        method: "POST",
        data: body || { all: "true" },
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ nestCategories: any[] }>(response)?.nestCategories || [],
      providesTags: [{ type: "Level4", id: "OPTIONS" }],
    }),

    getLevel4: build.query<any, string>({
      query: (id) => ({ url: `/nest-categories/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ nestSubCategory: any }>(response)?.nestSubCategory,
      providesTags: (_r, _e, id) => [{ type: "Level4", id }],
    }),

    updateLevel4: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/nest-categories/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ nestSubCategory: any }>(response)?.nestSubCategory,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Level4", id },
        { type: "Level4", id: "LIST" },
        { type: "Level4", id: "OPTIONS" },
      ],
    }),
  }),
});

export const {
  useCreateLevel4Mutation,
  useGetAllLevel4Query,
  useLazyGetAllLevel4Query,
  useGetLevel4OptionsQuery,
  useLazyGetLevel4OptionsQuery,
  useGetLevel4Query,
  useLazyGetLevel4Query,
  useUpdateLevel4Mutation,
} = level4Api;
