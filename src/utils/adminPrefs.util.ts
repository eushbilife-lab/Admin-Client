const THEME_KEY = "eushbi-admin-theme";
const DENSITY_KEY = "eushbi-admin-density";
const RECENT_KEY = "eushbi-admin-recent";

export type AdminTheme = "light" | "dark";
export type AdminDensity = "comfortable" | "compact";

export type RecentPage = {
  path: string;
  label: string;
  at: number;
};

export function readTheme(): AdminTheme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore */
  }
  if (typeof document !== "undefined") {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  }
  return "light";
}

export function applyTheme(theme: AdminTheme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function readDensity(): AdminDensity {
  try {
    const stored = localStorage.getItem(DENSITY_KEY);
    if (stored === "compact" || stored === "comfortable") return stored;
  } catch {
    /* ignore */
  }
  if (typeof document !== "undefined") {
    return document.documentElement.getAttribute("data-density") === "compact"
      ? "compact"
      : "comfortable";
  }
  return "comfortable";
}

export function applyDensity(density: AdminDensity) {
  document.documentElement.setAttribute("data-density", density);
  try {
    localStorage.setItem(DENSITY_KEY, density);
  } catch {
    /* ignore */
  }
}

export function readRecentPages(limit = 8): RecentPage[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentPage[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item?.path && item?.label)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export function pushRecentPage(path: string, label: string, limit = 10) {
  if (!path || path === "/" || path.startsWith("/login")) return;
  const next: RecentPage = { path, label, at: Date.now() };
  const prev = readRecentPages(40).filter((item) => item.path !== path);
  const merged = [next, ...prev].slice(0, limit);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(merged));
  } catch {
    /* ignore */
  }
}
