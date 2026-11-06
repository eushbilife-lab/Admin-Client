import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type MealPlansListData = {
  plans?: any[];
  count?: number;
};

export const mealPlanApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllMealPlans: build.query<
      { plans: any[]; count: number },
      Record<string, unknown> | void
    >({
      query: (body = {}) => ({
        url: "/meal-plans/get-All",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<MealPlansListData>(response);
        return {
          plans: data?.plans || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.plans.map(({ _id, id }: any) => ({
                type: "MealPlan" as const,
                id: _id || id,
              })),
              { type: "MealPlan", id: "LIST" },
            ]
          : [{ type: "MealPlan", id: "LIST" }],
    }),

    getMealPlan: build.query<any, string>({
      query: (id) => ({ url: `/meal-plans/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ plan: any }>(response)?.plan,
      providesTags: (_r, _e, id) => [{ type: "MealPlan", id }],
    }),

    createMealPlan: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/meal-plans/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: [{ type: "MealPlan", id: "LIST" }],
    }),

    updateMealPlan: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/meal-plans/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "MealPlan", id },
        { type: "MealPlan", id: "LIST" },
      ],
    }),

    removeMealPlan: build.mutation<unknown, string>({
      query: (id) => ({ url: `/meal-plans/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "MealPlan", id },
        { type: "MealPlan", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllMealPlansQuery,
  useLazyGetAllMealPlansQuery,
  useGetMealPlanQuery,
  useLazyGetMealPlanQuery,
  useCreateMealPlanMutation,
  useUpdateMealPlanMutation,
  useRemoveMealPlanMutation,
} = mealPlanApi;
