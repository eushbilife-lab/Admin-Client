import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type HealthPreferencesListData = {
  healthPreference?: any[];
  count?: number;
};

export const healthPreferenceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createHealthPreference: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/health-preferences/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ healthPreference?: any }>(response)?.healthPreference,
      invalidatesTags: [{ type: "HealthPreference", id: "LIST" }],
    }),

    getAllHealthPreferences: build.query<
      { healthPreference: any[]; count: number },
      {
        type: unknown;
        page: number;
        page_size: number;
        name?: string;
        status?: string;
      }
    >({
      query: ({ type, page, page_size, name, status }) => ({
        url: "/health-preferences/get-All-hp",
        method: "POST",
        data: {
          type,
          page,
          page_size,
          isDelete: false,
          ...(name ? { name } : {}),
          ...(status ? { status } : {}),
        },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<HealthPreferencesListData>(response);
        return {
          healthPreference: data?.healthPreference || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result, _e, arg) =>
        result
          ? [
              ...result.healthPreference.map(({ _id }: any) => ({
                type: "HealthPreference" as const,
                id: _id,
              })),
              { type: "HealthPreference", id: "LIST" },
              { type: "HealthPreference", id: `LIST-${String(arg.type)}` },
            ]
          : [
              { type: "HealthPreference", id: "LIST" },
              { type: "HealthPreference", id: `LIST-${String(arg.type)}` },
            ],
    }),

    updateHealthPreference: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/health-preferences/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ healthPreference?: any }>(response)?.healthPreference,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "HealthPreference", id },
        { type: "HealthPreference", id: "LIST" },
        { type: "HealthPreference", id: "OPTIONS" },
      ],
    }),

    getHealthPreferenceOptions: build.query<
      { healthPreferences: any[] },
      Record<string, unknown>
    >({
      query: (data) => ({
        url: "/health-preferences/get-Options",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) => {
        const nested = unwrapData<{ healthPreferences?: any }>(response)
          ?.healthPreferences;
        const healthPreference = Array.isArray(nested)
          ? nested
          : nested?.healthPreference || [];
        return { healthPreferences: healthPreference };
      },
      providesTags: [{ type: "HealthPreference", id: "OPTIONS" }],
    }),

    removeHealthPreference: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/health-preferences/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "HealthPreference", id },
        { type: "HealthPreference", id: "LIST" },
        { type: "HealthPreference", id: "OPTIONS" },
      ],
    }),
  }),
});

export const {
  useCreateHealthPreferenceMutation,
  useGetAllHealthPreferencesQuery,
  useLazyGetAllHealthPreferencesQuery,
  useUpdateHealthPreferenceMutation,
  useGetHealthPreferenceOptionsQuery,
  useLazyGetHealthPreferenceOptionsQuery,
  useRemoveHealthPreferenceMutation,
} = healthPreferenceApi;
