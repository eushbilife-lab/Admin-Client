import { memo } from "react";
import { useNavigate } from "react-router-dom";

const cards = [
  { key: "products", title: "Foods", hint: "Live in the catalog", suffix: "", href: "/products" },
  { key: "pending", title: "In review", hint: "Waiting on a dietitian", suffix: "", href: "/queue" },
  { key: "completeness", title: "Facts panel", hint: "Labels with nutrition facts", suffix: "%", href: "/products" },
  { key: "members", title: "Households", hint: "People using the app", suffix: "", href: "/users" },
] as const;

function KpiCards({ kpis }: { kpis: Record<string, number> }) {
  const navigate = useNavigate();

  return (
    <div className="stats-rail">
      {cards.map(({ key, title, hint, suffix, href }) => (
        <button
          key={key}
          type="button"
          className="stats-rail__item"
          onClick={() => navigate(href)}
        >
          <span className="stats-rail__label">{title}</span>
          <strong>
            {Number(kpis[key] || 0).toLocaleString()}
            {suffix}
          </strong>
          <em>{hint}</em>
        </button>
      ))}
    </div>
  );
}

export default memo(KpiCards);
