import { useCallback, useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import CommandPalette from "./CommandPalette";
import ShortcutsHelp from "./ShortcutsHelp";
import useHotkey from "hooks/useHotkey";
import {
  applyDensity,
  applyTheme,
  pushRecentPage,
  readDensity,
  readTheme,
  type AdminDensity,
  type AdminTheme,
} from "utils/adminPrefs.util";
import { getSidebarGroups } from "./sidebarNav";
import { useAppSelector } from "redux/hooks";
import "./AdminLayout.css";

function labelForPath(pathname: string, role?: string): string {
  const items = getSidebarGroups(role).flatMap((group) => group.items);
  const exact = items.find((item) => item.path === pathname);
  if (exact) return exact.label;
  const soft = items.find(
    (item) => item.path !== "/" && pathname.startsWith(item.path)
  );
  if (soft) return soft.label;
  const segment = pathname.split("/").filter(Boolean).pop() || "Page";
  return segment.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [theme, setTheme] = useState<AdminTheme>(() => readTheme());
  const [density, setDensity] = useState<AdminDensity>(() => readDensity());

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const togglePalette = useCallback(() => setPaletteOpen((value) => !value), []);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);

  useHotkey("k", togglePalette, { meta: true });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyDensity(density);
  }, [density]);

  useEffect(() => {
    pushRecentPage(location.pathname, labelForPath(location.pathname, user?.role));
  }, [location.pathname, user?.role]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName;
      const typing =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (event.target as HTMLElement)?.isContentEditable;

      if (
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "l"
      ) {
        event.preventDefault();
        setTheme((t) => (t === "dark" ? "light" : "dark"));
        return;
      }

      if (
        (event.metaKey || event.ctrlKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "d"
      ) {
        event.preventDefault();
        setDensity((d) => (d === "compact" ? "comfortable" : "compact"));
        return;
      }

      if (!typing && event.key === "?" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setShortcutsOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="admin-layout">
      <AdminHeader
        onMenuClick={() => setSidebarOpen(true)}
        onSearchClick={openPalette}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        theme={theme}
        onThemeChange={setTheme}
        density={density}
        onDensityChange={setDensity}
      />
      <div className="admin-layout__body">
        <AdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenPalette={openPalette}
        />
        <main className="admin-layout__content">{children}</main>
      </div>
      <CommandPalette open={paletteOpen} onClose={closePalette} />
      <ShortcutsHelp open={shortcutsOpen} onClose={closeShortcuts} />
    </div>
  );
}
