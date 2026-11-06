import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

export const rdaApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRdas: build.query<any[], void>({
      query: () => ({ url: "/rda", method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ Rdas: any[] }>(response)?.Rdas || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }: any) => ({
                type: "Rda" as const,
                id: _id,
              })),
              { type: "Rda", id: "LIST" },
            ]
          : [{ type: "Rda", id: "LIST" }],
    }),

    updateRda: build.mutation<any[], Record<string, unknown>>({
      query: (data) => ({
        url: "/rda",
        method: "PUT",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ rdas: any[] }>(response)?.rdas || [],
      invalidatesTags: [{ type: "Rda", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllRdasQuery,
  useLazyGetAllRdasQuery,
  useUpdateRdaMutation,
} = rdaApi;
