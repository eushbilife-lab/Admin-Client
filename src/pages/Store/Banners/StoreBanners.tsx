import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Pagination } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import GridSkeleton from "@core/templates/GridSkeleton";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import {
  useGetAllStoreBannersQuery,
  useRemoveStoreBannerMutation,
} from "redux/api";
import { storeBannerActions } from "redux/slices/storeBanner";
import RowActions from "@core/api-components/RowActions";
import ToasterService from "utils/toaster.util";
import "../Store.css";

export default function StoreBanners() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { refresh, filters } = useAppSelector((state) => state.storeBanner);

  const payload = useMemo(
    () => ({
      page: filters.page || 1,
      page_size: filters.page_size || 24,
      isDelete: false,
    }),
    [filters.page, filters.page_size]
  );

  const { data, isFetching, isLoading, refetch } =
    useGetAllStoreBannersQuery(payload);
  const [removeBanner] = useRemoveStoreBannerMutation();

  useEffect(() => {
    if (refresh > 0) void refetch();
  }, [refresh, refetch]);

  const items = data?.banners || [];
  const count = data?.count ?? 0;
  const loading = isLoading || (isFetching && items.length === 0);
  const pages = Math.max(1, Math.ceil((count || 0) / (filters.page_size || 24)));

  return (
    <PageShell
      kicker="Store"
      title="Store banners"
      subtitle="Promo carousel on the mobile Store home (Keto Water, PCOS Water, etc.)."
      actions={
        <Button
          variant="contained"
          onClick={() => navigate("/store/banners/new")}
        >
          New banner
        </Button>
      }
    >
      {loading && items.length === 0 ? (
        <GridSkeleton
          cards={6}
          columns="repeat(auto-fill, minmax(220px, 1fr))"
        />
      ) : items.length === 0 ? (
        <div className="store-empty">
          <h2>No banners yet</h2>
          <Button
            variant="contained"
            onClick={() => navigate("/store/banners/new")}
          >
            New banner
          </Button>
        </div>
      ) : (
        <div
          className="store-grid"
          style={{
            opacity: isFetching ? 0.72 : 1,
            transition: "opacity 160ms ease",
          }}
        >
          {items.map((banner: any) => (
            <article key={banner._id} className="store-card">
              <div
                className="store-card__media"
                style={{
                  backgroundImage: banner.imageUrl
                    ? `url(${banner.imageUrl})`
                    : undefined,
                }}
                onClick={() => navigate(`/store/banners/${banner._id}`)}
                role="presentation"
              />
              <div className="store-card__body">
                <StatusChip
                  tone={
                    banner.status === "published" || banner.status === "active"
                      ? "ok"
                      : "warn"
                  }
                  label={banner.status}
                />
                <h3>{banner.title}</h3>
                <p>{banner.subtitle || "—"}</p>
                <div
                  className="store-card__actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <RowActions
                    onEdit={() => navigate(`/store/banners/${banner._id}`)}
                    deleteTitle="Delete banner"
                    deleteMessage={`Delete “${banner.title}”?`}
                    onDelete={async () => {
                      try {
                        await removeBanner(banner._id).unwrap();
                      } catch (error: any) {
                        ToasterService.showError(
                          error?.data?.message ||
                            error?.message ||
                            "Delete failed"
                        );
                      }
                    }}
                  />
                </div>
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
          onChange={(_e, page) => dispatch(storeBannerActions.setPage(page))}
        />
      ) : null}
    </PageShell>
  );
}
