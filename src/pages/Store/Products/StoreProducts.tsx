import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Pagination } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import storeProductService from "services/storeProduct.service";
import { storeProductActions } from "redux/slices/storeProduct";
import "../Store.css";

const STATUS_TONE: Record<string, "ok" | "warn" | "info"> = {
  published: "ok",
  active: "ok",
  draft: "warn",
  inactive: "warn",
};

export default function StoreProducts() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products, loading, refresh, count, filters } = useAppSelector(
    (state) => state.storeProduct
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | string>("all");

  useEffect(() => {
    const payload: any = {
      page: filters.page || 1,
      page_size: filters.page_size || 24,
      isDelete: false,
    };
    if (category !== "all") payload.category = category;
    if (query.trim()) payload.name = query.trim();
    storeProductService.getAll(payload, dispatch);
  }, [dispatch, refresh, filters.page, filters.page_size, category, query]);

  useEffect(() => {
    return () => {
      dispatch(storeProductActions.resetPage());
    };
  }, [dispatch]);

  const items = useMemo(() => products || [], [products]);
  const pages = Math.max(1, Math.ceil((count || 0) / (filters.page_size || 24)));

  return (
    <PageShell
      kicker="Store"
      title="Store products"
      subtitle="Sellable SKUs for the mobile Store tab — Supper Foods and Supplements with price, sale price, and stock."
      actions={
        <Button variant="contained" onClick={() => navigate("/store/products/new")}>
          New product
        </Button>
      }
    >
      {loading ? <CircleLoader /> : null}
      <div className="store-toolbar">
        <input
          className="store-search"
          type="search"
          placeholder="Search store products…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            dispatch(storeProductActions.setPage(1));
          }}
        />
        <div className="store-filters">
          {(
            [
              ["all", "All"],
              ["supper_foods", "Supper Foods"],
              ["supplements", "Supplements"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`store-filters__btn${category === key ? " is-active" : ""}`}
              onClick={() => {
                setCategory(key);
                dispatch(storeProductActions.setPage(1));
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 && !loading ? (
        <div className="store-empty">
          <h2>No store products yet</h2>
          <p>Add products here so they appear on the mobile Store screen.</p>
          <Button variant="contained" onClick={() => navigate("/store/products/new")}>
            New product
          </Button>
        </div>
      ) : (
        <div className="store-grid">
          {items.map((product: any) => (
            <article
              key={product._id}
              className="store-card"
              onClick={() => navigate(`/store/products/${product._id}`)}
            >
              <div
                className="store-card__media"
                style={{
                  backgroundImage: product.imageUrl
                    ? `url(${product.imageUrl})`
                    : undefined,
                }}
              />
              <div className="store-card__body">
                <StatusChip
                  tone={STATUS_TONE[product.status] || "info"}
                  label={product.status}
                />
                <h3>{product.name}</h3>
                <p>{product.shortDescription || product.category}</p>
                <strong>
                  {product.currency || "PKR"}{" "}
                  {Number(product.price || 0).toLocaleString()}
                  {product.compareAtPrice ? (
                    <span className="store-card__compare">
                      {" "}
                      {Number(product.compareAtPrice).toLocaleString()}
                    </span>
                  ) : null}
                  {product.discountPercent ? (
                    <span className="store-card__sale">
                      {" "}
                      −{product.discountPercent}%
                    </span>
                  ) : null}
                </strong>
                {product.variants?.length ? (
                  <small>{product.variants.length} pack options</small>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      {pages > 1 ? (
        <Pagination
          sx={{ mt: 3, display: "flex", justifyContent: "center" }}
          count={pages}
          page={filters.page || 1}
          onChange={(_e, page) => dispatch(storeProductActions.setPage(page))}
        />
      ) : null}
    </PageShell>
  );
}
