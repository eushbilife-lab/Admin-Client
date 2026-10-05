import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import CircleLoader from "@core/basic-components/CircleLoader";
import http from "services/http.service";
import Promisable from "services/promisable.service";
import "./ScanDesk.css";

type ScanFood = {
  _id: string;
  productName?: string;
  brand?: string;
  barcode?: string;
  productImages?: string[];
  image_url?: string;
  nf?: unknown[];
  ingredients?: unknown[];
  servingSize?: number;
};

const silent = { headers: { "X-Skip-Toast": "1" } };

function issuesOf(item: ScanFood) {
  const flags: string[] = [];
  if (!item.barcode || !String(item.barcode).trim()) flags.push("No barcode");
  if (!(item.productImages && item.productImages.length) && !item.image_url) flags.push("No pack photo");
  if (!item.nf?.length) flags.push("No facts panel");
  if (!item.ingredients?.length) flags.push("No ingredients");
  if (!item.servingSize) flags.push("No serving size");
  return flags;
}

export default function ScanDesk() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState<ScanFood[]>([]);

  useEffect(() => {
    http.setJWT();
    http.setLanguage();
    Promisable.asPromise(
      http.post("/products/query", { page: 1, page_size: 80, isDelete: false }, silent)
    ).then(([success]: any) => {
      setFoods(success?.data?.data?.products || []);
      setLoading(false);
    });
  }, []);

  const buckets = useMemo(() => {
    const byBarcode = new Map<string, ScanFood[]>();
    foods.forEach((item) => {
      const code = (item.barcode || "").trim();
      if (!code) return;
      const list = byBarcode.get(code) || [];
      list.push(item);
      byBarcode.set(code, list);
    });
    let duplicates = 0;
    byBarcode.forEach((list) => {
      if (list.length > 1) duplicates += list.length;
    });
    const flagged = foods
      .map((item) => ({ item, flags: issuesOf(item) }))
      .filter((row) => row.flags.length);
    return {
      total: foods.length,
      noBarcode: foods.filter((item) => !item.barcode || !String(item.barcode).trim()).length,
      noPhoto: foods.filter((item) => !(item.productImages && item.productImages.length) && !item.image_url).length,
      noFacts: foods.filter((item) => !item.nf?.length).length,
      noIngredients: foods.filter((item) => !item.ingredients?.length).length,
      duplicates,
      flagged,
    };
  }, [foods]);

  return (
    <PageShell
      kicker="Live app"
      title="Scan desk"
      subtitle="Barcode quality for the camera in the app: missing codes, pack photos, facts, and duplicate scans."
    >
      {loading && <CircleLoader />}
      <div className="ops-grid">
        <button type="button" className="ops-card" onClick={() => navigate("/add-product")}>
          <strong>{buckets.noBarcode}</strong>
          <span>Missing barcode</span>
          <p>A scan that cannot resolve a GTIN never reaches the catalog.</p>
        </button>
        <button type="button" className="ops-card" onClick={() => navigate("/products")}>
          <strong>{buckets.noPhoto}</strong>
          <span>Missing pack photo</span>
          <p>The scan result screen needs the front of pack.</p>
        </button>
        <button type="button" className="ops-card" onClick={() => navigate("/queue")}>
          <strong>{buckets.noFacts}</strong>
          <span>No nutrition facts</span>
          <p>Calories and macros cannot score until the panel exists.</p>
        </button>
        <button type="button" className="ops-card" onClick={() => navigate("/ingredients")}>
          <strong>{buckets.noIngredients}</strong>
          <span>No ingredient list</span>
          <p>Allergen and intolerance matching starts here.</p>
        </button>
      </div>

      <section className="scan-desk__list">
        <h2 className="section-heading">Needs a dietitian before the next scan</h2>
        <p className="section-blurb">
          {buckets.duplicates
            ? `${buckets.duplicates} foods share a barcode. `
            : "No duplicate barcodes in this sample. "}
          {buckets.flagged.length} labels are incomplete.
        </p>
        <ul className="scan-desk__rows">
          {buckets.flagged.slice(0, 12).map(({ item, flags }) => (
            <li key={item._id}>
              <button type="button" onClick={() => navigate(`/update-product/${item._id}`)}>
                <span className="scan-desk__name">
                  <strong>{item.productName || "Untitled food"}</strong>
                  <em>{item.brand || "No brand"} · {item.barcode || "no barcode"}</em>
                </span>
                <span className="scan-desk__flags">
                  {flags.map((flag) => (
                    <StatusChip key={flag} label={flag} tone="warn" />
                  ))}
                </span>
              </button>
            </li>
          ))}
          {!loading && buckets.flagged.length === 0 ? (
            <li className="scan-desk__empty">Sampled labels are scan-ready.</li>
          ) : null}
        </ul>
      </section>
    </PageShell>
  );
}
