import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdMenu, MdNotificationsNone, MdSearch } from "react-icons/md";
import { useAppSelector } from "redux/hooks";
import AuthService from "services/auth.service";
import NotificationService from "services/notification.service";
import { getAppDispatch } from "utils/dispatch.util";
import { config } from "config";
import { BRAND, displayNameOf } from "constants/brand";
import QuickCreate from "./QuickCreate";
import "./AdminHeader.css";

type AdminHeaderProps = {
  onMenuClick?: () => void;
  onSearchClick?: () => void;
};

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export default function AdminHeader({ onMenuClick, onSearchClick }: AdminHeaderProps) {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const noteCount = useAppSelector((state) => state.notification.count);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const name = displayNameOf(user);
  const firstName = name.split(" ")[0];
  const initial = name.charAt(0).toUpperCase();
  const avatarSrc = user?.profileImage ? config.API_URL + user.profileImage : "";
  const shortcut = useMemo(() => (isMac ? "⌘K" : "Ctrl K"), []);
  const canSeeNotes = user?.role === "admin";

  useEffect(() => {
    if (!canSeeNotes) return;
    const dispatch = getAppDispatch();
    if (dispatch) NotificationService.getAllNotifications({ page: 1, page_size: 1 }, dispatch);
  }, [canSeeNotes]);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  return (
    <header className="admin-header">
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
        <span className="admin-header__brand-copy">
          <span className="admin-header__brand-text">{BRAND.name}</span>
          <span className="admin-header__live">{BRAND.console}</span>
        </span>
      </Link>

      <button type="button" className="admin-header__search" onClick={onSearchClick}>
        <MdSearch size={17} />
        <span>Scan a barcode or search foods</span>
        <kbd>{shortcut}</kbd>
      </button>

      <div className="admin-header__actions">
        <QuickCreate />
        <button
          type="button"
          className="admin-header__icon"
          aria-label="Notifications"
          onClick={() => navigate("/notifications")}
        >
          <MdNotificationsNone size={21} />
          {canSeeNotes && noteCount > 0 ? (
            <span className="admin-header__badge">{noteCount > 9 ? "9+" : noteCount}</span>
          ) : null}
        </button>
        <div className="admin-header__user" ref={menuRef}>
          <button
            type="button"
            className="admin-header__chip"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="" />
            ) : (
              <span className="admin-header__avatar">{initial}</span>
            )}
            <span className="admin-header__chip-copy">
              <strong>{firstName}</strong>
              {user?.role ? <em>{String(user.role).replace("_", " ")}</em> : null}
            </span>
          </button>
          {menuOpen ? (
            <div className="admin-header__dropdown">
              <button type="button" onClick={() => navigate("/dashboard")}>
                Overview
              </button>
              <button
                type="button"
                className="is-danger"
                onClick={() => {
                  setMenuOpen(false);
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
