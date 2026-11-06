import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type DietPlansListData = {
  plans?: any[];
  count?: number;
};

type DocumentsListData = {
  documents?: any[];
  count?: number;
  page?: number;
  limit?: number;
  pages?: number;
};

export const dietPlanApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDietPlanStats: build.query<any, void>({
      query: () => ({ url: "/diet-plans/stats", method: "GET" }),
      transformResponse: (response: unknown) => unwrapData(response),
      providesTags: [
        { type: "DietPlan", id: "STATS" },
        { type: "DietPlan", id: "DOCS" },
        { type: "DietPlan", id: "LIST" },
      ],
    }),

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

    getDietPlan: build.query<any, string>({
      query: (id) => ({ url: `/diet-plans/${id}`, method: "GET" }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<{ plan?: any }>(response);
        return data?.plan || data;
      },
      providesTags: (_r, _e, id) => [{ type: "DietPlan", id }],
    }),

    createDietPlan: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/diet-plans/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: [
        { type: "DietPlan", id: "LIST" },
        { type: "DietPlan", id: "STATS" },
      ],
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
        { type: "DietPlan", id: "STATS" },
      ],
    }),

    removeDietPlan: build.mutation<unknown, string>({
      query: (id) => ({ url: `/diet-plans/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "DietPlan", id },
        { type: "DietPlan", id: "LIST" },
        { type: "DietPlan", id: "STATS" },
      ],
    }),

    getDietPlanDocuments: build.query<
      {
        documents: any[];
        count: number;
        page: number;
        limit: number;
        pages: number;
      },
      Record<string, unknown> | void
    >({
      query: (body = {}) => ({
        url: "/diet-plans/documents/get-All",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<DocumentsListData>(response);
        return {
          documents: data?.documents || [],
          count: data?.count ?? 0,
          page: data?.page ?? 1,
          limit: data?.limit ?? 20,
          pages: data?.pages ?? 1,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.documents.map(({ _id, id }: any) => ({
                type: "DietPlan" as const,
                id: `doc-${_id || id}`,
              })),
              { type: "DietPlan", id: "DOCS" },
            ]
          : [{ type: "DietPlan", id: "DOCS" }],
    }),

    getDietPlanDocument: build.query<any, string>({
      query: (id) => ({ url: `/diet-plans/documents/${id}`, method: "GET" }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<{ document?: any }>(response);
        return data?.document || data;
      },
      providesTags: (_r, _e, id) => [{ type: "DietPlan", id: `doc-${id}` }],
    }),

    getDietPlanTemplates: build.query<any, void>({
      query: () => ({ url: "/diet-plans/templates", method: "GET" }),
      transformResponse: (response: unknown) => unwrapData(response),
      providesTags: [{ type: "DietPlan", id: "TEMPLATES" }],
    }),

    getDietPlanTemplate: build.query<any, string>({
      query: (id) => ({ url: `/diet-plans/templates/${id}`, method: "GET" }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<{ template?: any }>(response);
        return data?.template || data;
      },
      providesTags: (_r, _e, id) => [{ type: "DietPlan", id: `tpl-${id}` }],
    }),
  }),
});

export const {
  useGetDietPlanStatsQuery,
  useGetAllDietPlansQuery,
  useLazyGetAllDietPlansQuery,
  useGetDietPlanQuery,
  useCreateDietPlanMutation,
  useUpdateDietPlanMutation,
  useRemoveDietPlanMutation,
  useGetDietPlanDocumentsQuery,
  useLazyGetDietPlanDocumentsQuery,
  useGetDietPlanDocumentQuery,
  useGetDietPlanTemplatesQuery,
  useGetDietPlanTemplateQuery,
} = dietPlanApi;
