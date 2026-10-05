import Promisable from "./promisable.service";
import http from "./http.service";
import { Dispatch } from "@reduxjs/toolkit";
import { reviewsActions } from "redux/slices/Reviews";

const url = "/product-reviews";

const reviewsService = {
  getAll: async (data: any = { all: "true" }, dispatch: Dispatch) => {
    dispatch?.(reviewsActions.setLoading(true));
    http.setJWT();
    http.setLanguage()
    const [success, error]: any = await Promisable.asPromise(
      http.post(`${url}`, data)
    );
    if (success) {
      const { productReviews, totalCount } = success?.data?.data;
      dispatch?.(
        reviewsActions.setReviews({
          Reviews: productReviews,
          count: totalCount,
        })
      );
    }
    dispatch?.(reviewsActions.setLoading(false));
    return [success, error];
  },
};
export default reviewsService;
