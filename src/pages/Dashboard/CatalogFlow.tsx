import { memo } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  { n: "01", title: "Nutrients", href: "/nutrient" },
  { n: "02", title: "Daily values", href: "/rda" },
  { n: "03", title: "Ingredients", href: "/ingredients" },
  { n: "04", title: "Allergens", href: "/allergies" },
  { n: "05", title: "Catalog", href: "/products" },
  { n: "06", title: "Scan desk", href: "/scans" },
  { n: "07", title: "Scores", href: "/scores" },
  { n: "08", title: "Households", href: "/users" },
];

function CatalogFlow() {
  const navigate = useNavigate();

  return (
    <section className="catalog-flow">
      <div className="catalog-flow__head">
        <h2>Path to a scored food</h2>
        <p>Science first, then the product, then the score that households see.</p>
      </div>
      <ol className="catalog-flow__steps">
        {STEPS.map((step) => (
          <li key={step.href}>
            <button type="button" className="catalog-flow__step" onClick={() => navigate(step.href)}>
              <span>{step.n}</span>
              <strong>{step.title}</strong>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default memo(CatalogFlow);
