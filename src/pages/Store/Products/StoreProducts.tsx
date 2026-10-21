import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Pagination } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import GridSkeleton from "@core/templates/GridSkeleton";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import storeProductService from "services/storeProduct.service";
import storeCategoryService from "services/storeCategory.service";
import { storeProductActions } from "redux/slices/storeProduct";
import "../Store.css";

const STATUS_TONE: Record<string, "ok" | "warn" | "info"> = {
  published: "ok",
  active: "ok",
  draft: "warn",
  inactive: "warn",
};

type Cat = {
  id: string;
  key: string;
  label: string;
  description?: string;
  sortOrder?: number;
};

function ProductCard({
  product,
  onOpen,
}: {
  product: any;
  onOpen: () => void;
}) {
  return (
    <article className="store-card" onClick={onOpen}>
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
        <p>{product.shortDescription || product.categoryLabel || product.category}</p>
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
            <span className="store-card__sale"> −{product.discountPercent}%</span>
          ) : null}
        </strong>
        {product.variants?.length ? (
          <small>{product.variants.length} pack options</small>
        ) : null}
      </div>
    </article>
  );
}

export default function StoreProducts() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products, loading, refresh, count, filters } = useAppSelector(
    (state) => state.storeProduct
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | string>("all");
  const [categories, setCategories] = useState<Cat[]>([]);

  useEffect(() => {
    storeCategoryService.getAll({}).then(([success]: any) => {
      const list = success?.data?.data?.categories || [];
      setCategories(
        list.map((c: any) => ({
          id: String(c.id || c._id || ""),
          key: c.key,
          label: c.label,
          description: c.description,
          sortOrder: c.sortOrder,
        }))
      );
    });
  }, [refresh]);

  useEffect(() => {
    const payload: any = {
      page: filters.page || 1,
      page_size: filters.page_size || 48,
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
  const pages = Math.max(1, Math.ceil((count || 0) / (filters.page_size || 48)));

  const filterKeys = useMemo(
    () =>
      [
        { key: "all", label: "All sections" },
        ...categories.map((c) => ({ key: c.key, label: c.label })),
      ] as { key: string; label: string }[],
    [categories]
  );

  const sectioned = useMemo(() => {
    const list =
      categories.length > 0
        ? categories
        : [
            { id: "", key: "supper_foods", label: "Supper Foods", description: "" },
            { id: "", key: "supplements", label: "Supplements", description: "" },
          ];
    return list
      .map((section) => ({
        ...section,
        products: items.filter((p: any) => p.category === section.key),
      }))
      .filter((section) => category === "all" || section.key === category);
  }, [items, categories, category]);

  return (
    <PageShell
      kicker="Store"
      title="Store products"
      subtitle="Filter by shop section. Add new sections under Store → Sections, then assign them on each product."
      actions={
        <>
          <Button onClick={() => navigate("/store/sections")}>Manage sections</Button>
          <Button variant="contained" onClick={() => navigate("/store/products/new")}>
            New product
          </Button>
        </>
      }
    >
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
          {filterKeys.map(({ key, label }) => (
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

      {categories.length ? (
        <div className="store-cat-ids">
          {categories.map((cat) => (
            <code key={cat.id || cat.key}>
              {cat.label}: {cat.id}
            </code>
          ))}
        </div>
      ) : null}

      {loading && items.length === 0 ? (
        <GridSkeleton cards={8} columns="repeat(auto-fill, minmax(220px, 1fr))" />
      ) : items.length === 0 ? (
        <div className="store-empty">
          <h2>No store products yet</h2>
          <p>Add a product and choose a shop section.</p>
          <Button variant="contained" onClick={() => navigate("/store/products/new")}>
            New product
          </Button>
        </div>
      ) : (
        sectioned.map((section) => (
          <section key={section.key} className="store-section-block">
            <div className="store-section-block__head">
              <div>
                <h2>{section.label}</h2>
                <p>{section.description || "Shop section"}</p>
              </div>
              <div className="store-section-block__meta">
                <span>{section.products.length} shown</span>
                {section.id ? <code>{section.id}</code> : null}
                <Button
                  size="small"
                  onClick={() =>
                    navigate(`/store/products/new?category=${section.key}`)
                  }
                >
                  Add to {section.label}
                </Button>
              </div>
            </div>
            {section.products.length === 0 ? (
              <p className="store-section-block__empty">No products in this section yet.</p>
            ) : (
              <div className="store-grid">
                {section.products.map((product: any) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onOpen={() => navigate(`/store/products/${product._id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        ))
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
