import { useCallback, useState, ReactNode } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import CommandPalette from "./CommandPalette";
import useHotkey from "hooks/useHotkey";
import "./AdminLayout.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const togglePalette = useCallback(() => setPaletteOpen((value) => !value), []);

  useHotkey("k", togglePalette, { meta: true });

  return (
    <div className="admin-layout">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} onSearchClick={openPalette} />
      <div className="admin-layout__body">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="admin-layout__content">{children}</main>
      </div>
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </div>
  );
}
