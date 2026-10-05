import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import { useAppSelector } from "redux/hooks";
import { QUICK_CREATE } from "constants/adminCommands";
import "./QuickCreate.css";

export default function QuickCreate() {
  const navigate = useNavigate();
  const role = useAppSelector((state) => state.auth.user?.role);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const items = QUICK_CREATE.filter((item) => !item.roles || item.roles.includes(role || ""));

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="quick-create" ref={rootRef}>
      <button
        type="button"
        className="quick-create__button"
        aria-label="Create"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <MdAdd size={18} />
        <span>Add food</span>
      </button>
      {open ? (
        <div className="quick-create__menu" role="menu">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                navigate(item.href);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
