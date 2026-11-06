import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

type ReviewsListData = {
  productReviews: any[];
  totalCount: number;
};

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllReviews: build.query<
      { productReviews: any[]; totalCount: number },
      Record<string, unknown> | void
    >({
      query: (body = { all: "true" }) => ({
        url: "/product-reviews",
        method: "POST",
        data: body || { all: "true" },
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<ReviewsListData>(response);
        return {
          productReviews: data?.productReviews || [],
          totalCount: data?.totalCount ?? 0,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.productReviews.map(({ _id }: any) => ({
                type: "Review" as const,
                id: _id,
              })),
              { type: "Review", id: "LIST" },
            ]
          : [{ type: "Review", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useLazyGetAllReviewsQuery,
} = reviewsApi;
