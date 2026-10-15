import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdAdd, MdDarkMode, MdLightMode, MdMenu, MdNotificationsNone, MdSearch } from "react-icons/md";
import { useAppSelector } from "redux/hooks";
import AuthService from "services/auth.service";
import NotificationService from "services/notification.service";
import { getAppDispatch } from "utils/dispatch.util";
import { config } from "config";
import { BRAND, displayNameOf } from "constants/brand";
import { QUICK_CREATE } from "constants/adminCommands";
import { getSidebarGroups } from "./sidebarNav";
import "./AdminHeader.css";

type AdminHeaderProps = {
  onMenuClick?: () => void;
  onSearchClick?: () => void;
};

type MenuKey = "search" | "add" | "user" | null;

const THEME_KEY = "eushbi-admin-theme";
const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

function readTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

export default function AdminHeader({ onMenuClick, onSearchClick }: AdminHeaderProps) {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const noteCount = useAppSelector((state) => state.notification.count);
  const rootRef = useRef<HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">(() => readTheme());
  const name = displayNameOf(user);
  const firstName = name.split(" ")[0];
  const initial = name.charAt(0).toUpperCase();
  const avatarSrc = user?.profileImage
    ? /^https?:\/\//i.test(user.profileImage)
      ? user.profileImage
      : config.API_URL + user.profileImage
    : "";
  const shortcut = useMemo(() => (isMac ? "⌘K" : "Ctrl K"), []);
  const canSeeNotes = user?.role === "admin";

  const navItems = useMemo(() => {
    return getSidebarGroups(user?.role).flatMap((group) => group.items);
  }, [user?.role]);

  const searchHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return navItems.slice(0, 8);
    return navItems.filter(
      (item) => item.label.toLowerCase().includes(q) || item.path.toLowerCase().includes(q),
    );
  }, [navItems, query]);

  const quickAddItems = useMemo(
    () => QUICK_CREATE.filter((item) => !item.roles || item.roles.includes(user?.role || "")),
    [user?.role],
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!canSeeNotes) return;
    const dispatch = getAppDispatch();
    if (dispatch) NotificationService.getAllNotifications({ page: 1, page_size: 1 }, dispatch);
  }, [canSeeNotes]);

  useEffect(() => {
    if (!openMenu) return undefined;
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const go = (path: string) => {
    setOpenMenu(null);
    setQuery("");
    navigate(path);
  };

  const toggle = (key: Exclude<MenuKey, null>) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  return (
    <header className="admin-header" ref={rootRef}>
      <button
        type="button"
        className="admin-header__menu"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <MdMenu size={22} />
      </button>

      <Link to="/dashboard" className="admin-header__brand">
        <img src={BRAND.logo} alt={BRAND.name} className="admin-header__logo" />
        <span className="admin-header__brand-text">Admin Panel</span>
      </Link>

      <div className="admin-header__search-wrap">
        <label className="admin-header__search">
          <MdSearch className="admin-header__search-icon" size={16} aria-hidden />
          <input
            type="search"
            value={query}
            placeholder="Search anything here.."
            aria-label="Search admin sections"
            aria-expanded={openMenu === "search"}
            aria-controls="admin-header-search-results"
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenMenu("search");
            }}
            onFocus={() => setOpenMenu("search")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchHits[0]) {
                e.preventDefault();
                go(searchHits[0].path);
              }
              if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                onSearchClick?.();
              }
            }}
          />
          <kbd
            role="button"
            tabIndex={0}
            title="Open command palette"
            onClick={(e) => {
              e.preventDefault();
              onSearchClick?.();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSearchClick?.();
              }
            }}
          >
            {shortcut}
          </kbd>
        </label>
        {openMenu === "search" ? (
          <div
            id="admin-header-search-results"
            className="admin-header__dropdown admin-header__dropdown--search"
            role="listbox"
          >
            {searchHits.length === 0 ? (
              <p className="admin-header__dropdown-empty">No matching sections.</p>
            ) : (
              searchHits.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  className="admin-header__dropdown-item"
                  role="option"
                  onClick={() => go(item.path)}
                >
                  <span>{item.label}</span>
                  <span className="admin-header__dropdown-path">{item.path}</span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>

      <div className="admin-header__actions">
        <button
          type="button"
          className="admin-header__icon"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        >
          {theme === "dark" ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
        </button>

        <button
          type="button"
          className="admin-header__icon"
          aria-label="Notifications"
          onClick={() => navigate("/notifications")}
        >
          <MdNotificationsNone size={20} />
          {canSeeNotes && noteCount > 0 ? (
            <span className="admin-header__badge">{noteCount > 9 ? "9+" : noteCount}</span>
          ) : null}
        </button>

        <div className="admin-header__avatars">
          <div className="admin-header__action admin-header__action--add">
            <button
              type="button"
              className="admin-header__add"
              aria-label="Quick create"
              aria-expanded={openMenu === "add"}
              onClick={() => toggle("add")}
            >
              <MdAdd size={20} />
            </button>
            {openMenu === "add" ? (
              <div className="admin-header__dropdown admin-header__dropdown--right" role="menu">
                {quickAddItems.length === 0 ? (
                  <p className="admin-header__dropdown-empty">No create actions available.</p>
                ) : (
                  quickAddItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="admin-header__dropdown-item"
                      role="menuitem"
                      onClick={() => go(item.href)}
                    >
                      {item.label}
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="admin-header__user">
          <button
            type="button"
            className="admin-header__chip"
            aria-expanded={openMenu === "user"}
            onClick={() => toggle("user")}
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="admin-header__chip-avatar" />
            ) : (
              <span className="admin-header__chip-avatar">{initial}</span>
            )}
            <span className="admin-header__chip-copy">
              <strong>{firstName}</strong>
              {user?.role ? <em>{String(user.role).replace("_", " ")}</em> : null}
            </span>
          </button>
          {openMenu === "user" ? (
            <div className="admin-header__dropdown admin-header__dropdown--right" role="menu">
              <button type="button" className="admin-header__dropdown-item" onClick={() => go("/dashboard")}>
                Overview
              </button>
              <button
                type="button"
                className="admin-header__dropdown-item is-danger"
                onClick={() => {
                  setOpenMenu(null);
                  AuthService.logout();
                }}
              >
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
