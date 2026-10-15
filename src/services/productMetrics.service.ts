import http from "./http.service";
import Promisable from "./promisable.service";
import {
  getFunnel,
  getMealsSeries,
  getProductKpis,
  getSignupsSeries,
  getTopFoods,
  type DateRangeKey,
  type MetricPoint,
  type ProductKpis,
} from "mocks/nutritionProduct.mock";

export type { DateRangeKey, MetricPoint, ProductKpis };

export type ProductAnalyticsPayload = {
  kpis: ProductKpis;
  meals: MetricPoint[];
  signups: MetricPoint[];
  funnel: { stage: string; value: number; rate: number; unavailable?: boolean }[];
  topFoods: { name: string; logs: number; kcal: number }[];
  source: "live" | "mock";
  billingAvailable: boolean;
  insight?: string;
};

const silent = { headers: { "X-Skip-Toast": "1" } };

function mockOverview(range: DateRangeKey): ProductAnalyticsPayload {
  return {
    kpis: getProductKpis(range),
    meals: getMealsSeries(range),
    signups: getSignupsSeries(range),
    funnel: getFunnel(),
    topFoods: getTopFoods(),
    source: "mock",
    billingAvailable: true,
  };
}

function normalizeLive(raw: any, range: DateRangeKey): ProductAnalyticsPayload {
  const kpis = raw?.kpis || {};
  return {
    kpis: {
      dau: Number(kpis.dau) || 0,
      mau: Number(kpis.mau) || 0,
      newSignups: Number(kpis.newSignups) || 0,
      mealsLogged: Number(kpis.mealsLogged) || 0,
      premiumConversion: Number(kpis.premiumConversion) || 0,
      mrr: Number(kpis.mrr) || 0,
      churn: Number(kpis.churn) || 0,
      goalCompletion: Number(kpis.goalCompletion) || 0,
      dauDelta: Number(kpis.dauDelta) || 0,
      mauDelta: Number(kpis.mauDelta) || 0,
      mealsDelta: Number(kpis.mealsDelta) || 0,
      mrrDelta: Number(kpis.mrrDelta) || 0,
    },
    meals: Array.isArray(raw?.meals) ? raw.meals : [],
    signups: Array.isArray(raw?.signups) ? raw.signups : [],
    funnel: Array.isArray(raw?.funnel) ? raw.funnel : [],
    topFoods: Array.isArray(raw?.topFoods) ? raw.topFoods : [],
    source: "live",
    billingAvailable: Boolean(raw?.billingAvailable),
    insight: raw?.insight || undefined,
  };
}

/** Prefers live Admin `/dashboard/product-analytics`; falls back to mock if offline. */
const ProductMetricsService = {
  async overview(range: DateRangeKey = "30d"): Promise<ProductAnalyticsPayload> {
    try {
      http.setJWT();
      http.setLanguage();
      const [ok]: any = await Promisable.asPromise(
        http.get(`/dashboard/product-analytics?range=${range}`, silent)
      );
      const analytics = ok?.data?.data?.analytics;
      if (analytics?.kpis) return normalizeLive(analytics, range);
    } catch {
      /* fall through to mock */
    }
    return mockOverview(range);
  },
};

export default ProductMetricsService;
