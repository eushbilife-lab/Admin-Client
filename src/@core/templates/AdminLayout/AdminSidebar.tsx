import { useState } from "react";
import { NavLink } from "react-router-dom";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useAppSelector } from "redux/hooks";
import AuthService from "services/auth.service";
import { config } from "config";
import { displayNameOf } from "constants/brand";
import { getSidebarGroups } from "./sidebarNav";
import "./AdminSidebar.css";

type AdminSidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function AdminSidebar({ open = true, onClose }: AdminSidebarProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const groups = getSidebarGroups(user?.role);
  const displayName = displayNameOf(user);
  const displayEmail = user?.email || "";
  const initial = String(displayName).charAt(0).toUpperCase();
  const avatarSrc = user?.profileImage ? config.API_URL + user.profileImage : "";

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
        <nav className="admin-sidebar__nav" aria-label="Main">
          {groups.map((group, index) => (
            <div key={group.label || `group-${index}`} className="admin-sidebar__group">
              {group.label ? <p className="admin-sidebar__group-label">{group.label}</p> : null}
              {group.items.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `admin-sidebar__link ${isActive ? "is-active" : ""}`
                  }
                  onClick={onClose}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
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
              {user?.role ? <span className="admin-sidebar__role">{user.role}</span> : null}
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
