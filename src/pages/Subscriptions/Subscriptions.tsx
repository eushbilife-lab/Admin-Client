import PageShell from "@core/templates/PageShell";
import { MOCK_PLANS } from "mocks/nutritionProduct.mock";
import "./Subscriptions.css";

export default function Subscriptions() {
  const mrr = MOCK_PLANS.reduce((sum, plan) => sum + plan.mrr, 0);
  const paid = MOCK_PLANS.filter((p) => p.price > 0).reduce((sum, p) => sum + p.active, 0);

  return (
    <PageShell
      kicker="Revenue"
      title="Subscriptions"
      subtitle="Plans, active seats, and MRR. Wired to mock data until Stripe admin endpoints land."
    >
      <div className="subs-summary">
        <article>
          <p>MRR</p>
          <strong>${mrr.toLocaleString()}</strong>
        </article>
        <article>
          <p>Paid subscribers</p>
          <strong>{paid.toLocaleString()}</strong>
        </article>
        <article>
          <p>Failed payments (30d)</p>
          <strong>24</strong>
        </article>
        <article>
          <p>Refunds (30d)</p>
          <strong>$860</strong>
        </article>
      </div>

      <div className="subs-grid">
        {MOCK_PLANS.map((plan) => (
          <article key={plan.id} className="subs-card">
            <header>
              <h2>{plan.name}</h2>
              <strong>
                {plan.price === 0 ? "Free" : `$${plan.price}/${plan.interval}`}
              </strong>
            </header>
            <p>
              {plan.active.toLocaleString()} active · ${plan.mrr.toLocaleString()} MRR
            </p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="subs-ops">
        <h2>Ops queue</h2>
        <ul>
          <li>
            <strong>Failed payment</strong>
            <span>user_3912 · Plus · retry in 2 days</span>
          </li>
          <li>
            <strong>Refund request</strong>
            <span>user_2201 · Pro · $29.99</span>
          </li>
          <li>
            <strong>Coupon</strong>
            <span>LAUNCH20 · 20% off Plus · 86 redemptions</span>
          </li>
        </ul>
      </section>
    </PageShell>
  );
}
