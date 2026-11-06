import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type MeasurementScalesListData = {
  UOM?: any[];
  count?: number;
};

export const measurementScaleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createMeasurementScale: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/measurement-scales/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ measurementScale?: any }>(response)?.measurementScale,
      invalidatesTags: [{ type: "MeasurementScale", id: "LIST" }],
    }),

    getAllMeasurementScales: build.query<
      { UOM: any[]; count: number },
      {
        type: unknown;
        page: number;
        page_size: number;
        name?: string;
        status?: string;
      }
    >({
      query: ({ type, page, page_size, name, status }) => ({
        url: "/measurement-scales/get-All-UOM",
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
        const data = unwrapData<MeasurementScalesListData>(response);
        return {
          UOM: data?.UOM || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result, _e, arg) =>
        result
          ? [
              ...result.UOM.map(({ _id }: any) => ({
                type: "MeasurementScale" as const,
                id: _id,
              })),
              { type: "MeasurementScale", id: "LIST" },
              { type: "MeasurementScale", id: `LIST-${String(arg.type)}` },
            ]
          : [
              { type: "MeasurementScale", id: "LIST" },
              { type: "MeasurementScale", id: `LIST-${String(arg.type)}` },
            ],
    }),

    updateMeasurementScale: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => {
        const updatedData = {
          ...data,
          ar: {
            ...(data.ar as Record<string, unknown> | undefined),
            name:
              (data.ar as { name?: string } | undefined)?.name?.trim() ?
                (data.ar as { name?: string }).name
              : "",
          },
        };
        return {
          url: `/measurement-scales/${id}`,
          method: "PATCH",
          data: updatedData,
        };
      },
      transformResponse: (response: unknown) =>
        unwrapData<{ uom?: any }>(response)?.uom,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "MeasurementScale", id },
        { type: "MeasurementScale", id: "LIST" },
        { type: "MeasurementScale", id: "OPTIONS" },
      ],
    }),

    getMeasurementScaleOptions: build.query<
      { uom: any[]; count: number },
      Record<string, unknown>
    >({
      query: (payload) => ({
        url: "/measurement-scales/get-Options",
        method: "POST",
        data: payload,
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<{ uom?: any[]; count?: number }>(response);
        return {
          uom: data?.uom || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: [{ type: "MeasurementScale", id: "OPTIONS" }],
    }),

    removeMeasurementScale: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/measurement-scales/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "MeasurementScale", id },
        { type: "MeasurementScale", id: "LIST" },
        { type: "MeasurementScale", id: "OPTIONS" },
      ],
    }),
  }),
});

export const {
  useCreateMeasurementScaleMutation,
  useGetAllMeasurementScalesQuery,
  useLazyGetAllMeasurementScalesQuery,
  useUpdateMeasurementScaleMutation,
  useGetMeasurementScaleOptionsQuery,
  useLazyGetMeasurementScaleOptionsQuery,
  useRemoveMeasurementScaleMutation,
} = measurementScaleApi;
