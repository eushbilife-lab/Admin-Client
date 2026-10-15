import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdRefresh } from "react-icons/md";
import { useAppSelector } from "redux/hooks";
import {
  emptyDashboard,
  loadDashboardOverview,
  type DashboardOverview,
} from "services/dashboard.service";
import ProductMetricsService, { type ProductKpis } from "services/productMetrics.service";
import { displayNameOf } from "constants/brand";
import KpiCards from "./KpiCards";
import DashListCard from "./DashListCard";
import WorkBoard from "./WorkBoard";
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
  const [product, setProduct] = useState<ProductKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([loadDashboardOverview(), ProductMetricsService.overview("7d")])
      .then(([overview, metrics]) => {
        setData(overview);
        setProduct(metrics.kpis);
        setUpdatedAt(new Date());
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const recentItems = useMemo(
    () =>
      data.recentProducts.slice(0, 6).map((item) => ({
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
      data.missingLabels.slice(0, 3).map((item) => ({
        id: item._id,
        name: item.productName || "Untitled food",
        email: item.brand || "Needs nutrition facts",
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
              ? `${waiting} ${waiting === 1 ? "food needs" : "foods need"} review before going live.`
              : "Catalog looks clear. Add a food or check the queue when you are ready."}
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

      {product ? (
        <button type="button" className="product-pulse" onClick={() => navigate("/analytics")}>
          <span className="product-pulse__label">Product · 7d</span>
          <span>
            <strong>{product.dau.toLocaleString()}</strong> DAU
          </span>
          <span>
            <strong>{product.mealsLogged.toLocaleString()}</strong> meals
          </span>
          <span>
            <strong>${product.mrr.toLocaleString()}</strong> MRR
          </span>
          <span>
            <strong>{product.premiumConversion}%</strong> premium
          </span>
          <em>Open analytics →</em>
        </button>
      ) : null}

      <div className="dash-bento dash-bento--simple">
        <WorkBoard
          pending={data.kpis.pending}
          drafts={Number(data.pendingActions.find((item) => item.id === "drafts")?.count || 0)}
          missing={missingItems}
          onQueue={() => navigate("/queue")}
        />
        <DashListCard
          title="Just added"
          empty="No foods in the catalog yet."
          onViewAll={() => navigate("/products")}
          items={recentItems}
        />
      </div>
    </div>
  );
}
