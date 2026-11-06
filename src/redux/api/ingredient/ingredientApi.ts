import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type IngredientListData = {
  ingredients: any[];
  count: number;
};

function trimIngredientPayload(data: Record<string, unknown>) {
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

export const ingredientApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createIngredient: build.mutation<any, Record<string, unknown>>({
      query: (data) => ({
        url: "/ingredients/create",
        method: "POST",
        data,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ ingredient: any }>(response)?.ingredient,
      invalidatesTags: [
        { type: "Ingredient", id: "LIST" },
        { type: "Ingredient", id: "OPTIONS" },
      ],
    }),

    getAllIngredients: build.query<
      { ingredients: any[]; count: number },
      Record<string, unknown> | void
    >({
      query: (body = { all: "true" }) => ({
        url: "/ingredients/get-All-Ingredients",
        method: "POST",
        data: body || { all: "true" },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<IngredientListData>(response);
        return {
          ingredients: data?.ingredients || [],
          count: data?.count ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.ingredients.map(({ _id }: any) => ({
                type: "Ingredient" as const,
                id: _id,
              })),
              { type: "Ingredient", id: "LIST" },
            ]
          : [{ type: "Ingredient", id: "LIST" }],
    }),

    getIngredientOptions: build.query<
      any[],
      Record<string, unknown> | void
    >({
      query: (body = { all: "true" }) => ({
        url: "/ingredients/get-Options",
        method: "POST",
        data: body || { all: "true" },
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ ingredients: any[] }>(response)?.ingredients || [],
      providesTags: [{ type: "Ingredient", id: "OPTIONS" }],
    }),

    updateIngredient: build.mutation<
      any,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/ingredients/${id}`,
        method: "PATCH",
        data: trimIngredientPayload(data),
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ ingredient: any }>(response)?.ingredient,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Ingredient", id },
        { type: "Ingredient", id: "LIST" },
        { type: "Ingredient", id: "OPTIONS" },
      ],
    }),

    getIngredientsByName: build.query<
      any[],
      Record<string, unknown> | void
    >({
      query: (body = { all: "true" }) => ({
        url: "/ingredients/get-By-Name",
        method: "POST",
        data: body || { all: "true" },
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ ingredients: any[] }>(response)?.ingredients || [],
      providesTags: [{ type: "Ingredient", id: "OPTIONS" }],
    }),
  }),
});

export const {
  useCreateIngredientMutation,
  useGetAllIngredientsQuery,
  useLazyGetAllIngredientsQuery,
  useGetIngredientOptionsQuery,
  useLazyGetIngredientOptionsQuery,
  useUpdateIngredientMutation,
  useGetIngredientsByNameQuery,
  useLazyGetIngredientsByNameQuery,
} = ingredientApi;
