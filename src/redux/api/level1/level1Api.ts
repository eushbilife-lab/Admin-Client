import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type Level1ListData = {
  mainCategories: any[];
  totalCount: number;
};

export const level1Api = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createLevel1: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/main-categories/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ mainCategory: any }>(response)?.mainCategory,
      invalidatesTags: [
        { type: "Level1", id: "LIST" },
        { type: "Level1", id: "OPTIONS" },
      ],
    }),

    getAllLevel1: build.query<
      { mainCategories: any[]; totalCount: number },
      Record<string, unknown> | void
    >({
      query: (body = { all: "true" }) => ({
        url: "/main-categories",
        method: "POST",
        data: body || { all: "true" },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<Level1ListData>(response);
        return {
          mainCategories: data?.mainCategories || [],
          totalCount: data?.totalCount ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.mainCategories.map(({ _id }: any) => ({
                type: "Level1" as const,
                id: _id,
              })),
              { type: "Level1", id: "LIST" },
            ]
          : [{ type: "Level1", id: "LIST" }],
    }),

    getLevel1Options: build.query<any[], Record<string, unknown>>({
      query: (data) => ({
        url: "/main-categories/get-options",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ mainCategories: any[] }>(response)?.mainCategories || [],
      providesTags: [{ type: "Level1", id: "OPTIONS" }],
    }),

    getLevel1: build.query<any, string>({
      query: (id) => ({ url: `/main-categories/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ mainCategory: any }>(response)?.mainCategory,
      providesTags: (_r, _e, id) => [{ type: "Level1", id }],
    }),

    updateLevel1: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/main-categories/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ mainCategory: any }>(response)?.mainCategory,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Level1", id },
        { type: "Level1", id: "LIST" },
        { type: "Level1", id: "OPTIONS" },
      ],
    }),
  }),
});

export const {
  useCreateLevel1Mutation,
  useGetAllLevel1Query,
  useLazyGetAllLevel1Query,
  useGetLevel1OptionsQuery,
  useLazyGetLevel1OptionsQuery,
  useGetLevel1Query,
  useLazyGetLevel1Query,
  useUpdateLevel1Mutation,
} = level1Api;
