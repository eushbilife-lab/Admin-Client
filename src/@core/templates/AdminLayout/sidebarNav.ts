import {
  MdDashboard,
  MdViewList,
  MdCategory,
  MdPeople,
  MdSecurity,
  MdScience,
  MdTune,
  MdStar,
  MdRateReview,
  MdSupportAgent,
  MdNotifications,
  MdHealthAndSafety,
  MdRestaurant,
  MdInventory2,
  MdAccountTree,
  MdFactCheck,
  MdDirectionsWalk,
  MdFitnessCenter,
  MdFlag,
  MdSpa,
  MdNoMeals,
  MdEventNote,
  MdQrCodeScanner,
  MdPhoneIphone,
  MdInsights,
  MdMenuBook,
  MdCalendarMonth,
  MdPayments,
  MdMedicalServices,
  MdSettings,
  MdStorefront,
  MdLocalOffer,
  MdShoppingBag,
  MdViewModule,
} from "react-icons/md";
import type { IconType } from "react-icons";

export type NavItem = {
  label: string;
  path: string;
  icon: IconType;
  /** Extra words for sidebar search (not shown). */
  keywords?: string;
  /** One-line hint under the label when searching / hovering title. */
  hint?: string;
  roles?: string[];
};

export type NavGroup = {
  id: string;
  label: string;
  /** Short purpose line shown under the group title. */
  blurb: string;
  items: NavItem[];
};

export const sidebarGroups: NavGroup[] = [
  {
    id: "home",
    label: "Home",
    blurb: "Daily work & live desks",
    items: [
      {
        label: "Overview",
        path: "/dashboard",
        icon: MdDashboard,
        keywords: "home dashboard kpis",
        hint: "Platform home",
      },
      {
        label: "Analytics",
        path: "/analytics",
        icon: MdInsights,
        roles: ["admin"],
        keywords: "charts reports metrics",
        hint: "Usage & trends",
      },
      {
        label: "Review queue",
        path: "/queue",
        icon: MdFactCheck,
        keywords: "pending drafts approve",
        hint: "Foods waiting review",
      },
      {
        label: "App desk",
        path: "/app",
        icon: MdPhoneIphone,
        keywords: "mobile app support",
        hint: "Mobile app tools",
      },
      {
        label: "Scan desk",
        path: "/scans",
        icon: MdQrCodeScanner,
        keywords: "barcode qr scan",
        hint: "Scan activity",
      },
    ],
  },
  {
    id: "foods",
    label: "Foods",
    blurb: "Catalog you sell & score",
    items: [
      {
        label: "Catalog",
        path: "/products",
        icon: MdViewList,
        keywords: "products foods items nutrition",
        hint: "All food products",
      },
      {
        label: "Ingredients",
        path: "/ingredients",
        icon: MdRestaurant,
        keywords: "components recipe parts",
        hint: "Ingredient library",
      },
      {
        label: "Brands & makers",
        path: "/brands",
        icon: MdInventory2,
        roles: ["admin"],
        keywords: "manufacturer brand company",
        hint: "Brand directory",
      },
      {
        label: "Recipes",
        path: "/recipes",
        icon: MdMenuBook,
        roles: ["admin"],
        keywords: "cooking meals dishes",
        hint: "Recipe library",
      },
      {
        label: "Meal plans",
        path: "/meal-plans",
        icon: MdCalendarMonth,
        roles: ["admin"],
        keywords: "diet plan weekly menu",
        hint: "Planned meals",
      },
    ],
  },
  {
    id: "store",
    label: "Store",
    blurb: "Mobile shop — sections, SKUs, orders",
    items: [
      {
        label: "Sections",
        path: "/store/sections",
        icon: MdViewModule,
        roles: ["admin"],
        keywords: "supper foods supplements category chips",
        hint: "Shop sections (Supper Foods…)",
      },
      {
        label: "Products",
        path: "/store/products",
        icon: MdStorefront,
        roles: ["admin"],
        keywords: "keto pcos gallzen sell sku",
        hint: "Sellable store products",
      },
      {
        label: "Banners",
        path: "/store/banners",
        icon: MdLocalOffer,
        roles: ["admin"],
        keywords: "carousel promo slide hero",
        hint: "Home carousel slides",
      },
      {
        label: "Orders",
        path: "/store/orders",
        icon: MdShoppingBag,
        roles: ["admin"],
        keywords: "checkout payment xpay cart",
        hint: "Customer orders",
      },
    ],
  },
  {
    id: "science",
    label: "Science",
    blurb: "Nutrition rules & lifestyle tags",
    items: [
      {
        label: "Nutrients",
        path: "/nutrient",
        icon: MdRestaurant,
        roles: ["admin"],
        keywords: "vitamin mineral macros",
        hint: "Nutrient dictionary",
      },
      {
        label: "Daily values",
        path: "/rda",
        icon: MdScience,
        roles: ["admin"],
        keywords: "rda rdi allowance",
        hint: "RDA / daily values",
      },
      {
        label: "Health scores",
        path: "/scores",
        icon: MdStar,
        roles: ["admin"],
        keywords: "nutri-score grading",
        hint: "Scoring models",
      },
      {
        label: "Serving sizes",
        path: "/servings",
        icon: MdTune,
        roles: ["admin"],
        keywords: "uom portion grams",
        hint: "Portion units",
      },
      {
        label: "Pack labels",
        path: "/dynamics",
        icon: MdTune,
        roles: ["admin"],
        keywords: "fopl dynamic label",
        hint: "On-pack labels",
      },
      {
        label: "Activity level",
        path: "/activity-level",
        icon: MdDirectionsWalk,
        roles: ["admin"],
        keywords: "lifestyle sedentary active",
        hint: "Activity tags",
      },
      {
        label: "Exercises",
        path: "/exercises",
        icon: MdFitnessCenter,
        roles: ["admin"],
        keywords: "workout fitness video",
        hint: "Exercise catalog",
      },
      {
        label: "Goal",
        path: "/goals",
        icon: MdFlag,
        roles: ["admin"],
        keywords: "weight loss muscle",
        hint: "User goals",
      },
      {
        label: "Food interest",
        path: "/food-interest",
        icon: MdSpa,
        roles: ["admin"],
        keywords: "preference taste",
        hint: "Food interests",
      },
      {
        label: "Diet",
        path: "/diets",
        icon: MdNoMeals,
        roles: ["admin"],
        keywords: "vegan keto halal",
        hint: "Diet types",
      },
      {
        label: "Temporary concern",
        path: "/temporary-concerns",
        icon: MdEventNote,
        roles: ["admin"],
        keywords: "pregnancy fasting",
        hint: "Short-term concerns",
      },
      {
        label: "Health issue",
        path: "/health-issues",
        icon: MdHealthAndSafety,
        roles: ["admin"],
        keywords: "condition disease",
        hint: "Health conditions",
      },
    ],
  },
  {
    id: "safety",
    label: "Safety",
    blurb: "Allergens & intolerances",
    items: [
      {
        label: "Allergens",
        path: "/allergies",
        icon: MdHealthAndSafety,
        roles: ["admin"],
        keywords: "allergy peanut dairy gluten",
        hint: "Major / minor allergies",
      },
      {
        label: "Intolerance",
        path: "/food-intolerance",
        icon: MdInventory2,
        roles: ["admin"],
        keywords: "lactose sensitivity",
        hint: "Food intolerances",
      },
    ],
  },
  {
    id: "taxonomy",
    label: "Taxonomy",
    blurb: "Aisle → category tree",
    items: [
      {
        label: "Aisles",
        path: "/level1",
        icon: MdAccountTree,
        roles: ["admin"],
        keywords: "level1 main category",
        hint: "Top-level aisles",
      },
      {
        label: "Categories",
        path: "/level2",
        icon: MdCategory,
        roles: ["admin"],
        keywords: "level2 group",
        hint: "Category groups",
      },
      {
        label: "Sub-categories",
        path: "/level3",
        icon: MdCategory,
        roles: ["admin"],
        keywords: "level3 sub",
        hint: "Sub-categories",
      },
      {
        label: "Nested groups",
        path: "/level4",
        icon: MdCategory,
        roles: ["admin"],
        keywords: "level4 nest",
        hint: "Deepest nesting",
      },
    ],
  },
  {
    id: "people",
    label: "People",
    blurb: "Members, dietitians, staff",
    items: [
      {
        label: "Households",
        path: "/users",
        icon: MdPeople,
        roles: ["admin"],
        keywords: "members users customers",
        hint: "App members",
      },
      {
        label: "Dietitians",
        path: "/dietitians",
        icon: MdMedicalServices,
        roles: ["admin"],
        keywords: "nutritionist coach",
        hint: "Dietitian accounts",
      },
      {
        label: "Staff",
        path: "/roles",
        icon: MdSecurity,
        roles: ["admin"],
        keywords: "admin roles permissions",
        hint: "Admin roles",
      },
    ],
  },
  {
    id: "ops",
    label: "Ops",
    blurb: "Billing, support & settings",
    items: [
      {
        label: "Subscriptions",
        path: "/subscriptions",
        icon: MdPayments,
        roles: ["admin"],
        keywords: "billing plan pay",
        hint: "Member plans",
      },
      {
        label: "Reviews",
        path: "/reviews",
        icon: MdRateReview,
        roles: ["admin"],
        keywords: "ratings feedback",
        hint: "Product reviews",
      },
      {
        label: "Support",
        path: "/contacts",
        icon: MdSupportAgent,
        roles: ["admin"],
        keywords: "contact messages tickets",
        hint: "Inbox / contact us",
      },
      {
        label: "Notifications",
        path: "/notifications",
        icon: MdNotifications,
        roles: ["admin"],
        keywords: "push alerts broadcast",
        hint: "Push campaigns",
      },
      {
        label: "Settings",
        path: "/settings",
        icon: MdSettings,
        roles: ["admin"],
        keywords: "config preferences",
        hint: "App settings",
      },
    ],
  },
];

export function getSidebarGroups(role?: string): NavGroup[] {
  return sidebarGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.roles || item.roles.includes(role || "")
      ),
    }))
    .filter((group) => group.items.length > 0);
}

/** Lightweight fuzzy score — higher is better. */
export function scoreNavMatch(query: string, item: NavItem, groupLabel: string) {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const hay = `${item.label} ${item.hint || ""} ${item.keywords || ""} ${groupLabel} ${item.path}`
    .toLowerCase()
    .replace(/\s+/g, " ");
  if (hay.includes(q)) return 100 - hay.indexOf(q);
  const parts = q.split(/\s+/).filter(Boolean);
  if (parts.every((p) => hay.includes(p))) return 60;
  // initials / starts-with boost
  const words = hay.split(/[^a-z0-9]+/).filter(Boolean);
  if (words.some((w) => w.startsWith(q))) return 80;
  const initials = words.map((w) => w[0]).join("");
  if (initials.includes(q.replace(/\s/g, ""))) return 40;
  return 0;
}
