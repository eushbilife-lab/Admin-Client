import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type AllergiesListData = {
  allergies?: any[];
  count?: number;
};

export const allergyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createMajorAllergy: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/allergies/create-major",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ allergyCategory?: any }>(response)?.allergyCategory,
      invalidatesTags: [{ type: "Allergy", id: "LIST" }],
    }),

    createMinorAllergy: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/allergies/create-minor",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ allergySubCategory?: any }>(response)?.allergySubCategory,
      invalidatesTags: [{ type: "Allergy", id: "LIST" }],
    }),

    getAllMajorAllergies: build.query<
      { allergies: any[]; count: number },
      Record<string, unknown>
    >({
      query: (filters) => ({
        url: "/allergies/major-Allergy",
        method: "POST",
        data: {
          page: filters.page,
          page_size: filters.page_size,
          ...(filters.name ? { name: filters.name } : {}),
          ...(filters.status ? { status: filters.status } : {}),
        },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<AllergiesListData>(response);
        return {
          allergies: data?.allergies || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.allergies.map(({ _id }: any) => ({
                type: "Allergy" as const,
                id: _id,
              })),
              { type: "Allergy", id: "LIST" },
            ]
          : [{ type: "Allergy", id: "LIST" }],
    }),

    getAllMinorAllergies: build.query<
      { allergies: any[]; count: number },
      Record<string, unknown>
    >({
      query: (filters) => ({
        url: "/allergies/minor-Allergy",
        method: "POST",
        data: {
          page: filters.page,
          page_size: filters.page_size,
          ...(filters.name ? { name: filters.name } : {}),
          ...(filters.status ? { status: filters.status } : {}),
        },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<AllergiesListData>(response);
        return {
          allergies: data?.allergies || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.allergies.map(({ _id }: any) => ({
                type: "Allergy" as const,
                id: _id,
              })),
              { type: "Allergy", id: "LIST" },
            ]
          : [{ type: "Allergy", id: "LIST" }],
    }),

    updateMajorAllergy: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/allergies/${id}/update-Major`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ allergyCategorys?: any }>(response)?.allergyCategorys,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Allergy", id },
        { type: "Allergy", id: "LIST" },
      ],
    }),

    updateMinorAllergy: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/allergies/${id}/update-Minor`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ allergySubCatrgory?: any }>(response)?.allergySubCatrgory,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Allergy", id },
        { type: "Allergy", id: "LIST" },
      ],
    }),

    getAllergyOptions: build.query<
      { allergies: any[] },
      Record<string, unknown> | void
    >({
      query: (data = { all: "true" }) => ({
        url: "/allergies/get-Options",
        method: "POST",
        data: data || { all: "true" },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<{ allergies?: any[] }>(response);
        return { allergies: data?.allergies || [] };
      },
      providesTags: [{ type: "Allergy", id: "OPTIONS" }],
    }),
  }),
});

export const {
  useCreateMajorAllergyMutation,
  useCreateMinorAllergyMutation,
  useGetAllMajorAllergiesQuery,
  useLazyGetAllMajorAllergiesQuery,
  useGetAllMinorAllergiesQuery,
  useLazyGetAllMinorAllergiesQuery,
  useUpdateMajorAllergyMutation,
  useUpdateMinorAllergyMutation,
  useGetAllergyOptionsQuery,
  useLazyGetAllergyOptionsQuery,
} = allergyApi;
