import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type LegalListData = {
  pages?: any[];
  keys?: string[];
  count?: number;
};

export const legalApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllLegalPages: build.query<
      { pages: any[]; keys: string[]; count: number },
      Record<string, unknown> | void
    >({
      query: (body = {}) => ({
        url: "/legal/get-All",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<LegalListData>(response);
        return {
          pages: data?.pages || [],
          keys: data?.keys || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.pages.map(({ _id, key }: any) => ({
                type: "Legal" as const,
                id: _id || key,
              })),
              { type: "Legal", id: "LIST" },
            ]
          : [{ type: "Legal", id: "LIST" }],
    }),

    upsertLegalPage: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/legal/upsert",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: [{ type: "Legal", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllLegalPagesQuery,
  useLazyGetAllLegalPagesQuery,
  useUpsertLegalPageMutation,
} = legalApi;
