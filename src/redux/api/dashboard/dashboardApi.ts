import { baseApi } from "../baseApi";
import { unwrapData } from "../shared/types";

export type {
  CatalogHit,
  ChartPoint,
  CoverageSlice,
  DashboardOverview,
  NutritionLab,
  QueueItem,
} from "services/dashboard.service";

const skipToast = { headers: { "X-Skip-Toast": "1" } };

type DashboardOverviewData = {
  overview?: Record<string, unknown>;
};

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardOverview: build.query<Record<string, unknown> | null, void>({
      query: () => ({
        url: "/dashboard/overview",
        method: "GET",
        ...skipToast,
      }),
      transformResponse: (response: unknown) => {
        const data = unwrapData<DashboardOverviewData>(response);
        return data?.overview ?? null;
      },
      providesTags: [{ type: "Dashboard", id: "OVERVIEW" }],
    }),

    searchCatalog: build.query<any[], string>({
      query: (term) => {
        const query = term.trim();
        const payload = /^\d{6,}$/.test(query)
          ? { page: 1, page_size: 6, isDelete: false, barcode: query }
          : { page: 1, page_size: 6, isDelete: false, productName: query };
        return {
          url: "/products/query",
          method: "POST",
          data: payload,
          ...skipToast,
        };
      },
      transformResponse: (response: unknown) => {
        const data = unwrapData<{ products?: any[] }>(response);
        return data?.products || [];
      },
    }),

    getProductAnalytics: build.query<any, string>({
      query: (range = "30d") => ({
        url: `/dashboard/product-analytics?range=${range}`,
        method: "GET",
        ...skipToast,
      }),
      transformResponse: (response: unknown) =>
        unwrapData<{ analytics?: any }>(response)?.analytics ?? null,
      providesTags: [{ type: "Dashboard", id: "PRODUCT_ANALYTICS" }],
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useLazyGetDashboardOverviewQuery,
  useSearchCatalogQuery,
  useLazySearchCatalogQuery,
  useGetProductAnalyticsQuery,
  useLazyGetProductAnalyticsQuery,
} = dashboardApi;
