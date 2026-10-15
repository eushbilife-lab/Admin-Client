/** Realistic mock data for product modules not yet backed by Admin API.
 * Swap service implementations to real endpoints without changing page props.
 */

export type DateRangeKey = "7d" | "30d" | "90d";

export type MetricPoint = { date: string; value: number; prev?: number };

export type ProductKpis = {
  dau: number;
  mau: number;
  newSignups: number;
  mealsLogged: number;
  premiumConversion: number;
  mrr: number;
  churn: number;
  goalCompletion: number;
  dauDelta: number;
  mauDelta: number;
  mealsDelta: number;
  mrrDelta: number;
};

export type Recipe = {
  id: string;
  name: string;
  status: "draft" | "published" | "scheduled";
  tags: string[];
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  cookMins: number;
  updatedAt: string;
};

export type MealPlan = {
  id: string;
  title: string;
  goal: "weight_loss" | "muscle_gain" | "maintenance";
  weeks: number;
  status: "draft" | "published" | "scheduled";
  recipes: number;
  subscribers: number;
  updatedAt: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  active: number;
  mrr: number;
  features: string[];
};

export type Dietitian = {
  id: string;
  name: string;
  email: string;
  credentials: string;
  verified: boolean;
  clients: number;
  rating: number;
  status: "active" | "pending" | "suspended";
};

export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
};

export type FeatureFlag = {
  key: string;
  label: string;
  enabled: boolean;
  description: string;
};

function seedSeries(days: number, base: number, wobble: number): MetricPoint[] {
  const out: MetricPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const wave = Math.sin(i / 3) * wobble + (Math.random() - 0.5) * wobble * 0.4;
    const value = Math.max(0, Math.round(base + wave + (days - i) * 0.35));
    const prev = Math.max(0, Math.round(value * (0.88 + Math.random() * 0.1)));
    out.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value,
      prev,
    });
  }
  return out;
}

const RANGE_DAYS: Record<DateRangeKey, number> = { "7d": 7, "30d": 30, "90d": 90 };

export function getProductKpis(range: DateRangeKey = "30d"): ProductKpis {
  const scale = range === "7d" ? 0.35 : range === "90d" ? 1.4 : 1;
  return {
    dau: Math.round(1840 * scale),
    mau: 12640,
    newSignups: Math.round(420 * scale),
    mealsLogged: Math.round(28400 * scale),
    premiumConversion: 6.8,
    mrr: 18420,
    churn: 2.4,
    goalCompletion: 41,
    dauDelta: 8.2,
    mauDelta: 4.1,
    mealsDelta: 11.5,
    mrrDelta: 3.6,
  };
}

export function getMealsSeries(range: DateRangeKey = "30d") {
  return seedSeries(RANGE_DAYS[range], 820, 90);
}

export function getSignupsSeries(range: DateRangeKey = "30d") {
  return seedSeries(RANGE_DAYS[range], 14, 6);
}

export function getFunnel() {
  return [
    { stage: "Signup", value: 10000, rate: 100 },
    { stage: "First meal log", value: 7200, rate: 72 },
    { stage: "Day-7 retained", value: 4100, rate: 41 },
    { stage: "Premium", value: 680, rate: 6.8 },
  ];
}

export function getTopFoods() {
  return [
    { name: "Chicken breast, grilled", logs: 4820, kcal: 165 },
    { name: "Oats, dry", logs: 3910, kcal: 389 },
    { name: "Greek yogurt 2%", logs: 3550, kcal: 97 },
    { name: "Banana, medium", logs: 3280, kcal: 105 },
    { name: "Brown rice, cooked", logs: 2910, kcal: 112 },
    { name: "Egg, whole", logs: 2740, kcal: 72 },
    { name: "Almonds", logs: 2210, kcal: 579 },
    { name: "Salmon, Atlantic", logs: 1980, kcal: 208 },
  ];
}

export const MOCK_RECIPES: Recipe[] = [
  {
    id: "r1",
    name: "Lemon herb chicken bowl",
    status: "published",
    tags: ["high-protein", "gluten-free"],
    servings: 2,
    calories: 420,
    protein: 48,
    carbs: 28,
    fat: 12,
    cookMins: 25,
    updatedAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "r2",
    name: "Keto avocado salad",
    status: "published",
    tags: ["keto", "vegan"],
    servings: 1,
    calories: 310,
    protein: 8,
    carbs: 12,
    fat: 28,
    cookMins: 10,
    updatedAt: "2026-10-10T14:20:00Z",
  },
  {
    id: "r3",
    name: "Halal beef & quinoa",
    status: "draft",
    tags: ["halal", "high-protein"],
    servings: 4,
    calories: 480,
    protein: 36,
    carbs: 42,
    fat: 16,
    cookMins: 40,
    updatedAt: "2026-10-14T08:10:00Z",
  },
  {
    id: "r4",
    name: "Overnight oats with berries",
    status: "scheduled",
    tags: ["vegetarian", "meal-prep"],
    servings: 1,
    calories: 340,
    protein: 14,
    carbs: 52,
    fat: 9,
    cookMins: 5,
    updatedAt: "2026-10-13T19:00:00Z",
  },
];

export const MOCK_MEAL_PLANS: MealPlan[] = [
  {
    id: "mp1",
    title: "12-week fat loss",
    goal: "weight_loss",
    weeks: 12,
    status: "published",
    recipes: 84,
    subscribers: 1260,
    updatedAt: "2026-10-11T09:00:00Z",
  },
  {
    id: "mp2",
    title: "Lean bulk starter",
    goal: "muscle_gain",
    weeks: 8,
    status: "published",
    recipes: 56,
    subscribers: 840,
    updatedAt: "2026-10-08T16:30:00Z",
  },
  {
    id: "mp3",
    title: "Maintenance reset",
    goal: "maintenance",
    weeks: 4,
    status: "draft",
    recipes: 28,
    subscribers: 0,
    updatedAt: "2026-10-14T11:00:00Z",
  },
];

export const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    active: 9840,
    mrr: 0,
    features: ["Food log", "Barcode scan", "Basic goals"],
  },
  {
    id: "plus",
    name: "Plus",
    price: 9.99,
    interval: "month",
    active: 1420,
    mrr: 14185,
    features: ["Meal plans", "Micronutrient goals", "Ad-free"],
  },
  {
    id: "pro",
    name: "Pro + Dietitian",
    price: 29.99,
    interval: "month",
    active: 142,
    mrr: 4258,
    features: ["1:1 dietitian", "Custom plans", "Priority support"],
  },
];

export const MOCK_DIETITIANS: Dietitian[] = [
  {
    id: "d1",
    name: "Ayesha Khan, RD",
    email: "ayesha@eushbi.com",
    credentials: "RD · CNS",
    verified: true,
    clients: 28,
    rating: 4.9,
    status: "active",
  },
  {
    id: "d2",
    name: "Omar Farooq, RD",
    email: "omar@eushbi.com",
    credentials: "RD",
    verified: true,
    clients: 19,
    rating: 4.7,
    status: "active",
  },
  {
    id: "d3",
    name: "Sara Ali",
    email: "sara.pending@eushbi.com",
    credentials: "RD (pending)",
    verified: false,
    clients: 0,
    rating: 0,
    status: "pending",
  },
];

export const MOCK_AUDIT: AuditEntry[] = [
  {
    id: "a1",
    actor: "admin@eushbi.com",
    action: "approved_product",
    target: "SKU · Chicken breast",
    at: "2026-10-15T08:12:00Z",
  },
  {
    id: "a2",
    actor: "ayesha@eushbi.com",
    action: "published_recipe",
    target: "Lemon herb chicken bowl",
    at: "2026-10-14T16:40:00Z",
  },
  {
    id: "a3",
    actor: "admin@eushbi.com",
    action: "suspended_user",
    target: "user_4821",
    at: "2026-10-14T11:05:00Z",
  },
  {
    id: "a4",
    actor: "system",
    action: "feature_flag_toggled",
    target: "meal_plan_v2 → on",
    at: "2026-10-13T09:00:00Z",
  },
];

export const MOCK_FLAGS: FeatureFlag[] = [
  {
    key: "meal_plan_v2",
    label: "Meal plan builder v2",
    enabled: true,
    description: "Drag-and-drop weekly planner in the app",
  },
  {
    key: "dietitian_chat",
    label: "Dietitian chat",
    enabled: false,
    description: "In-app messaging between member and RD",
  },
  {
    key: "barcode_ai",
    label: "Barcode AI assist",
    enabled: true,
    description: "Suggest nutrients from pack photos",
  },
  {
    key: "gdpr_self_serve",
    label: "Self-serve data export",
    enabled: false,
    description: "Let members download their data from Settings",
  },
];

export const RBAC_MATRIX = [
  { permission: "catalog.read", admin: true, content: true, dietitian: true, support: true, analyst: true },
  { permission: "catalog.write", admin: true, content: true, dietitian: false, support: false, analyst: false },
  { permission: "users.read", admin: true, content: false, dietitian: true, support: true, analyst: true },
  { permission: "users.write", admin: true, content: false, dietitian: false, support: true, analyst: false },
  { permission: "users.gdpr", admin: true, content: false, dietitian: false, support: false, analyst: false },
  { permission: "recipes.write", admin: true, content: true, dietitian: true, support: false, analyst: false },
  { permission: "billing.read", admin: true, content: false, dietitian: false, support: true, analyst: true },
  { permission: "billing.write", admin: true, content: false, dietitian: false, support: false, analyst: false },
  { permission: "analytics.read", admin: true, content: true, dietitian: false, support: false, analyst: true },
  { permission: "settings.write", admin: true, content: false, dietitian: false, support: false, analyst: false },
] as const;
