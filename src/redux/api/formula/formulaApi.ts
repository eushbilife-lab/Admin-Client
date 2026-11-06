import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

export const formulaApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getActiveFormula: build.query<any, void>({
      query: () => ({ url: "/formulas", method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ config: any }>(response)?.config,
      providesTags: [{ type: "Formula", id: "ACTIVE" }],
    }),

    getFormulaDefaults: build.query<any, void>({
      query: () => ({ url: "/formulas/defaults", method: "GET" }),
      transformResponse: (response: unknown) => unwrapData(response),
      providesTags: [{ type: "Formula", id: "DEFAULTS" }],
    }),

    getFormulaSection: build.query<any, string>({
      query: (section) => ({
        url: `/formulas/sections/${section}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      providesTags: (_r, _e, section) => [
        { type: "Formula", id: `SECTION_${section}` },
      ],
    }),

    saveFormulaSection: build.mutation<
      any,
      { section: string; data: Record<string, unknown> }
    >({
      query: ({ section, data }) => ({
        url: `/formulas/sections/${section}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ config: any }>(response)?.config,
      invalidatesTags: (_r, _e, { section }) => [
        { type: "Formula", id: "ACTIVE" },
        { type: "Formula", id: `SECTION_${section}` },
      ],
    }),

    replaceFormula: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({ url: "/formulas", method: "PUT", data }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: [{ type: "Formula", id: "ACTIVE" }],
    }),

    resetFormula: build.mutation<any, void>({
      query: () => ({ url: "/formulas/reset", method: "POST" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ config: any }>(response)?.config,
      invalidatesTags: [{ type: "Formula", id: "ACTIVE" }],
    }),
  }),
});

export const {
  useGetActiveFormulaQuery,
  useLazyGetActiveFormulaQuery,
  useGetFormulaDefaultsQuery,
  useLazyGetFormulaDefaultsQuery,
  useGetFormulaSectionQuery,
  useLazyGetFormulaSectionQuery,
  useSaveFormulaSectionMutation,
  useReplaceFormulaMutation,
  useResetFormulaMutation,
} = formulaApi;
