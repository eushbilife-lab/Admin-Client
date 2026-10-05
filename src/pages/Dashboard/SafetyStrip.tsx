import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { NutritionLab } from "services/dashboard.service";

const SAFETY_IDS = ["allergies", "intolerance", "lifestyle", "scores"] as const;

function SafetyStrip({ labs }: { labs: NutritionLab[] }) {
  const navigate = useNavigate();
  const tiles = SAFETY_IDS.map((id) => labs.find((lab) => lab.id === id)).filter(Boolean) as NutritionLab[];

  if (!tiles.length) return null;

  return (
    <section className="safety-strip">
      {tiles.map((lab) => (
        <button key={lab.id} type="button" className={`safety-strip__tile is-${lab.tone}`} onClick={() => navigate(lab.href)}>
          <span>{lab.title}</span>
          <strong>{lab.count.toLocaleString()}</strong>
          <em>{lab.blurb}</em>
        </button>
      ))}
    </section>
  );
}

export default memo(SafetyStrip);
