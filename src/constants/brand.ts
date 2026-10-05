export const BRAND = {
  name: "Eushbi Life",
  short: "Eushbi",
  product: "Live",
  logo: "/EushbiLife.png",
  tagline: "Every barcode, scored for real life.",
  console: "Nutrition Platform",
  lede: "The platform dietitians use to catalog foods, set daily values, flag allergens, and score labels.",
} as const;

export const BRAND_COLORS = {
  parrot: "#9FC53A",
  parrotDark: "#74941F",
  blue: "#0068F7",
  blueDark: "#0058D4",
  yellow: "#EAB308",
  yellowDark: "#CA9A07",
  red: "#FF001B",
  black: "#0A0A0A",
  canvas: "#F5F9EB",
  paper: "#FEFEFE",
  night: "#0A0A0A",
  coral: "#9FC53A",
  teal: "#9FC53A",
  amber: "#EAB308",
  ink: "#0A0A0A",
  alert: "#FF001B",
  forest: "#0A0A0A",
  science: "#0068F7",
  leaf: "#9FC53A",
  harvest: "#EAB308",
} as const;

export function displayNameOf(user?: { fullName?: string; name?: string; email?: string } | null) {
  return user?.fullName || user?.name || user?.email?.split("@")[0] || "Dietitian";
}
