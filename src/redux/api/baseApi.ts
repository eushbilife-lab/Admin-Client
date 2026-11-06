import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import http from "services/http.service";

type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: unknown;
  params?: unknown;
  headers?: AxiosRequestConfig["headers"];
  timeout?: number;
};

type AxiosBaseQueryError = {
  status?: number;
  data?: unknown;
};

const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method = "GET", data, params, headers, timeout }, api) => {
    try {
      const result = await http({
        url,
        method,
        data,
        params,
        headers,
        timeout,
        signal: api.signal,
      });
      return { data: result.data };
    } catch (error) {
      const err = error as AxiosError;
      if (err.code === "ERR_CANCELED" || api.signal.aborted) {
        throw error;
      }
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };

/** Shared RTK Query API — feature modules inject endpoints here. */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  refetchOnMountOrArgChange: 60,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  keepUnusedDataFor: 300,
  tagTypes: [
    "Auth",
    "User",
    "Role",
    "Notification",
    "Product",
    "DraftProduct",
    "Image",
    "Review",
    "Score",
    "Level1",
    "Level2",
    "Level3",
    "Level4",
    "Rda",
    "Ingredient",
    "Nutrition",
    "Dynamic",
    "Allergy",
    "HealthPreference",
    "FoodIntolerance",
    "MeasurementScale",
    "ProcessingLevel",
    "HnssProductCategory",
    "Exercise",
    "Recipe",
    "StoreProduct",
    "StoreBanner",
    "StoreOrder",
    "StoreCategory",
    "StorePromo",
    "StorePayment",
    "Contact",
    "DietPlan",
    "MealPlan",
    "Formula",
    "Legal",
    "Nutritionist",
    "Subscription",
    "Dashboard",
  ],
  endpoints: () => ({}),
});
