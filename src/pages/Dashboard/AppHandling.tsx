import { memo } from "react";
import { useNavigate } from "react-router-dom";

const TILES = [
  { title: "Assessment", copy: "Activity, goals, diet, food interest", href: "/activity-level" },
  { title: "Scan desk", copy: "Barcodes and pack photos", href: "/scans" },
  { title: "Ingredients", copy: "What is printed on pack", href: "/ingredients" },
  { title: "Brands", copy: "Search and store filters", href: "/brands" },
  { title: "Servings", copy: "g / ml on the facts panel", href: "/servings" },
  { title: "App desk", copy: "Everything the live app handles", href: "/app" },
];

function AppHandling() {
  const navigate = useNavigate();

  return (
    <section className="app-handling">
      {TILES.map((tile) => (
        <button key={tile.href} type="button" className="safety-strip__tile" onClick={() => navigate(tile.href)}>
          <span>{tile.title}</span>
          <strong>Open</strong>
          <em>{tile.copy}</em>
        </button>
      ))}
    </section>
  );
}

export default memo(AppHandling);
