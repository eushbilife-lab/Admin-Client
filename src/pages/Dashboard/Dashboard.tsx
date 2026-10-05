import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdRefresh } from "react-icons/md";
import { useAppSelector } from "redux/hooks";
import {
  emptyDashboard,
  loadDashboardOverview,
  type DashboardOverview,
} from "services/dashboard.service";
import { displayNameOf } from "constants/brand";
import KpiCards from "./KpiCards";
import AnalyticsOverview from "./AnalyticsOverview";
import LabelCoverage from "./PopularCategories";
import DashListCard from "./DashListCard";
import NutritionLabs from "./NutritionLabs";
import CatalogFlow from "./CatalogFlow";
import WorkBoard from "./WorkBoard";
import SafetyStrip from "./SafetyStrip";
import AppHandling from "./AppHandling";
import "./Dashboard.css";

function timeAgo(value?: string) {
  if (!value) return "";
  const mins = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [data, setData] = useState<DashboardOverview>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = () => {
    setLoading(true);
    loadDashboardOverview()
      .then((overview) => {
        setData(overview);
        setUpdatedAt(new Date());
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const recentItems = useMemo(
    () =>
      data.recentProducts.map((item) => ({
        id: item._id,
        name: item.productName || "Untitled food",
        email: item.brand,
        trailing: timeAgo(item.createdAt),
        image: item.productImages?.[0] || item.image_url,
        href: `/update-product/${item._id}`,
      })),
    [data.recentProducts]
  );

  const missingItems = useMemo(
    () =>
      data.missingLabels.map((item) => ({
        id: item._id,
        name: item.productName || "Untitled food",
        email: item.brand || "Needs energy, macros, micros",
        trailing: "Incomplete",
        badge: "warn" as const,
        href: `/update-product/${item._id}`,
      })),
    [data.missingLabels]
  );

  const firstName = displayNameOf(user).split(" ")[0];
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const waiting = data.kpis.pending + missingItems.length;
  const firstLoad = loading && data.kpis.products === 0 && !updatedAt;

  return (
    <div className={`dashboard-page${firstLoad ? " is-loading" : ""}`}>
      <section className="dash-banner">
        <div className="dash-banner__intro">
          <p className="dash-banner__date">{today}</p>
          <h1>Hi, {firstName}</h1>
          <p>
            {waiting > 0
              ? `${firstName}, ${waiting} ${waiting === 1 ? "food still needs" : "foods still need"} facts, review, or a score before they belong in the live catalog.`
              : data.insight}
          </p>
          <div className="dash-banner__cta">
            <button type="button" className="desk-btn is-primary" onClick={() => navigate("/add-product")}>
              <MdAdd size={18} />
              Add food
            </button>
            <button type="button" className="desk-btn" onClick={() => navigate("/queue")}>
              Review queue
            </button>
            <button type="button" className="desk-btn is-ghost" onClick={load} aria-label="Refresh">
              <MdRefresh size={18} className={loading ? "is-spinning" : ""} />
              {updatedAt ? timeAgo(updatedAt.toISOString()) : "Refresh"}
            </button>
          </div>
        </div>
        <KpiCards kpis={data.kpis} />
      </section>

      <AppHandling />

      <div className="dash-bento">
        <WorkBoard
          pending={data.kpis.pending}
          drafts={Number(data.pendingActions.find((item) => item.id === "drafts")?.count || 0)}
          missing={missingItems}
          onQueue={() => navigate("/queue")}
        />
        <LabelCoverage
          items={data.coverage}
          completeness={data.kpis.completeness}
          fopl={data.kpis.foplCoverage}
        />
        <SafetyStrip labs={data.labs} />
        <AnalyticsOverview data={data.series.products} />
        <DashListCard
          title="Just added"
          empty="No foods in the catalog yet."
          onViewAll={() => navigate("/products")}
          items={recentItems}
        />
        <CatalogFlow />
        <NutritionLabs labs={data.labs} />
      </div>
    </div>
  );
}
