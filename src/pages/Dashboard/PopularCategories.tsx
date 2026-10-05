import { memo } from "react";
import type { CoverageSlice } from "services/dashboard.service";

function LabelCoverage({
  items = [],
  completeness = 0,
  fopl = 0,
}: {
  items?: CoverageSlice[];
  completeness?: number;
  fopl?: number;
}) {
  const labeled = items.find((item) => item.id === "labeled")?.value || 0;
  const missing = items.find((item) => item.id === "missing")?.value || 0;
  const total = labeled + missing || 1;

  return (
    <section className="nfp">
      <h2>Nutrition Facts</h2>
      <p>Completeness of sampled labels</p>
      <div className="nfp__hero">
        <strong>{completeness}</strong>
        <span>%</span>
      </div>
      <div className="nfp__track" aria-hidden="true">
        <b style={{ width: `${Math.min(100, (labeled / total) * 100)}%` }} />
      </div>
      <ul className="nfp__rows">
        <li>
          Full facts panel
          <em>{labeled}</em>
        </li>
        <li>
          Missing panel
          <em>{missing}</em>
        </li>
        <li>
          Front-of-pack marks
          <em>{fopl}%</em>
        </li>
      </ul>
    </section>
  );
}

export default memo(LabelCoverage);
