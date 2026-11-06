import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type NutritionistRequestsListData = {
  requests?: any[];
  count?: number;
};

export const nutritionistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllNutritionistRequests: build.query<
      { requests: any[]; count: number },
      Record<string, unknown> | void
    >({
      query: (body = {}) => ({
        url: "/nutritionist-requests/get-All",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<NutritionistRequestsListData>(response);
        return {
          requests: data?.requests || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.requests.map(({ _id, id }: any) => ({
                type: "Nutritionist" as const,
                id: _id || id,
              })),
              { type: "Nutritionist", id: "LIST" },
            ]
          : [{ type: "Nutritionist", id: "LIST" }],
    }),

    updateNutritionistRequest: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/nutritionist-requests/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Nutritionist", id },
        { type: "Nutritionist", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllNutritionistRequestsQuery,
  useLazyGetAllNutritionistRequestsQuery,
  useUpdateNutritionistRequestMutation,
} = nutritionistApi;
