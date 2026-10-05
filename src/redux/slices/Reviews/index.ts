export { default,reviewsActions,reviewsSlice } from "./reviewsSlice";

export interface ReviewsState {
  count: number;
  Review: any;
  Reviews: any[];
  ReviewOptions: any[];
  filters: any;
  refresh: number;
  loading: boolean;
  current_filters: any;
  refreshLoader: boolean;
}

export interface SetReviewsItemsPayload {
  Reviews: any[];
  count: number;
}
export interface SetReviewsOptionPayload {
  Reviews: any[];
}
