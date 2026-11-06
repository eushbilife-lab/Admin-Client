import type { AppDispatch } from "redux/store";
import { allergyApi } from "redux/api/allergy/allergyApi";
import { dashboardApi } from "redux/api/dashboard/dashboardApi";
import { draftProductApi } from "redux/api/draftProduct/draftProductApi";
import { dynamicApi } from "redux/api/dynamic/dynamicApi";
import { foodIntoleranceApi } from "redux/api/foodIntolerance/foodIntoleranceApi";
import { level1Api } from "redux/api/level1/level1Api";
import { nutritionApi } from "redux/api/nutrition/nutritionApi";
import { productApi } from "redux/api/product/productApi";
import { rdaApi } from "redux/api/rda/rdaApi";
import { reviewsApi } from "redux/api/reviews/reviewsApi";
import { scoreApi } from "redux/api/score/scoreApi";
import { userApi } from "redux/api/user/userApi";
import { getAppDispatch } from "utils/dispatch.util";
export type ChartPoint = { date: string; value: number };
export type CoverageSlice = { id: string; name: string; value: number; color: string };
export type QueueItem = {
  id: string;
  title: string;
  description: string;
  count: number | string;
  tone: "orange" | "blue" | "pink" | "green";
  href: string;
};

export type NutritionLab = {
  id: string;
  title: string;
  blurb: string;
  href: string;
  count: number;
  tone: "blue" | "parrot" | "yellow" | "red";
};

export type CatalogHit = {
  _id: string;
  productName?: string;
  brand?: string;
  barcode?: string;
  image?: string;
  productImages?: string[];
  image_url?: string;
};

export type DashboardOverview = {
  kpis: {
    products: number;
    pending: number;
    members: number;
    completeness: number;
    rdas: number;
    foplCoverage: number;
  };
  series: { products: ChartPoint[] };
  coverage: CoverageSlice[];
  recentProducts: any[];
  missingLabels: any[];
  pendingActions: QueueItem[];
  labs: NutritionLab[];
  insight: string;
};

function num(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "number") return value;
    if (Array.isArray(value)) return value.length;
  }
  return 0;
}

function bucketSeries(items: any[], days: number): ChartPoint[] {
  const buckets = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toLocaleDateString("en-US", { weekday: "short" }),
      value: 0,
      key: d.toDateString(),
    };
  });
  items.forEach((item) => {
    if (!item?.createdAt) return;
    const key = new Date(item.createdAt).toDateString();
    const bucket = buckets.find((b) => b.key === key);
    if (bucket) bucket.value += 1;
  });
  return buckets.map(({ date, value }) => ({ date, value }));
}

function hasNutritionFacts(product: any) {
  return Array.isArray(product?.nf) && product.nf.length > 0;
}

async function silentInitiate<T>(
  d: AppDispatch,
  request: unknown
): Promise<T | null> {
  try {
    return await (d as (action: unknown) => { unwrap: () => Promise<T> })(
      request
    ).unwrap();
  } catch {
    return null;
  }
}

const EMPTY_LABS: NutritionLab[] = [
  { id: "catalog", title: "Catalog", blurb: "Barcode, brand, facts, FOPL", href: "/products", count: 0, tone: "blue" },
  { id: "tree", title: "Food tree", blurb: "Four-level taxonomy", href: "/level1", count: 0, tone: "parrot" },
  { id: "rda", title: "Daily values", blurb: "RDA used on nutrition facts", href: "/rda", count: 0, tone: "yellow" },
  { id: "nutrients", title: "Nutrients", blurb: "Energy, macros, micros", href: "/nutrient", count: 0, tone: "parrot" },
  { id: "scores", title: "Health scores", blurb: "Scoring models for foods", href: "/scores", count: 0, tone: "blue" },
  { id: "dynamics", title: "Pack labels", blurb: "FOPL, food type, units", href: "/dynamics", count: 0, tone: "yellow" },
  { id: "allergies", title: "Allergens", blurb: "Major allergen groups", href: "/allergies", count: 0, tone: "red" },
  { id: "intolerance", title: "Intolerance", blurb: "Intolerance library", href: "/food-intolerance", count: 0, tone: "red" },
  { id: "reviews", title: "Product reviews", blurb: "Community feedback", href: "/reviews", count: 0, tone: "blue" },
  { id: "users", title: "Households", blurb: "App users and staff", href: "/users", count: 0, tone: "parrot" },
  { id: "queue", title: "Review queue", blurb: "Pending + unpublished drafts", href: "/queue", count: 0, tone: "yellow" },
  { id: "lifestyle", title: "Profile catalogs", blurb: "Activity, goals, diet, interests", href: "/activity-level", count: 0, tone: "blue" },
];

export const emptyDashboard: DashboardOverview = {
  kpis: { products: 0, pending: 0, rdas: 0, completeness: 0, members: 0, foplCoverage: 0 },
  series: { products: [] },
  coverage: [],
  recentProducts: [],
  missingLabels: [],
  pendingActions: [],
  labs: EMPTY_LABS,
  insight: "No catalog data yet. Start by adding a food product.",
};

export async function searchCatalog(term: string): Promise<CatalogHit[]> {
  const query = term.trim();
  if (query.length < 2) return [];
  const d = getAppDispatch();
  if (!d) return [];
  try {
    return await d(
      dashboardApi.endpoints.searchCatalog.initiate(query, {
        forceRefetch: true,
      })
    ).unwrap();
  } catch {
    return [];
  }
}

export async function loadDashboardOverview(): Promise<DashboardOverview> {
  const d = getAppDispatch();
  if (!d) return emptyDashboard;

  const remote = await silentInitiate<Record<string, unknown>>(
    d,
    dashboardApi.endpoints.getDashboardOverview.initiate(undefined, {
      forceRefetch: true,
    })
  );

  if (remote?.kpis) {
    const labeled = (remote.coverage as { labeled?: number })?.labeled || 0;
    const missing = (remote.coverage as { missing?: number })?.missing || 0;
    const completeness = (remote.kpis as { completeness?: number }).completeness || 0;
    const kpis = remote.kpis as Record<string, number>;
    const coverage = remote.coverage as Record<string, number>;
    const labs = remote.labs as Record<string, number> | undefined;
    return {
      kpis: {
        products: kpis.products || 0,
        pending: kpis.pending || 0,
        rdas: kpis.rdas || 0,
        completeness,
        members: kpis.members || 0,
        foplCoverage: coverage?.foplCoverage || 0,
      },
      series: {
        products: bucketSeries(
          (remote.recentProducts as any[]) || [],
          7
        ),
      },
      coverage: [
        { id: "labeled", name: "Full nutrition facts", value: labeled, color: "#9FC53A" },
        { id: "missing", name: "Missing facts panel", value: missing, color: "#EAB308" },
      ].filter((slice) => slice.value > 0),
      recentProducts: (remote.recentProducts as any[]) || [],
      missingLabels: (remote.missingLabels as any[]) || [],
      pendingActions: [
        {
          id: "pending-products",
          title: "Awaiting nutrient review",
          description: "Pending products for dietitians",
          count: kpis.pending || 0,
          tone: "orange",
          href: "/queue",
        },
        {
          id: "drafts",
          title: "Unpublished drafts",
          description: "Labels not yet in the catalog",
          count: labs?.drafts || 0,
          tone: "blue",
          href: "/queue",
        },
        {
          id: "members",
          title: "Nutrition profiles",
          description: "Household files in the live app",
          count: kpis.profiles || 0,
          tone: "green",
          href: "/users",
        },
      ],
      labs: EMPTY_LABS.map((lab) => ({
        ...lab,
        count:
          lab.id === "catalog"
            ? kpis.products || 0
            : lab.id === "tree"
            ? labs?.tree || 0
            : lab.id === "rda"
            ? kpis.rdas || 0
            : lab.id === "nutrients"
            ? labs?.nutrients || 0
            : lab.id === "scores"
            ? labs?.scores || 0
            : lab.id === "dynamics"
            ? labs?.certificates || 0
            : lab.id === "allergies"
            ? labs?.allergies || 0
            : lab.id === "intolerance"
            ? labs?.intolerances || 0
            : lab.id === "reviews"
            ? labs?.reviews || 0
            : lab.id === "users"
            ? kpis.members || 0
            : lab.id === "queue"
            ? kpis.pending || 0
            : lab.id === "lifestyle"
            ? labs?.diets || 0
            : lab.count,
      })),
      insight:
        completeness >= 80
          ? `Strong labeling: ${completeness}% of foods include a nutrition facts panel. FOPL coverage is ${coverage?.foplCoverage || 0}%.`
          : `${completeness}% of foods have a complete facts panel. Finish missing labels before scoring.`,
    };
  }

  const [
    productsData,
    pendingData,
    draftsData,
    nutritions,
    rdas,
    scoresData,
    level1Data,
    allergyData,
    intoleranceData,
    foplData,
    reviewsData,
    usersData,
  ] = await Promise.all([
    silentInitiate<{ products: any[]; totalCount: number }>(
      d,
      productApi.endpoints.getAllProducts.initiate(
        { page: 1, page_size: 50 },
        { forceRefetch: true }
      )
    ),
    silentInitiate<{ products: any[]; totalCount: number }>(
      d,
      productApi.endpoints.getAllProducts.initiate(
        { page: 1, page_size: 1, status: "pending" },
        { forceRefetch: true }
      )
    ),
    silentInitiate<{ products: any[]; totalCount: number }>(
      d,
      draftProductApi.endpoints.getAllDraftProducts.initiate(
        { page: 1, page_size: 1 },
        { forceRefetch: true }
      )
    ),
    silentInitiate<any[]>(
      d,
      nutritionApi.endpoints.getAllNutritions.initiate(undefined, {
        forceRefetch: true,
      })
    ),
    silentInitiate<any[]>(
      d,
      rdaApi.endpoints.getAllRdas.initiate(undefined, { forceRefetch: true })
    ),
    silentInitiate<{ requiredHNSS: any[]; totalCount: number }>(
      d,
      scoreApi.endpoints.getAllScores.initiate(
        { page: 1, page_size: 1 },
        { forceRefetch: true }
      )
    ),
    silentInitiate<{ mainCategories: any[]; totalCount: number }>(
      d,
      level1Api.endpoints.getAllLevel1.initiate(
        { page: 1, page_size: 1 },
        { forceRefetch: true }
      )
    ),
    silentInitiate<{ allergies: any[]; count: number }>(
      d,
      allergyApi.endpoints.getAllMajorAllergies.initiate(
        { page: 1, page_size: 1 },
        { forceRefetch: true }
      )
    ),
    silentInitiate<{ foodIntolerances: any[]; count: number }>(
      d,
      foodIntoleranceApi.endpoints.getAllMajorFoodIntolerances.initiate(
        { page: 1, page_size: 1 },
        { forceRefetch: true }
      )
    ),
    silentInitiate<{ dynamic: any[]; count: number }>(
      d,
      dynamicApi.endpoints.getAllDynamics.initiate(
        { type: "product_certificate", page: 1, page_size: 1 },
        { forceRefetch: true }
      )
    ),
    silentInitiate<{ productReviews: any[]; totalCount: number }>(
      d,
      reviewsApi.endpoints.getAllReviews.initiate(
        { page: 1, page_size: 1 },
        { forceRefetch: true }
      )
    ),
    silentInitiate<{ users: any[]; totalCount: number }>(
      d,
      userApi.endpoints.getAllUsers.initiate(
        { page: 1, page_size: 1 },
        { forceRefetch: true }
      )
    ),
  ]);

  const products = productsData?.products || [];
  const labeled = products.filter(hasNutritionFacts);
  const missing = products.filter((p: any) => !hasNutritionFacts(p));
  const completeness = products.length
    ? Math.round((labeled.length / products.length) * 100)
    : 0;
  const pendingCount = num(pendingData?.totalCount);
  const draftCount = num(draftsData?.totalCount);
  const rdaCount = num(rdas?.length, rdas);
  const scoreCount = num(scoresData?.totalCount, scoresData?.requiredHNSS);
  const nutrientCount = num(nutritions?.length, nutritions);
  const treeCount = num(level1Data?.totalCount, level1Data?.mainCategories);
  const allergyCount = num(allergyData?.count, allergyData?.allergies);
  const intoleranceCount = num(
    intoleranceData?.count,
    intoleranceData?.foodIntolerances
  );
  const foplCount = num(foplData?.count, foplData?.dynamic);
  const reviewCount = num(reviewsData?.totalCount, reviewsData?.productReviews);
  const userCount = num(usersData?.totalCount, usersData?.users);

  return {
    kpis: {
      products: num(productsData?.totalCount, products.length),
      pending: pendingCount,
      rdas: rdaCount,
      completeness,
      members: userCount,
      foplCoverage: 0,
    },
    series: { products: bucketSeries(products, 7) },
    coverage: [
      { id: "labeled", name: "Full nutrition facts", value: labeled.length || 0, color: "#9FC53A" },
      { id: "missing", name: "Missing facts panel", value: missing.length || 0, color: "#EAB308" },
    ].filter((slice) => slice.value > 0),
    recentProducts: products.slice(0, 5),
    missingLabels: missing.slice(0, 5),
    pendingActions: [
      {
        id: "pending-products",
        title: "Awaiting nutrient review",
        description: "Pending products for dietitians",
        count: pendingCount,
        tone: "orange",
        href: "/queue",
      },
      {
        id: "drafts",
        title: "Unpublished drafts",
        description: "Labels not yet in the catalog",
        count: draftCount,
        tone: "blue",
        href: "/queue",
      },
      {
        id: "scores",
        title: "HNSS scoring models",
        description: "Front-of-pack score recipes",
        count: scoreCount,
        tone: "green",
        href: "/scores",
      },
    ],
    labs: [
      {
        id: "catalog",
        title: "Food catalog",
        blurb: "Barcode, brand, facts, FOPL",
        href: "/products",
        count: num(productsData?.totalCount, products.length),
        tone: "blue",
      },
      {
        id: "tree",
        title: "Food tree",
        blurb: "Four-level taxonomy",
        href: "/level1",
        count: treeCount,
        tone: "parrot",
      },
      {
        id: "rda",
        title: "RDA / %DV",
        blurb: "Daily values for labels",
        href: "/rda",
        count: rdaCount,
        tone: "yellow",
      },
      {
        id: "nutrients",
        title: "Nutrient library",
        blurb: "Energy, macros, micros",
        href: "/nutrient",
        count: nutrientCount,
        tone: "parrot",
      },
      {
        id: "scores",
        title: "HNSS scores",
        blurb: "Scoring models for foods",
        href: "/scores",
        count: scoreCount,
        tone: "blue",
      },
      {
        id: "dynamics",
        title: "FOPL, type & UOM",
        blurb: "Certificates, food type, units",
        href: "/dynamics",
        count: foplCount,
        tone: "yellow",
      },
      {
        id: "allergies",
        title: "Allergies",
        blurb: "Major allergen groups",
        href: "/allergies",
        count: allergyCount,
        tone: "red",
      },
      {
        id: "intolerance",
        title: "Food intolerance",
        blurb: "Intolerance library",
        href: "/food-intolerance",
        count: intoleranceCount,
        tone: "red",
      },
      {
        id: "reviews",
        title: "Product reviews",
        blurb: "Community feedback",
        href: "/reviews",
        count: reviewCount,
        tone: "blue",
      },
      {
        id: "users",
        title: "People",
        blurb: "App users and staff",
        href: "/users",
        count: userCount,
        tone: "parrot",
      },
      {
        id: "queue",
        title: "Dietitian queue",
        blurb: "Pending + unpublished drafts",
        href: "/queue",
        count: pendingCount + draftCount,
        tone: "yellow",
      },
      {
        id: "lifestyle",
        title: "Profile catalogs",
        blurb: "Activity, goals, diet, food interest",
        href: "/activity-level",
        count: 0,
        tone: "blue",
      },
    ],
    insight:
      completeness >= 80
        ? `Strong labeling: ${completeness}% of the latest foods include a nutrition facts panel.`
        : `${completeness}% of sampled foods have a complete facts panel. Finish missing labels before scoring.`,
  };
}
