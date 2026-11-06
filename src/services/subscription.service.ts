/**
 * In-app pub/sub helper (not HTTP). REST billing endpoints belong in
 * `redux/api/subscription/subscriptionApi` when Stripe admin APIs land.
 */
let func: () => void = () => {};

const SubscriptionService = {
  call: () => func(),
  unsubscribe: () => (func = () => {}),
  subscribe: (fn: () => void) => (func = fn),
};

export default SubscriptionService;
