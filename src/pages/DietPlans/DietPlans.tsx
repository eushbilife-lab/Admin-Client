import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Skeleton, Tab, Tabs } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import dietPlanService from "services/dietPlan.service";
import ToasterService from "utils/toaster.util";
import DietPlanGallery from "./DietPlanGallery";
import DietPlanDocuments from "./DietPlanDocuments";
import DietPlanTemplates from "./DietPlanTemplates";
import "./DietPlans.css";

type TabKey = "overview" | "gallery" | "documents" | "templates";

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "gallery", label: "App gallery" },
  { key: "documents", label: "Generated PDFs" },
  { key: "templates", label: "Day templates" },
];

export default function DietPlans() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = (searchParams.get("tab") || "overview") as TabKey;
  const tab: TabKey = TABS.some((t) => t.key === tabParam) ? tabParam : "overview";

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    const [success, error]: any = await dietPlanService.stats();
    setLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Failed to load diet plan stats"
      );
      return;
    }
    setStats(success?.data?.data || null);
  }, []);

  useEffect(() => {
    if (tab === "overview") void loadStats();
  }, [tab, loadStats]);

  const tabIndex = useMemo(
    () => Math.max(0, TABS.findIndex((t) => t.key === tab)),
    [tab]
  );

  const setTab = (key: TabKey) => {
    setSearchParams(key === "overview" ? {} : { tab: key });
  };

  return (
    <PageShell
      kicker="Content"
      title="Diet plans"
      subtitle="Gallery images for the app, personalized day plans with PDFs, and loss / maintain / gain / PCOS templates."
      actions={
        <Button
          variant="outlined"
          onClick={() => {
            if (tab === "overview") void loadStats();
            else setTab("overview");
          }}
        >
          Refresh
        </Button>
      }
    >
      <Tabs
        value={tabIndex}
        onChange={(_e, idx) => setTab(TABS[idx].key)}
        sx={{ mb: 2, borderBottom: "1px solid #e5ebe5" }}
      >
        {TABS.map((t) => (
          <Tab key={t.key} label={t.label} />
        ))}
      </Tabs>

      {tab === "overview" ? (
        <div className="diet-tab">
          {loading ? <Skeleton height={180} sx={{ borderRadius: 2 }} /> : null}
          {!loading && stats ? (
            <>
              <div className="diet-stats">
                <article className="diet-stat">
                  <span>Gallery cards</span>
                  <strong>{stats.gallery?.total ?? 0}</strong>
                  <small>{stats.gallery?.published ?? 0} published</small>
                </article>
                <article className="diet-stat">
                  <span>Generated PDFs</span>
                  <strong>{stats.documents?.total ?? 0}</strong>
                  <small>{stats.documents?.last7Days ?? 0} in last 7 days</small>
                </article>
                <article className="diet-stat">
                  <span>Day templates</span>
                  <strong>{stats.templates?.length ?? 0}</strong>
                  <small>Loss · Maintain · Gain · PCOS</small>
                </article>
              </div>

              <div className="diet-overview-grid">
                <section className="diet-detail__card">
                  <h3>By template</h3>
                  <ul className="diet-bars">
                    {(stats.documents?.byTemplate || []).map((row: any) => (
                      <li key={row.templateId}>
                        <span>{row.templateId}</span>
                        <strong>{row.count}</strong>
                      </li>
                    ))}
                    {!stats.documents?.byTemplate?.length ? (
                      <li className="diet-muted">No generated plans yet.</li>
                    ) : null}
                  </ul>
                  <Button
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => setTab("documents")}
                  >
                    Browse PDFs
                  </Button>
                </section>

                <section className="diet-detail__card">
                  <h3>By goal</h3>
                  <ul className="diet-bars">
                    {(stats.documents?.byGoal || []).map((row: any) => (
                      <li key={row.goal}>
                        <span>{row.goal || "unknown"}</span>
                        <strong>{row.count}</strong>
                      </li>
                    ))}
                    {!stats.documents?.byGoal?.length ? (
                      <li className="diet-muted">No goal breakdown yet.</li>
                    ) : null}
                  </ul>
                  <Button
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => setTab("templates")}
                  >
                    View templates
                  </Button>
                </section>

                <section className="diet-detail__card">
                  <h3>By source</h3>
                  <ul className="diet-bars">
                    {(stats.documents?.bySource || []).map((row: any) => (
                      <li key={row.source}>
                        <span>{row.source}</span>
                        <strong>{row.count}</strong>
                      </li>
                    ))}
                    {!stats.documents?.bySource?.length ? (
                      <li className="diet-muted">No source data yet.</li>
                    ) : null}
                  </ul>
                  <Button
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => setTab("gallery")}
                  >
                    Manage gallery
                  </Button>
                </section>
              </div>

              <section className="diet-detail__card" style={{ marginTop: 16 }}>
                <header className="store-order-card__head">
                  <h3>Recent generated plans</h3>
                  <Button size="small" onClick={() => setTab("documents")}>
                    View all
                  </Button>
                </header>
                <ul className="diet-recent">
                  {(stats.recentDocuments || []).map((d: any) => {
                    const u = d.user || {};
                    const name =
                      [u.firstName, u.lastName].filter(Boolean).join(" ") ||
                      "Member";
                    return (
                      <li key={d.id || d._id}>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/diet-plans/documents/${d.id || d._id}`)
                          }
                        >
                          <strong>{d.title || d.templateId}</strong>
                          <span>
                            {name} · {d.templateId} ·{" "}
                            {d.createdAt
                              ? new Date(d.createdAt).toLocaleDateString()
                              : ""}
                          </span>
                        </button>
                        {d.pdfUrl ? (
                          <a href={d.pdfUrl} target="_blank" rel="noreferrer">
                            PDF
                          </a>
                        ) : null}
                      </li>
                    );
                  })}
                  {!stats.recentDocuments?.length ? (
                    <li className="diet-muted">No documents generated yet.</li>
                  ) : null}
                </ul>
              </section>
            </>
          ) : null}
        </div>
      ) : null}

      {tab === "gallery" ? <DietPlanGallery /> : null}
      {tab === "documents" ? <DietPlanDocuments /> : null}
      {tab === "templates" ? <DietPlanTemplates /> : null}
    </PageShell>
  );
}
