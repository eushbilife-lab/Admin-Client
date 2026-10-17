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
} from "react-icons/md";
import type { IconType } from "react-icons";

export type NavItem = {
  label: string;
  path: string;
  icon: IconType;
  roles?: string[];
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
};

export const sidebarGroups: NavGroup[] = [
  {
    items: [
      { label: "Overview", path: "/dashboard", icon: MdDashboard },
      { label: "Analytics", path: "/analytics", icon: MdInsights, roles: ["admin"] },
      { label: "Review queue", path: "/queue", icon: MdFactCheck },
      { label: "App desk", path: "/app", icon: MdPhoneIphone },
      { label: "Scan desk", path: "/scans", icon: MdQrCodeScanner },
    ],
  },
  {
    label: "Foods",
    items: [
      { label: "Catalog", path: "/products", icon: MdViewList },
      { label: "Ingredients", path: "/ingredients", icon: MdRestaurant },
      { label: "Brands & makers", path: "/brands", icon: MdInventory2, roles: ["admin"] },
      { label: "Recipes", path: "/recipes", icon: MdMenuBook, roles: ["admin"] },
      { label: "Meal plans", path: "/meal-plans", icon: MdCalendarMonth, roles: ["admin"] },
    ],
  },
  {
    label: "Science",
    items: [
      { label: "Nutrients", path: "/nutrient", icon: MdRestaurant, roles: ["admin"] },
      { label: "Daily values", path: "/rda", icon: MdScience, roles: ["admin"] },
      { label: "Health scores", path: "/scores", icon: MdStar, roles: ["admin"] },
      { label: "Serving sizes", path: "/servings", icon: MdTune, roles: ["admin"] },
      { label: "Pack labels", path: "/dynamics", icon: MdTune, roles: ["admin"] },
      { label: "Activity level", path: "/activity-level", icon: MdDirectionsWalk, roles: ["admin"] },
      { label: "Exercises", path: "/exercises", icon: MdFitnessCenter, roles: ["admin"] },
      { label: "Goal", path: "/goals", icon: MdFlag, roles: ["admin"] },
      { label: "Food Interest", path: "/food-interest", icon: MdSpa, roles: ["admin"] },
      { label: "Diet", path: "/diets", icon: MdNoMeals, roles: ["admin"] },
      { label: "Temporary concern", path: "/temporary-concerns", icon: MdEventNote, roles: ["admin"] },
      { label: "Health issue", path: "/health-issues", icon: MdHealthAndSafety, roles: ["admin"] },
    ],
  },
  {
    label: "Safety",
    items: [
      { label: "Allergens", path: "/allergies", icon: MdHealthAndSafety, roles: ["admin"] },
      { label: "Intolerance", path: "/food-intolerance", icon: MdInventory2, roles: ["admin"] },
    ],
  },
  {
    label: "Taxonomy",
    items: [
      { label: "Aisles", path: "/level1", icon: MdAccountTree, roles: ["admin"] },
      { label: "Categories", path: "/level2", icon: MdCategory, roles: ["admin"] },
      { label: "Sub-categories", path: "/level3", icon: MdCategory, roles: ["admin"] },
      { label: "Nested groups", path: "/level4", icon: MdCategory, roles: ["admin"] },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Households", path: "/users", icon: MdPeople, roles: ["admin"] },
      { label: "Dietitians", path: "/dietitians", icon: MdMedicalServices, roles: ["admin"] },
      { label: "Staff", path: "/roles", icon: MdSecurity, roles: ["admin"] },
    ],
  },
  {
    label: "Store",
    items: [
      { label: "Products", path: "/store/products", icon: MdStorefront, roles: ["admin"] },
      { label: "Banners", path: "/store/banners", icon: MdLocalOffer, roles: ["admin"] },
      { label: "Orders", path: "/store/orders", icon: MdShoppingBag, roles: ["admin"] },
    ],
  },
  {
    label: "Ops",
    items: [
      { label: "Subscriptions", path: "/subscriptions", icon: MdPayments, roles: ["admin"] },
      { label: "Reviews", path: "/reviews", icon: MdRateReview, roles: ["admin"] },
      { label: "Support", path: "/contacts", icon: MdSupportAgent, roles: ["admin"] },
      { label: "Notifications", path: "/notifications", icon: MdNotifications, roles: ["admin"] },
      { label: "Settings", path: "/settings", icon: MdSettings, roles: ["admin"] },
    ],
  },
];

export function getSidebarGroups(role?: string): NavGroup[] {
  return sidebarGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.roles || item.roles.includes(role || "")),
    }))
    .filter((group) => group.items.length > 0);
}
