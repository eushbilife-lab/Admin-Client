import { baseApi } from "../baseApi";

/**
 * `subscription.service.ts` is an in-app pub/sub helper (subscribe / unsubscribe / call),
 * not an HTTP client. No REST endpoints to inject until Stripe admin APIs land.
 */
export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: () => ({}),
});
