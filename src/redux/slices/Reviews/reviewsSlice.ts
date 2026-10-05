import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "@core/basic-components/Select";
import {
  ReviewsState,
  SetReviewsItemsPayload,
  SetReviewsOptionPayload,
} from ".";
import { config } from "config";

const default_page_size = config.PAGE_SIZE;

const initialState: ReviewsState = {
  count: 0,
  Reviews: [],
  Review: {},
  loading: false,
  current_filters: {},
  refreshLoader: false,
  ReviewOptions: [],
  refresh: 0,
  filters: { page: 1, page_size: default_page_size },
};

export const reviewsSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clear_search: (state) => {
      state.Reviews = [];
      state.ReviewOptions = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setReview: (state, action) => {
      state.Review = action.payload;
    },
    addReviewItem: (state, action) => {
      state.Reviews.unshift(action.payload);
    },
    setReviews: (
      state,
      action: PayloadAction<SetReviewsItemsPayload>
    ) => {
      const { count, Reviews } = action.payload;
      state.count = count;
      state.refreshLoader = false;
      state.Reviews = Reviews;
    },
    setOptions: (
      state,
      action: PayloadAction<SetReviewsOptionPayload>
    ) => {
      const { Reviews } = action.payload;
      const options: SelectOption[] = Reviews?.map(
        ({ value, label }: any) => ({
          value: value,
          label: label?.En_name || label?.en?.name || label?.name || "",
        })
      );
      state.ReviewOptions = options;
    },
    refresh: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
    },
    resetPage: (state) => {
      state.filters.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.refresh += 1;
      state.refreshLoader = true;
      state.filters.page = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.refreshLoader = true;
    },
    setCurrentFilters: (state, action) => {
      state.current_filters = action.payload;
    },
    resetFilters: (state) => {
      state.refresh += 1;
      state.refreshLoader = true;
      state.filters = initialState.filters;
      state.current_filters = initialState.current_filters;
    },
  },
});

const reviewsReducer = reviewsSlice.reducer;

export const reviewsActions = reviewsSlice.actions;
export default reviewsReducer;
