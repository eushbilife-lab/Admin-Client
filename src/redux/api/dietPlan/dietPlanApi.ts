import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type DietPlansListData = {
  plans?: any[];
  count?: number;
};

export const dietPlanApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllDietPlans: build.query<
      { plans: any[]; count: number },
      Record<string, unknown> | void
    >({
      query: (body = {}) => ({
        url: "/diet-plans/get-All",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<DietPlansListData>(response);
        return {
          plans: data?.plans || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.plans.map(({ _id, id }: any) => ({
                type: "DietPlan" as const,
                id: _id || id,
              })),
              { type: "DietPlan", id: "LIST" },
            ]
          : [{ type: "DietPlan", id: "LIST" }],
    }),

    createDietPlan: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/diet-plans/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: [{ type: "DietPlan", id: "LIST" }],
    }),

    updateDietPlan: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/diet-plans/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "DietPlan", id },
        { type: "DietPlan", id: "LIST" },
      ],
    }),

    removeDietPlan: build.mutation<unknown, string>({
      query: (id) => ({ url: `/diet-plans/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "DietPlan", id },
        { type: "DietPlan", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllDietPlansQuery,
  useLazyGetAllDietPlansQuery,
  useCreateDietPlanMutation,
  useUpdateDietPlanMutation,
  useRemoveDietPlanMutation,
} = dietPlanApi;
