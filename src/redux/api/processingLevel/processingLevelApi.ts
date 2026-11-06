import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type ProcessingLevelsListData = {
  processingLevels?: any[];
  count?: number;
};

export type ProcessingLevelOption = {
  value: number;
  label: string;
  levelValue: number;
  _id: string;
  description: string;
};

export const processingLevelApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllProcessingLevels: build.query<
      { processingLevels: any[]; count: number },
      Record<string, unknown> | void
    >({
      query: (filters = {}) => ({
        url: "/processing-levels/get-All",
        method: "POST",
        data: {
          page: filters?.page || 1,
          page_size: filters?.page_size || 20,
          ...(filters?.name ? { name: filters.name } : {}),
          ...(filters?.status ? { status: filters.status } : {}),
        },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<ProcessingLevelsListData>(response);
        return {
          processingLevels: data?.processingLevels || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.processingLevels.map(({ _id }: any) => ({
                type: "ProcessingLevel" as const,
                id: _id,
              })),
              { type: "ProcessingLevel", id: "LIST" },
            ]
          : [{ type: "ProcessingLevel", id: "LIST" }],
    }),

    getProcessingLevelOptions: build.query<
      { options: ProcessingLevelOption[] },
      void
    >({
      query: () => ({
        url: "/processing-levels/get-Options",
        method: "POST",
        data: { status: "active" },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<{ processingLevels?: any[] }>(response);
        const processingLevels = data?.processingLevels || [];
        const options = processingLevels.map((row: any) => ({
          value: Number(row.value ?? row.levelValue),
          label: row.label || row.name || "",
          levelValue: Number(row.value ?? row.levelValue),
          _id: row._id,
          description: row.description || "",
        }));
        return { options };
      },
      providesTags: [{ type: "ProcessingLevel", id: "OPTIONS" }],
    }),

    createProcessingLevel: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/processing-levels/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: [
        { type: "ProcessingLevel", id: "LIST" },
        { type: "ProcessingLevel", id: "OPTIONS" },
      ],
    }),

    updateProcessingLevel: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/processing-levels/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ProcessingLevel", id },
        { type: "ProcessingLevel", id: "LIST" },
        { type: "ProcessingLevel", id: "OPTIONS" },
      ],
    }),

    removeProcessingLevel: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/processing-levels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "ProcessingLevel", id },
        { type: "ProcessingLevel", id: "LIST" },
        { type: "ProcessingLevel", id: "OPTIONS" },
      ],
    }),
  }),
});

export const {
  useGetAllProcessingLevelsQuery,
  useLazyGetAllProcessingLevelsQuery,
  useGetProcessingLevelOptionsQuery,
  useLazyGetProcessingLevelOptionsQuery,
  useCreateProcessingLevelMutation,
  useUpdateProcessingLevelMutation,
  useRemoveProcessingLevelMutation,
} = processingLevelApi;
