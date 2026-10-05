import http from "./http.service";
import Promisable from "./promisable.service";

const silent = { headers: { "X-Skip-Toast": "1" } };

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

function dataOf(result: any) {
  return result?.[0]?.data?.data || {};
}

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

async function silentGet(url: string, body?: unknown) {
  const req = body === undefined ? http.get(url, silent) : http.post(url, body, silent);
  const [ok]: any = await Promisable.asPromise(req);
  return dataOf([ok]);
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
  http.setJWT();
  http.setLanguage();
  const payload = /^\d{6,}$/.test(query)
    ? { page: 1, page_size: 6, isDelete: false, barcode: query }
    : { page: 1, page_size: 6, isDelete: false, productName: query };
  const data = await silentGet("/products/query", payload);
  return data.products || [];
}

export async function loadDashboardOverview(): Promise<DashboardOverview> {
  http.setJWT();
  http.setLanguage();

  const overviewData = await silentGet("/dashboard/overview");
  const remote = overviewData.overview;
  if (remote?.kpis) {
    const labeled = remote.coverage?.labeled || 0;
    const missing = remote.coverage?.missing || 0;
    const completeness = remote.kpis.completeness || 0;
    return {
      kpis: {
        products: remote.kpis.products || 0,
        pending: remote.kpis.pending || 0,
        rdas: remote.kpis.rdas || 0,
        completeness,
        members: remote.kpis.members || 0,
        foplCoverage: remote.coverage?.foplCoverage || 0,
      },
      series: { products: bucketSeries(remote.recentProducts || [], 7) },
      coverage: [
        { id: "labeled", name: "Full nutrition facts", value: labeled, color: "#9FC53A" },
        { id: "missing", name: "Missing facts panel", value: missing, color: "#EAB308" },
      ].filter((slice) => slice.value > 0),
      recentProducts: remote.recentProducts || [],
      missingLabels: remote.missingLabels || [],
      pendingActions: [
        {
          id: "pending-products",
          title: "Awaiting nutrient review",
          description: "Pending products for dietitians",
          count: remote.kpis.pending || 0,
          tone: "orange",
          href: "/queue",
        },
        {
          id: "drafts",
          title: "Unpublished drafts",
          description: "Labels not yet in the catalog",
          count: remote.labs?.drafts || 0,
          tone: "blue",
          href: "/queue",
        },
        {
          id: "members",
          title: "Nutrition profiles",
          description: "Household files in the live app",
          count: remote.kpis.profiles || 0,
          tone: "green",
          href: "/users",
        },
      ],
      labs: EMPTY_LABS.map((lab) => ({
        ...lab,
        count:
          lab.id === "catalog"
            ? remote.kpis.products || 0
            : lab.id === "tree"
            ? remote.labs?.tree || 0
            : lab.id === "rda"
            ? remote.kpis.rdas || 0
            : lab.id === "nutrients"
            ? remote.labs?.nutrients || 0
            : lab.id === "scores"
            ? remote.labs?.scores || 0
            : lab.id === "dynamics"
            ? remote.labs?.certificates || 0
            : lab.id === "allergies"
            ? remote.labs?.allergies || 0
            : lab.id === "intolerance"
            ? remote.labs?.intolerances || 0
            : lab.id === "reviews"
            ? remote.labs?.reviews || 0
            : lab.id === "users"
            ? remote.kpis.members || 0
            : lab.id === "queue"
            ? remote.kpis.pending || 0
            : lab.id === "lifestyle"
            ? remote.labs?.diets || 0
            : lab.count,
      })),
      insight:
        completeness >= 80
          ? `Strong labeling: ${completeness}% of foods include a nutrition facts panel. FOPL coverage is ${remote.coverage?.foplCoverage || 0}%.`
          : `${completeness}% of foods have a complete facts panel. Finish missing labels before scoring.`,
    };
  }

  const [
    productsData,
    pendingData,
    draftsData,
    nutritionData,
    rdaData,
    scoresData,
    level1Data,
    allergyData,
    intoleranceData,
    foplData,
    reviewsData,
    usersData,
  ] = await Promise.all([
    silentGet("/products/query", { page: 1, page_size: 50, isDelete: false }),
    silentGet("/products/query", { page: 1, page_size: 1, isDelete: false, status: "pending" }),
    silentGet("/draft-products/query", { page: 1, page_size: 1 }),
    silentGet("/nutrition"),
    silentGet("/rda"),
    silentGet("/scores", { page: 1, page_size: 1 }),
    silentGet("/main-categories", { page: 1, page_size: 1 }),
    silentGet("/allergies/major-Allergy", { page: 1, page_size: 1 }),
    silentGet("/food-intolerances/major-FoodIntolerance", { page: 1, page_size: 1 }),
    silentGet("/dynamics/get-All-Dynamics", { type: "product_certificate", page: 1, page_size: 1 }),
    silentGet("/product-reviews", { page: 1, page_size: 1 }),
    silentGet("/users/query", { page: 1, page_size: 1 }),
  ]);

  const products = productsData.products || [];
  const nutrients = nutritionData.Nutritions || nutritionData.nutritions || [];
  const rdas = rdaData.Rdas || rdaData.rdas || [];
  const labeled = products.filter(hasNutritionFacts);
  const missing = products.filter((p: any) => !hasNutritionFacts(p));
  const completeness = products.length ? Math.round((labeled.length / products.length) * 100) : 0;
  const pendingCount = num(pendingData.totalCount);
  const draftCount = num(draftsData.totalCount);
  const rdaCount = num(rdas.length, rdas);
  const scoreCount = num(scoresData.totalCount, scoresData.requiredHNSS);
  const nutrientCount = num(nutrients.length, nutrients);
  const treeCount = num(level1Data.totalCount, level1Data.mainCategories);
  const allergyCount = num(allergyData.count, allergyData.allergies);
  const intoleranceCount = num(intoleranceData.count, intoleranceData.intolerances);
  const foplCount = num(foplData.count, foplData.dynamic);
  const reviewCount = num(reviewsData.totalCount, reviewsData.productReviews);
  const userCount = num(usersData.totalCount, usersData.users);

  return {
    kpis: {
      products: num(productsData.totalCount, products.length),
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
        count: num(productsData.totalCount, products.length),
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
