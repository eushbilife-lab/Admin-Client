import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

export const hnssProductCategoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getHnssProductCategoryOptions: build.query<
      { hnssProductCategories: any[] },
      Record<string, unknown> | void
    >({
      query: (data = {}) => ({
        url: "/hnss-product-categories/get-options",
        method: "POST",
        data: data || {},
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<{ HNSSCategories?: any[] }>(response);
        return { hnssProductCategories: data?.HNSSCategories || [] };
      },
      providesTags: [{ type: "HnssProductCategory", id: "OPTIONS" }],
    }),
  }),
});

export const {
  useGetHnssProductCategoryOptionsQuery,
  useLazyGetHnssProductCategoryOptionsQuery,
} = hnssProductCategoryApi;
