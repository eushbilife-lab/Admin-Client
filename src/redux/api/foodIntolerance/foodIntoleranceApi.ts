import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type FoodIntolerancesListData = {
  intolerances?: any[];
  count?: number;
};

export const foodIntoleranceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createMajorFoodIntolerance: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/food-intolerances/create-major",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ majorIntolerance?: any }>(response)?.majorIntolerance,
      invalidatesTags: [{ type: "FoodIntolerance", id: "LIST" }],
    }),

    createMinorFoodIntolerance: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/food-intolerances/create-minor",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ minorIntolerance?: any }>(response)?.minorIntolerance,
      invalidatesTags: [{ type: "FoodIntolerance", id: "LIST" }],
    }),

    getAllMajorFoodIntolerances: build.query<
      { foodIntolerances: any[]; count: number },
      Record<string, unknown>
    >({
      query: (filters) => ({
        url: "/food-intolerances/major-FoodIntolerance",
        method: "POST",
        data: {
          page: filters.page,
          page_size: filters.page_size,
          ...(filters.name ? { name: filters.name } : {}),
          ...(filters.status ? { status: filters.status } : {}),
        },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<FoodIntolerancesListData>(response);
        return {
          foodIntolerances: data?.intolerances || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.foodIntolerances.map(({ _id }: any) => ({
                type: "FoodIntolerance" as const,
                id: _id,
              })),
              { type: "FoodIntolerance", id: "LIST" },
            ]
          : [{ type: "FoodIntolerance", id: "LIST" }],
    }),

    getAllMinorFoodIntolerances: build.query<
      { foodIntolerances: any[]; count: number },
      Record<string, unknown>
    >({
      query: (filters) => ({
        url: "/food-intolerances/minor-FoodIntolerance",
        method: "POST",
        data: {
          page: filters.page,
          page_size: filters.page_size,
          ...(filters.name ? { name: filters.name } : {}),
          ...(filters.status ? { status: filters.status } : {}),
        },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<FoodIntolerancesListData>(response);
        return {
          foodIntolerances: data?.intolerances || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.foodIntolerances.map(({ _id }: any) => ({
                type: "FoodIntolerance" as const,
                id: _id,
              })),
              { type: "FoodIntolerance", id: "LIST" },
            ]
          : [{ type: "FoodIntolerance", id: "LIST" }],
    }),

    updateMajorFoodIntolerance: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/food-intolerances/update-Major/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ updated?: any }>(response)?.updated,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "FoodIntolerance", id },
        { type: "FoodIntolerance", id: "LIST" },
      ],
    }),

    updateMinorFoodIntolerance: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/food-intolerances/update-Minor/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ updated?: any }>(response)?.updated,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "FoodIntolerance", id },
        { type: "FoodIntolerance", id: "LIST" },
      ],
    }),

    getFoodIntoleranceOptions: build.query<
      { foodIntolerances: any[] },
      Record<string, unknown> | void
    >({
      query: (data = {}) => ({
        url: "/food-intolerances/get-Options",
        method: "POST",
        data: data || {},
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<{ options?: any[] }>(response);
        return { foodIntolerances: data?.options || [] };
      },
      providesTags: [{ type: "FoodIntolerance", id: "OPTIONS" }],
    }),
  }),
});

export const {
  useCreateMajorFoodIntoleranceMutation,
  useCreateMinorFoodIntoleranceMutation,
  useGetAllMajorFoodIntolerancesQuery,
  useLazyGetAllMajorFoodIntolerancesQuery,
  useGetAllMinorFoodIntolerancesQuery,
  useLazyGetAllMinorFoodIntolerancesQuery,
  useUpdateMajorFoodIntoleranceMutation,
  useUpdateMinorFoodIntoleranceMutation,
  useGetFoodIntoleranceOptionsQuery,
  useLazyGetFoodIntoleranceOptionsQuery,
} = foodIntoleranceApi;
