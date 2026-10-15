import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageShell from "@core/templates/PageShell";
import CircleLoader from "@core/basic-components/CircleLoader";
import ProductMetricsService, {
  type DateRangeKey,
  type ProductKpis,
  type MetricPoint,
} from "services/productMetrics.service";
import "./Analytics.css";

const RANGES: { key: DateRangeKey; label: string }[] = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
];

const FUNNEL_COLORS = ["#74941F", "#9FC53A", "#BCD675", "#0068F7"];

function Delta({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span className={`analytics-delta ${up ? "is-up" : "is-down"}`}>
      {up ? "+" : ""}
      {value.toFixed(1)}% vs prior
    </span>
  );
}

export default function Analytics() {
  const [range, setRange] = useState<DateRangeKey>("30d");
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<ProductKpis | null>(null);
  const [meals, setMeals] = useState<MetricPoint[]>([]);
  const [signups, setSignups] = useState<MetricPoint[]>([]);
  const [funnel, setFunnel] = useState<{ stage: string; value: number; rate: number; unavailable?: boolean }[]>([]);
  const [topFoods, setTopFoods] = useState<{ name: string; logs: number; kcal: number }[]>([]);
  const [source, setSource] = useState<"live" | "mock">("mock");
  const [billingAvailable, setBillingAvailable] = useState(false);
  const [insight, setInsight] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    ProductMetricsService.overview(range).then((data) => {
      if (cancelled) return;
      setKpis(data.kpis);
      setMeals(data.meals);
      setSignups(data.signups);
      setFunnel(data.funnel);
      setTopFoods(data.topFoods);
      setSource(data.source);
      setBillingAvailable(data.billingAvailable);
      setInsight(data.insight);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [range]);

  return (
    <PageShell
      kicker="Product"
      title="Analytics"
      subtitle={
        source === "live"
          ? "Live from app signups, meal logs, and daily activity."
          : "Showing demo metrics — live Admin analytics endpoint unavailable."
      }
      actions={
        <div className="analytics-toolbar">
          <span className={`analytics-source is-${source}`}>{source === "live" ? "Live data" : "Demo data"}</span>
          <div className="analytics-range" role="group" aria-label="Date range">
            {RANGES.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`analytics-range__btn${range === item.key ? " is-active" : ""}`}
                onClick={() => setRange(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      {loading && !kpis ? <CircleLoader /> : null}

      {insight ? <p className="analytics-insight">{insight}</p> : null}

      {kpis ? (
        <>
          <div className="analytics-kpi-grid">
            <article className="analytics-kpi">
              <p>DAU</p>
              <strong>{kpis.dau.toLocaleString()}</strong>
              <Delta value={kpis.dauDelta} />
            </article>
            <article className="analytics-kpi">
              <p>MAU</p>
              <strong>{kpis.mau.toLocaleString()}</strong>
              {kpis.mauDelta ? <Delta value={kpis.mauDelta} /> : null}
            </article>
            <article className="analytics-kpi">
              <p>Meals logged</p>
              <strong>{kpis.mealsLogged.toLocaleString()}</strong>
              <Delta value={kpis.mealsDelta} />
            </article>
            <article className={`analytics-kpi${!billingAvailable ? " is-muted" : ""}`}>
              <p>MRR</p>
              <strong>{billingAvailable ? `$${kpis.mrr.toLocaleString()}` : "—"}</strong>
              {billingAvailable ? <Delta value={kpis.mrrDelta} /> : <span className="analytics-delta">No billing yet</span>}
            </article>
            <article className="analytics-kpi">
              <p>New signups</p>
              <strong>{kpis.newSignups.toLocaleString()}</strong>
            </article>
            <article className={`analytics-kpi${!billingAvailable ? " is-muted" : ""}`}>
              <p>Premium conversion</p>
              <strong>{billingAvailable ? `${kpis.premiumConversion}%` : "—"}</strong>
            </article>
            <article className={`analytics-kpi${!billingAvailable ? " is-muted" : ""}`}>
              <p>Churn</p>
              <strong>{billingAvailable ? `${kpis.churn}%` : "—"}</strong>
            </article>
            <article className="analytics-kpi">
              <p>Goal completion</p>
              <strong>{kpis.goalCompletion}%</strong>
            </article>
          </div>

          <div className="analytics-charts">
            <section className="panel-card analytics-card">
              <div className="analytics-card__head">
                <div>
                  <p className="panel-card__title">Meals logged</p>
                  <p className="panel-card__subtitle">Daily meal logs vs prior period</p>
                </div>
              </div>
              <div className="analytics-card__chart is-tall">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={meals} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mealsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9FC53A" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#9FC53A" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                    <Tooltip />
                    <Area type="monotone" dataKey="prev" stroke="#C7C7C7" strokeWidth={1.5} fill="transparent" name="Prior" strokeDasharray="4 4" />
                    <Area type="monotone" dataKey="value" stroke="#9FC53A" strokeWidth={2.25} fill="url(#mealsFill)" name="Meals" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="panel-card analytics-card">
              <div className="analytics-card__head">
                <div>
                  <p className="panel-card__title">New signups</p>
                  <p className="panel-card__subtitle">Daily registrations</p>
                </div>
              </div>
              <div className="analytics-card__chart is-tall">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={signups} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0068F7" radius={[4, 4, 0, 0]} name="Signups" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <div className="analytics-charts">
            <section className="panel-card">
              <div className="analytics-card__head">
                <div>
                  <p className="panel-card__title">Activation funnel</p>
                  <p className="panel-card__subtitle">Signup → first log → active → premium</p>
                </div>
              </div>
              <ul className="analytics-funnel">
                {funnel.map((step, i) => (
                  <li key={step.stage} className={step.unavailable ? "is-unavailable" : undefined}>
                    <div className="analytics-funnel__meta">
                      <strong>{step.stage}</strong>
                      <span>
                        {step.unavailable
                          ? "Not tracked yet"
                          : `${step.value.toLocaleString()} · ${step.rate}%`}
                      </span>
                    </div>
                    <div className="analytics-funnel__track">
                      <div
                        className="analytics-funnel__fill"
                        style={{
                          width: `${step.unavailable ? 0 : step.rate}%`,
                          background: FUNNEL_COLORS[i],
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel-card">
              <div className="analytics-card__head">
                <div>
                  <p className="panel-card__title">Top foods logged</p>
                  <p className="panel-card__subtitle">Most common diary items</p>
                </div>
              </div>
              {topFoods.length === 0 ? (
                <p className="analytics-empty">No meal logs in this range.</p>
              ) : (
                <div className="analytics-card__chart is-tall">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topFoods} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
                      <CartesianGrid stroke="var(--border-color)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={128}
                        tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip />
                      <Bar dataKey="logs" name="Logs" radius={[0, 4, 4, 0]}>
                        {topFoods.map((_, i) => (
                          <Cell key={i} fill={i % 2 ? "#9FC53A" : "#74941F"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>
          </div>
        </>
      ) : null}
    </PageShell>
  );
}
