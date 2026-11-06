import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type ExercisesListData = {
  exercises?: any[];
  count?: number;
};

export const exerciseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createExercise: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/exercises/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) => unwrapData(response),
      invalidatesTags: [
        { type: "Exercise", id: "LIST" },
        { type: "Exercise", id: "OPTIONS" },
      ],
    }),

    getAllExercises: build.query<
      { exercises: any[]; count: number },
      Record<string, unknown> | void
    >({
      query: (data = { page: 1, page_size: 10 }) => ({
        url: "/exercises/get-All",
        method: "POST",
        data: { ...(data || {}), isDelete: false },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<ExercisesListData>(response);
        return {
          exercises: data?.exercises || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.exercises.map(({ _id }: any) => ({
                type: "Exercise" as const,
                id: _id,
              })),
              { type: "Exercise", id: "LIST" },
            ]
          : [{ type: "Exercise", id: "LIST" }],
    }),

    getExerciseOptions: build.query<
      { exercises: any[] },
      Record<string, unknown> | void
    >({
      query: (data = { status: "active" }) => ({
        url: "/exercises/get-Options",
        method: "POST",
        data: data || { status: "active" },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<ExercisesListData>(response);
        return { exercises: data?.exercises || [] };
      },
      providesTags: [{ type: "Exercise", id: "OPTIONS" }],
    }),

    updateExercise: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/exercises/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ exercise?: any }>(response)?.exercise,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Exercise", id },
        { type: "Exercise", id: "LIST" },
        { type: "Exercise", id: "OPTIONS" },
      ],
    }),

    removeExercise: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/exercises/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Exercise", id },
        { type: "Exercise", id: "LIST" },
        { type: "Exercise", id: "OPTIONS" },
      ],
    }),
  }),
});

export const {
  useCreateExerciseMutation,
  useGetAllExercisesQuery,
  useLazyGetAllExercisesQuery,
  useGetExerciseOptionsQuery,
  useLazyGetExerciseOptionsQuery,
  useUpdateExerciseMutation,
  useRemoveExerciseMutation,
} = exerciseApi;
