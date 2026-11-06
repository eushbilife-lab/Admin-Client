import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type ScoresListData = {
  requiredHNSS: any[];
  totalCount: number;
};

export const scoreApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createScore: build.mutation<unknown, Record<string, unknown>>({
      query: (data) => ({
        url: "/scores/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: [{ type: "Score", id: "LIST" }],
    }),

    getAllScores: build.query<
      { requiredHNSS: any[]; totalCount: number },
      Record<string, unknown>
    >({
      query: (body) => ({ url: "/scores", method: "POST", data: body }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<ScoresListData>(response);
        return {
          requiredHNSS: data?.requiredHNSS || [],
          totalCount: data?.totalCount ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.requiredHNSS.map(({ _id }: any) => ({
                type: "Score" as const,
                id: _id,
              })),
              { type: "Score", id: "LIST" },
            ]
          : [{ type: "Score", id: "LIST" }],
    }),

    getScore: build.query<any, string>({
      query: (id) => ({ url: `/scores/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ scoreData: any }>(response)?.scoreData,
      providesTags: (_r, _e, id) => [{ type: "Score", id }],
    }),

    updateScore: build.mutation<
      unknown,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/scores/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Score", id },
        { type: "Score", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateScoreMutation,
  useGetAllScoresQuery,
  useLazyGetAllScoresQuery,
  useGetScoreQuery,
  useLazyGetScoreQuery,
  useUpdateScoreMutation,
} = scoreApi;
