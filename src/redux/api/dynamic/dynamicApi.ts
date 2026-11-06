import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type GetAllDynamicsArgs = {
  type: unknown;
  page: number;
  page_size: number;
  name?: string;
};

type DynamicListData = {
  dynamic: any[];
  count: number;
};

function trimDynamicPayload(data: Record<string, unknown>) {
  const ar = data.ar as Record<string, unknown> | undefined;
  return {
    ...data,
    ar: {
      ...ar,
      name:
        typeof ar?.name === "string" && ar.name.trim() ? ar.name : "",
    },
  };
}

export const dynamicApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createDynamic: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/dynamics/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ dynamic: any }>(response)?.dynamic,
      invalidatesTags: [
        { type: "Dynamic", id: "LIST" },
        { type: "Dynamic", id: "OPTIONS" },
      ],
    }),

    getAllDynamics: build.query<
      { dynamic: any[]; count: number },
      GetAllDynamicsArgs
    >({
      query: ({ type, page, page_size, name }) => ({
        url: "/dynamics/get-All-Dynamics",
        method: "POST",
        data: {
          type,
          page,
          page_size,
          ...(name ? { name } : {}),
        },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<DynamicListData>(response);
        return {
          dynamic: data?.dynamic || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.dynamic.map(({ _id }: any) => ({
                type: "Dynamic" as const,
                id: _id,
              })),
              { type: "Dynamic", id: "LIST" },
            ]
          : [{ type: "Dynamic", id: "LIST" }],
    }),

    updateDynamic: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/dynamics/${id}`,
        method: "PATCH",
        data: trimDynamicPayload(data),
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ dynamics: any }>(response)?.dynamics,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Dynamic", id },
        { type: "Dynamic", id: "LIST" },
        { type: "Dynamic", id: "OPTIONS" },
      ],
    }),

    getDynamicOptions: build.query<any[], Record<string, unknown>>({
      query: (data) => ({
        url: "/dynamics/get-Options",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ dynamics: any[] }>(response)?.dynamics || [],
      providesTags: [{ type: "Dynamic", id: "OPTIONS" }],
    }),
  }),
});

export const {
  useCreateDynamicMutation,
  useGetAllDynamicsQuery,
  useLazyGetAllDynamicsQuery,
  useUpdateDynamicMutation,
  useGetDynamicOptionsQuery,
  useLazyGetDynamicOptionsQuery,
} = dynamicApi;
