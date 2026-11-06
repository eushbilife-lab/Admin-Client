import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type Level2ListData = {
  categories: any[];
  totalCount: number;
};

export const level2Api = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createLevel2: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/categories/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ category: any }>(response)?.category,
      invalidatesTags: [
        { type: "Level2", id: "LIST" },
        { type: "Level2", id: "OPTIONS" },
      ],
    }),

    getAllLevel2: build.query<
      { categories: any[]; totalCount: number },
      Record<string, unknown> | void
    >({
      query: (body = { all: "true" }) => ({
        url: "/categories",
        method: "POST",
        data: body || { all: "true" },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<Level2ListData>(response);
        return {
          categories: data?.categories || [],
          totalCount: data?.totalCount ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.categories.map(({ _id }: any) => ({
                type: "Level2" as const,
                id: _id,
              })),
              { type: "Level2", id: "LIST" },
            ]
          : [{ type: "Level2", id: "LIST" }],
    }),

    getLevel2Options: build.query<any[], Record<string, unknown>>({
      query: (data) => ({
        url: "/categories/get-options",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ categories: any[] }>(response)?.categories || [],
      providesTags: [{ type: "Level2", id: "OPTIONS" }],
    }),

    getLevel2: build.query<any, string>({
      query: (id) => ({ url: `/categories/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ categorie: any }>(response)?.categorie,
      providesTags: (_r, _e, id) => [{ type: "Level2", id }],
    }),

    updateLevel2: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ categorie: any }>(response)?.categorie,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Level2", id },
        { type: "Level2", id: "LIST" },
        { type: "Level2", id: "OPTIONS" },
      ],
    }),
  }),
});

export const {
  useCreateLevel2Mutation,
  useGetAllLevel2Query,
  useLazyGetAllLevel2Query,
  useGetLevel2OptionsQuery,
  useLazyGetLevel2OptionsQuery,
  useGetLevel2Query,
  useLazyGetLevel2Query,
  useUpdateLevel2Mutation,
} = level2Api;
