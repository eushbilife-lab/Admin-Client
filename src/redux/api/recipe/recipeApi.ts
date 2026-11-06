import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type RecipesListData = {
  recipes?: any[];
  count?: number;
};

export const recipeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRecipes: build.query<
      { recipes: any[]; count: number },
      Record<string, unknown> | void
    >({
      query: (data = { page: 1, page_size: 50 }) => ({
        url: "/recipes/get-All",
        method: "POST",
        data: { ...(data || {}), isDelete: false },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<RecipesListData>(response);
        return {
          recipes: data?.recipes || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.recipes.map(({ _id }: any) => ({
                type: "Recipe" as const,
                id: _id,
              })),
              { type: "Recipe", id: "LIST" },
            ]
          : [{ type: "Recipe", id: "LIST" }],
    }),

    getRecipe: build.query<any, string>({
      query: (id) => ({ url: `/recipes/${id}`, method: "GET" }),
      transformResponse: (response: unknown) =>
        unwrapData<{ recipe?: any }>(response)?.recipe,
      providesTags: (_r, _e, id) => [{ type: "Recipe", id }],
    }),

    createRecipe: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/recipes/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ recipe?: any }>(response)?.recipe,
      invalidatesTags: [{ type: "Recipe", id: "LIST" }],
    }),

    updateRecipe: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/recipes/${id}`,
        method: "PATCH",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ recipe?: any }>(response)?.recipe,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Recipe", id },
        { type: "Recipe", id: "LIST" },
      ],
    }),

    removeRecipe: build.mutation<unknown, string>({
      query: (id) => ({
        url: `/recipes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Recipe", id },
        { type: "Recipe", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllRecipesQuery,
  useLazyGetAllRecipesQuery,
  useGetRecipeQuery,
  useLazyGetRecipeQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useRemoveRecipeMutation,
} = recipeApi;
