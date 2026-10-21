import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { NavLink, useLocation } from "react-router-dom";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { useAppSelector } from "redux/hooks";
import AuthService from "services/auth.service";
import { config } from "config";
import { displayNameOf } from "constants/brand";
import useDebouncedValue from "hooks/useDebouncedValue";
import {
  getSidebarGroups,
  scoreNavMatch,
  type NavGroup,
  type NavItem,
} from "./sidebarNav";
import "./AdminSidebar.css";

const FAV_KEY = "eushbi.admin.sidebar.favorites";
const OPEN_KEY = "eushbi.admin.sidebar.openGroups";

type AdminSidebarProps = {
  open?: boolean;
  onClose?: () => void;
  onOpenPalette?: () => void;
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

function flattenItems(groups: NavGroup[]) {
  return groups.flatMap((g) =>
    g.items.map((item) => ({ item, group: g }))
  );
}

export default function AdminSidebar({
  open = true,
  onClose,
  onOpenPalette,
}: AdminSidebarProps) {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 120);
  const [favorites, setFavorites] = useState<string[]>(() =>
    readJson<string[]>(FAV_KEY, [])
  );
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    readJson<Record<string, boolean>>(OPEN_KEY, {})
  );

  const groups = useMemo(() => getSidebarGroups(user?.role), [user?.role]);
  const allFlat = useMemo(() => flattenItems(groups), [groups]);

  const displayName = displayNameOf(user);
  const displayEmail = user?.email || "";
  const initial = String(displayName).charAt(0).toUpperCase();
  const avatarSrc = user?.profileImage
    ? /^https?:\/\//i.test(user.profileImage)
      ? user.profileImage
      : config.API_URL + user.profileImage
    : "";

  const isSearching = debouncedQuery.trim().length > 0;
  const shortcut = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      /Mac|iPhone|iPad/.test(navigator.platform)
        ? "⌘K"
        : "Ctrl K",
    []
  );

  // Auto-expand the group that contains the active route
  useEffect(() => {
    const activeGroup = groups.find((g) =>
      g.items.some(
        (item) =>
          location.pathname === item.path ||
          location.pathname.startsWith(`${item.path}/`)
      )
    );
    if (!activeGroup) return;
    setOpenGroups((prev) => {
      if (prev[activeGroup.id] !== false && prev[activeGroup.id] !== undefined) {
        return prev;
      }
      const next = { ...prev, [activeGroup.id]: true };
      writeJson(OPEN_KEY, next);
      return next;
    });
  }, [location.pathname, groups]);

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return allFlat
      .map(({ item, group }) => ({
        item,
        group,
        score: scoreNavMatch(debouncedQuery, item, group.label),
      }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 24);
  }, [allFlat, debouncedQuery, isSearching]);

  const favoriteItems = useMemo(() => {
    return favorites
      .map((path) => allFlat.find(({ item }) => item.path === path)?.item)
      .filter(Boolean) as NavItem[];
  }, [favorites, allFlat]);

  const isGroupOpen = (groupId: string) => {
    if (isSearching) return true;
    if (openGroups[groupId] === undefined) return true;
    return openGroups[groupId];
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      const current = prev[groupId] === undefined ? true : prev[groupId];
      const next = { ...prev, [groupId]: !current };
      writeJson(OPEN_KEY, next);
      return next;
    });
  };

  const toggleFavorite = (path: string, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(path)
        ? prev.filter((p) => p !== path)
        : [path, ...prev].slice(0, 12);
      writeJson(FAV_KEY, next);
      return next;
    });
  };

  const renderLink = (item: NavItem, opts?: { showHint?: boolean; groupLabel?: string }) => {
    const Icon = item.icon;
    const fav = favorites.includes(item.path);
    return (
      <NavLink
        key={item.path}
        to={item.path}
        title={item.hint || item.label}
        className={({ isActive }) =>
          `admin-sidebar__link${isActive ? " is-active" : ""}`
        }
        onClick={onClose}
        end={item.path === "/dashboard"}
      >
        <span className="admin-sidebar__icon" aria-hidden>
          <Icon size={18} />
        </span>
        <span className="admin-sidebar__link-text">
          <span className="admin-sidebar__link-label">{item.label}</span>
          {opts?.showHint && (item.hint || opts.groupLabel) ? (
            <span className="admin-sidebar__link-hint">
              {item.hint || opts.groupLabel}
            </span>
          ) : null}
        </span>
        <button
          type="button"
          className={`admin-sidebar__star${fav ? " is-on" : ""}`}
          aria-label={fav ? "Unpin" : "Pin to favorites"}
          title={fav ? "Unpin" : "Pin"}
          onClick={(e) => toggleFavorite(item.path, e)}
        >
          {fav ? (
            <StarRoundedIcon fontSize="inherit" />
          ) : (
            <StarBorderRoundedIcon fontSize="inherit" />
          )}
        </button>
      </NavLink>
    );
  };

  return (
    <>
      {open && (
        <button
          type="button"
          className="admin-sidebar__backdrop"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}
      <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
        <div className="admin-sidebar__search">
          <SearchRoundedIcon className="admin-sidebar__search-icon" fontSize="small" />
          <input
            ref={searchRef}
            type="search"
            className="admin-sidebar__search-input"
            placeholder="Search menu…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setQuery("");
                searchRef.current?.blur();
              }
            }}
            aria-label="Search sidebar menu"
          />
          {query ? (
            <button
              type="button"
              className="admin-sidebar__search-clear"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <ClearRoundedIcon fontSize="inherit" />
            </button>
          ) : (
            <button
              type="button"
              className="admin-sidebar__search-kbd"
              title="Open command palette"
              onClick={onOpenPalette}
            >
              {shortcut}
            </button>
          )}
        </div>

        <nav className="admin-sidebar__nav" aria-label="Main">
          {isSearching ? (
            <div className="admin-sidebar__group">
              <div className="admin-sidebar__group-head is-static">
                <div>
                  <p className="admin-sidebar__group-label">Results</p>
                  <p className="admin-sidebar__group-blurb">
                    {searchResults.length
                      ? `${searchResults.length} match${searchResults.length === 1 ? "" : "es"}`
                      : "No matches — try another word"}
                  </p>
                </div>
              </div>
              {searchResults.map(({ item, group }) =>
                renderLink(item, { showHint: true, groupLabel: group.label })
              )}
            </div>
          ) : (
            <>
              {favoriteItems.length ? (
                <div className="admin-sidebar__group">
                  <div className="admin-sidebar__group-head is-static">
                    <div>
                      <p className="admin-sidebar__group-label">Pinned</p>
                      <p className="admin-sidebar__group-blurb">Your shortcuts</p>
                    </div>
                  </div>
                  {favoriteItems.map((item) => renderLink(item))}
                </div>
              ) : null}

              {groups.map((group) => {
                const expanded = isGroupOpen(group.id);
                return (
                  <div
                    key={group.id}
                    className={`admin-sidebar__group${expanded ? " is-open" : ""}`}
                  >
                    <button
                      type="button"
                      className="admin-sidebar__group-head"
                      onClick={() => toggleGroup(group.id)}
                      aria-expanded={expanded}
                    >
                      <div>
                        <p className="admin-sidebar__group-label">{group.label}</p>
                        <p className="admin-sidebar__group-blurb">{group.blurb}</p>
                      </div>
                      <span className="admin-sidebar__group-meta">
                        <span className="admin-sidebar__group-count">
                          {group.items.length}
                        </span>
                        <ExpandMoreRoundedIcon
                          className={`admin-sidebar__chevron${expanded ? " is-open" : ""}`}
                          fontSize="small"
                        />
                      </span>
                    </button>
                    {expanded ? (
                      <div className="admin-sidebar__group-items">
                        {group.items.map((item) => renderLink(item))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </>
          )}
        </nav>

        <div className="admin-sidebar__footer">
          <button
            type="button"
            className={`admin-sidebar__user${menuOpen ? " is-open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="admin-sidebar__avatar" />
            ) : (
              <span className="admin-sidebar__avatar">{initial}</span>
            )}
            <div className="admin-sidebar__user-meta">
              <strong>{displayName}</strong>
              {displayEmail ? <span>{displayEmail}</span> : null}
              {user?.role ? (
                <span className="admin-sidebar__role">{user.role}</span>
              ) : null}
            </div>
          </button>
          {menuOpen ? (
            <div className="admin-sidebar__account-menu" role="menu">
              <button
                type="button"
                className="admin-sidebar__account-item is-danger"
                onClick={() => {
                  onClose?.();
                  AuthService.logout();
                }}
              >
                <LogoutRoundedIcon fontSize="small" />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}
