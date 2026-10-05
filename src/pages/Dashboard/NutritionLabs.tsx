import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { NutritionLab } from "services/dashboard.service";

const ORDER = ["nutrients", "rda", "catalog", "tree", "dynamics", "queue", "reviews", "users"];

function NutritionLabs({ labs }: { labs: NutritionLab[] }) {
  const navigate = useNavigate();
  const ordered = ORDER.map((id) => labs.find((lab) => lab.id === id)).filter(Boolean) as NutritionLab[];

  return (
    <section className="nutrition-labs">
      <div className="nutrition-labs__head">
        <div>
          <h2>Science libraries</h2>
          <p>Reference data the catalog, scores, and household goals all share.</p>
        </div>
      </div>
      <div className="nutrition-labs__grid">
        {ordered.map((lab) => (
          <button key={lab.id} type="button" className={`lab-card is-${lab.tone}`} onClick={() => navigate(lab.href)}>
            <strong>{lab.title}</strong>
            <span className="lab-card__count">{lab.count.toLocaleString()}</span>
            <em>{lab.blurb}</em>
          </button>
        ))}
      </div>
    </section>
  );
}

export default memo(NutritionLabs);
