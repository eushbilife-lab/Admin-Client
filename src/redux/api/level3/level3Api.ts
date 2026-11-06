import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type Level3ListData = {
  subCategories: any[];
  totalCount: number;
};

export const level3Api = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createLevel3: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/sub-categories/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ mainCategory: any }>(response)?.mainCategory,
      invalidatesTags: [
        { type: "Level3", id: "LIST" },
        { type: "Level3", id: "OPTIONS" },
      ],
    }),

    getAllLevel3: build.query<
      { subCategories: any[]; totalCount: number },
      Record<string, unknown> | void
    >({
      query: (body = { all: "true" }) => ({
        url: "/sub-categories",
        method: "POST",
        data: body || { all: "true" },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<Level3ListData>(response);
        return {
          subCategories: data?.subCategories || [],
          totalCount: data?.totalCount ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.subCategories.map(({ _id }: any) => ({
                type: "Level3" as const,
                id: _id,
              })),
              { type: "Level3", id: "LIST" },
            ]
          : [{ type: "Level3", id: "LIST" }],
    }),

    getLevel3Options: build.query<
      any[],
      Record<string, unknown> | void
    >({
      query: (body = { all: "true" }) => ({
        url: "/sub-categories/get-options",
        method: "POST",
        data: body || { all: "true" },
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ subCategories: any[] }>(response)?.subCategories || [],
      providesTags: [{ type: "Level3", id: "OPTIONS" }],
    }),

    getLevel3: build.query<any, string>({
      query: (id) => ({ url: `/sub-categories/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ subCategory: any }>(response)?.subCategory,
      providesTags: (_r, _e, id) => [{ type: "Level3", id }],
    }),

    updateLevel3: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/sub-categories/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ categorie: any }>(response)?.categorie,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Level3", id },
        { type: "Level3", id: "LIST" },
        { type: "Level3", id: "OPTIONS" },
      ],
    }),
  }),
});

export const {
  useCreateLevel3Mutation,
  useGetAllLevel3Query,
  useLazyGetAllLevel3Query,
  useGetLevel3OptionsQuery,
  useLazyGetLevel3OptionsQuery,
  useGetLevel3Query,
  useLazyGetLevel3Query,
  useUpdateLevel3Mutation,
} = level3Api;
