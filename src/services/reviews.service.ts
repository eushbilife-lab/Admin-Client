import type { AppDispatch } from "redux/store";
import { reviewsApi } from "redux/api/reviews/reviewsApi";
import { reviewsActions } from "redux/slices/Reviews";
import { resolveDispatch } from "redux/api/runEndpoint";

function dispatchOr(d?: AppDispatch) {
  return resolveDispatch(d);
}

const reviewsService = {
  getAll: async (data: any = { all: "true" }, dispatch: AppDispatch) => {
    const d = dispatchOr(dispatch);
    if (!d) return [null, new Error("Store not ready")];
    d(reviewsActions.setLoading(true));
    try {
      const result = await d(
        reviewsApi.endpoints.getAllReviews.initiate(data || { all: "true" }, {
          forceRefetch: true,
        })
      ).unwrap();
      d(
        reviewsActions.setReviews({
          Reviews: result.productReviews,
          count: result.totalCount,
        })
      );
      return [{ data: { data: result } }, null];
    } catch (error) {
      return [null, error];
    } finally {
      d(reviewsActions.setLoading(false));
    }
  },
};

export default reviewsService;
