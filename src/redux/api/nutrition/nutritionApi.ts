import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

export const nutritionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllNutritions: build.query<any[], void>({
      query: () => ({ url: "/nutrition", method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ Nutritions: any[] }>(response)?.Nutritions || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }: any) => ({
                type: "Nutrition" as const,
                id: _id,
              })),
              { type: "Nutrition", id: "LIST" },
            ]
          : [{ type: "Nutrition", id: "LIST" }],
    }),

    updateNutrition: build.mutation<any[], Record<string, unknown>>({
      query: (data) => ({
        url: "/nutrition",
        method: "PUT",
        data,
      }),
      transformResponse: (response: unknown) => {
        const payload = unwrapData<{
          nutritions?: any[];
          Nutritions?: any[];
        }>(response);
        return payload?.nutritions || payload?.Nutritions || [];
      },
      invalidatesTags: [{ type: "Nutrition", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllNutritionsQuery,
  useLazyGetAllNutritionsQuery,
  useUpdateNutritionMutation,
} = nutritionApi;
