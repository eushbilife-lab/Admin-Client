import {
  StyledTableCell,
  StyledTableCellAction,
  StyledTableRow,
  adminTableSx,
} from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import TableWrapper from "@core/templates/TableWrapper";
import ListPagination from "@core/templates/ListPagination";
import {
  useGetAllProductsQuery,
  useGetAllDraftProductsQuery,
  useRemoveProductMutation,
  useRemoveDraftProductMutation,
  useUpdateProductStatusMutation,
} from "redux/api";
import { productActions } from "redux/slices/product";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductFilters from "./ProductFilters";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import BlockComponent from "@core/api-components/BlockComponent";
import ConfirmDeleteButton from "@core/api-components/ConfirmDeleteButton";
import { useTranslation } from "react-i18next";
import { englishName } from "utils/localizedData.util";
import Tooltip from "@core/basic-components/Tooltip";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AddIcon from "@mui/icons-material/Add";
import { MODAL, modalActions } from "redux/slices/modal";
import { draftProductActions } from "redux/slices/draftProduct";
import "./Product.css";

function statusTone(status?: string): "ok" | "warn" | "danger" | "info" {
  const s = String(status || "").toLowerCase();
  if (s === "active" || s === "approved") return "ok";
  if (s === "pending") return "warn";
  if (s === "inactive" || s === "rejected") return "danger";
  return "info";
}

const TAB_META = [
  { id: 0, label: "Approved" },
  { id: 1, label: "Under review" },
  { id: 2, label: "Draft" },
] as const;

export default function Product() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const catalogQuery = searchParams.get("q")?.trim() || "";
  const userRole = useAppSelector((state) => state?.auth?.user?.role);
  const [activeTab, setActiveTab] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const { t } = useTranslation();
  const { filters, refresh } = useAppSelector((state) => state.product);
  const { filters: draftFilters, refresh: draftRefresh } = useAppSelector(
    (state) => state.draftProduct
  );

  const [removeProduct] = useRemoveProductMutation();
  const [removeDraftProduct] = useRemoveDraftProductMutation();
  const [updateProductStatus] = useUpdateProductStatusMutation();

  const productQueryArgs = useMemo(() => {
    const base = activeTab === 0 ? { ...filters, status: undefined } : filters;
    return base as Record<string, unknown>;
  }, [activeTab, filters]);

  const {
    data: productsData,
    isFetching: productsFetching,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useGetAllProductsQuery(productQueryArgs, { skip: activeTab === 2 });

  const {
    data: draftsData,
    isFetching: draftsFetching,
    isLoading: draftsLoading,
    refetch: refetchDrafts,
  } = useGetAllDraftProductsQuery(draftFilters as Record<string, unknown>, {
    skip: activeTab !== 2,
  });

  const products = productsData?.products || [];
  const count = productsData?.totalCount ?? 0;
  const draftProducts = draftsData?.products || [];
  const draftCount = draftsData?.totalCount ?? 0;

  const currentProducts = useMemo(
    () => (activeTab === 2 ? draftProducts : products),
    [activeTab, draftProducts, products]
  );
  const currentLoading =
    activeTab === 2
      ? draftsLoading || (draftsFetching && draftProducts.length === 0)
      : productsLoading || (productsFetching && products.length === 0);
  const currentRefreshLoader =
    activeTab === 2 ? draftsFetching : productsFetching;
  const currentCount = activeTab === 2 ? draftCount : count;
  const currentFilters = activeTab === 2 ? draftFilters : filters;
  const pageSize = Number(currentFilters.page_size) || 25;
  const pageCount = Math.max(1, Math.ceil((currentCount || 0) / pageSize));
  const showDraftTab = Boolean(userRole?.includes("admin"));

  const columns = useMemo(
    () => [
      { id: "food", label: "Food" },
      { id: "barcode", label: "Barcode" },
      { id: "category", label: "Category" },
      { id: "label", label: "Label" },
      { id: "status", label: "Status" },
      { id: "action", label: "Action" },
    ],
    []
  );

  const openEditor = useCallback(
    (item: any) => {
      navigate(
        activeTab === 2
          ? `/update-draftProduct/${item._id}?isDraft=true`
          : `/update-product/${item._id}`
      );
    },
    [activeTab, navigate]
  );

  const renderRow = useCallback(
    (item: any) => {
      const thumb = item.productImages?.[0] || item.image_url || item.image;
      const category =
        englishName(item?.HNSSProductCategory) ||
        englishName(item?.levels?.level1_id) ||
        item?.HNSSProductCategory?.code ||
        "—";
      const levelPath = [
        englishName(item?.levels?.level1_id),
        englishName(item?.levels?.level2_id),
      ]
        .filter(Boolean)
        .join(" · ");
      const hasFacts =
        item.hasNutritionFacts ||
        item.nfCount > 0 ||
        (Array.isArray(item.nf) && item.nf.length > 0);

      return (
        <StyledTableRow
          key={item._id}
          hover
          className="catalog-row"
          onClick={() => openEditor(item)}
          sx={{ cursor: "pointer" }}
        >
          <StyledTableCell>
            <div className="catalog-food">
              {thumb ? (
                <img
                  className="catalog-food__thumb"
                  src={thumb}
                  alt=""
                  loading="lazy"
                />
              ) : (
                <div className="catalog-food__thumb catalog-food__thumb--empty" />
              )}
              <div className="catalog-food__text">
                <div className="catalog-food__name">{item?.productName}</div>
                <div className="catalog-food__sub">
                  {[item?.brand, item?.manufacturer].filter(Boolean).join(" · ") ||
                    "—"}
                </div>
                {item?.doc_number != null ? (
                  <div className="catalog-food__id">#{item.doc_number}</div>
                ) : null}
              </div>
            </div>
          </StyledTableCell>
          <StyledTableCell>
            <code className="catalog-barcode">{item?.barcode || "—"}</code>
          </StyledTableCell>
          <StyledTableCell>
            <div className="catalog-cat">
              <strong>{category}</strong>
              {levelPath ? <span>{levelPath}</span> : null}
            </div>
          </StyledTableCell>
          <StyledTableCell>
            <div className="catalog-chips">
              <StatusChip
                label={hasFacts ? "Facts" : "No facts"}
                tone={hasFacts ? "ok" : "warn"}
              />
              <StatusChip
                label={
                  item.foplCount > 0 ? `FOPL ${item.foplCount}` : "No FOPL"
                }
                tone={item.foplCount > 0 ? "info" : "warn"}
              />
            </div>
          </StyledTableCell>
          <StyledTableCell>
            <StatusChip
              label={t(item?.status) || item?.status || "—"}
              tone={statusTone(item?.status)}
            />
          </StyledTableCell>
          <StyledTableCellAction
            onClick={(e) => e.stopPropagation()}
          >
            <div className="catalog-row-actions">
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditNoteIcon fontSize="small" />}
                onClick={() => openEditor(item)}
              >
                Manage
              </Button>
              <ConfirmDeleteButton
                title={t("Delete Product")}
                message={t("Are you sure you want to delete this product?")}
                onConfirm={async () => {
                  if (activeTab === 2) {
                    await removeDraftProduct(item?._id).unwrap();
                  } else {
                    await removeProduct(item?._id).unwrap();
                  }
                }}
              />
              {activeTab === 1 ? (
                <BlockComponent allowedRoles={["admin"]}>
                  <Tooltip title={t("Approve")}>
                    <IconButton
                      size="small"
                      color="success"
                      aria-label="Approve food"
                      onClick={() =>
                        dispatch(
                          modalActions.openModal({
                            type: MODAL.CONFIRMATION_FORM,
                            data: {
                              heading: t("Approve Product"),
                              message: t(
                                "Are you sure you want to approve this product?"
                              ),
                              confirmAction: async () => {
                                // Match legacy call body shape used by catalog approve.
                                await updateProductStatus({
                                  id: item._id,
                                  data: "approved" as any,
                                }).unwrap();
                              },
                            },
                            width: "500px",
                          })
                        )
                      }
                    >
                      <CheckCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </BlockComponent>
              ) : null}
            </div>
          </StyledTableCellAction>
        </StyledTableRow>
      );
    },
    [
      activeTab,
      dispatch,
      openEditor,
      t,
      removeDraftProduct,
      removeProduct,
      updateProductStatus,
    ]
  );

  const handleTabChange = useCallback(
    (newTab: number) => {
      setActiveTab(newTab);
      const statusMap = [undefined, "pending", "draft"];

      if (newTab === 2) {
        dispatch(
          draftProductActions.setFilters({
            ...draftFilters,
            page: 1,
            status: statusMap[newTab],
          })
        );
      } else {
        dispatch(
          productActions.setFilters({
            ...filters,
            page: 1,
            status: statusMap[newTab],
          })
        );
      }
    },
    [dispatch, draftFilters, filters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (activeTab === 2) {
        dispatch(draftProductActions.setPage(page));
      } else {
        dispatch(productActions.setPage(page));
      }
    },
    [activeTab, dispatch]
  );

  const handlePageSizeChange = useCallback(
    (nextSize: number) => {
      if (activeTab === 2) {
        dispatch(
          draftProductActions.setFilters({
            ...draftFilters,
            page: 1,
            page_size: nextSize,
          })
        );
      } else {
        dispatch(
          productActions.setFilters({
            ...filters,
            page: 1,
            page_size: nextSize,
          })
        );
      }
    },
    [activeTab, dispatch, draftFilters, filters]
  );

  const refreshList = useCallback(() => {
    if (activeTab === 2) {
      dispatch(draftProductActions.refresh());
      void refetchDrafts();
    } else {
      dispatch(productActions.refresh());
      void refetchProducts();
    }
  }, [activeTab, dispatch, refetchDrafts, refetchProducts]);

  useEffect(() => {
    if (!catalogQuery) return;
    dispatch(
      productActions.setFilters({
        page: 1,
        page_size: Number(filters.page_size) || 25,
        productName: catalogQuery,
      })
    );
  }, [catalogQuery, dispatch, filters.page_size]);

  useEffect(() => {
    if (refresh > 0 && activeTab !== 2) void refetchProducts();
  }, [refresh, activeTab, refetchProducts]);

  useEffect(() => {
    if (draftRefresh > 0 && activeTab === 2) void refetchDrafts();
  }, [draftRefresh, activeTab, refetchDrafts]);

  useEffect(() => {
    return () => {
      dispatch(productActions.resetFilters());
      dispatch(draftProductActions.resetFilters());
      dispatch(productActions.resetPage());
    };
  }, [dispatch]);

  const activeMeta = TAB_META[activeTab] || TAB_META[0];
  const emptyMessage =
    activeTab === 1
      ? "Nothing in review — pending submissions will land here."
      : activeTab === 2
        ? "No drafts yet — save one from Add food to continue later."
        : t("No Products Data currently available");

  return (
    <PageShell
      kicker="Foods"
      title="Catalog"
      subtitle="Barcodes, nutrition facts, front-of-pack marks, and scoring-ready labels."
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/add-product")}
        >
          Add food
        </Button>
      }
    >
      <div className="catalog-page">
        <div className="catalog-page__intro">
          <p className="catalog-page__intro-copy">
            Keep pack shots, barcodes, and nutrition accurate. Switch tabs to
            review submissions, polish drafts, or manage live approved foods.
          </p>
          <div className="catalog-page__intro-actions">
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              disabled={!!currentRefreshLoader}
              onClick={refreshList}
            >
              Refresh
            </Button>
            <Button
              size="small"
              variant={showFilters ? "contained" : "outlined"}
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters((v) => !v)}
            >
              {showFilters ? "Hide filters" : "Filters"}
            </Button>
          </div>
        </div>

        <div className="catalog-page__kpis">
          <div className="catalog-page__kpi is-active">
            <span>{activeMeta.label}</span>
            <strong>{currentCount ?? 0}</strong>
          </div>
          <div className="catalog-page__kpi">
            <span>Page</span>
            <strong>
              {Number(currentFilters.page) || 1} / {pageCount}
            </strong>
          </div>
          <div className="catalog-page__kpi">
            <span>Per page</span>
            <strong>{pageSize}</strong>
          </div>
        </div>

        <div className="catalog-page__tabs" role="tablist" aria-label="Food status">
          {TAB_META.filter((tab) => tab.id !== 2 || showDraftTab).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`catalog-page__tab${
                activeTab === tab.id ? " is-active" : ""
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {t(tab.label) || tab.label}
              {activeTab === tab.id ? (
                <em className="catalog-page__tab-count">{currentCount ?? 0}</em>
              ) : null}
            </button>
          ))}
        </div>

        {showFilters ? (
          <div className="catalog-page__filters-panel">
            <ProductFilters
              count={currentCount}
              productActions={
                activeTab === 2 ? draftProductActions : productActions
              }
              refreshLoader={currentRefreshLoader}
              filters={currentFilters}
              activeTab={activeTab}
            />
          </div>
        ) : null}

        <div className="catalog-page__surface">
          <TableWrapper
            refreshing={
              currentRefreshLoader ||
              (currentLoading && (currentProducts?.length ?? 0) > 0)
            }
          >
            <TableContainer className="catalog-table-scroll">
              <Table aria-label="Catalog foods" sx={adminTableSx} stickyHeader>
                <TableLoadingWrapper
                  coloumns={columns.length}
                  loading={currentLoading}
                  length={currentProducts?.length}
                  message={emptyMessage}
                >
                  <TableHead>
                    <TableRow>
                      {columns.map((column) =>
                        column.id === "action" ? (
                          <StyledTableCellAction key={column.id}>
                            {column.label}
                          </StyledTableCellAction>
                        ) : (
                          <StyledTableCell key={column.id}>
                            {column.label}
                          </StyledTableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentProducts?.map((item) => renderRow(item))}
                  </TableBody>
                </TableLoadingWrapper>
              </Table>
            </TableContainer>
            <ListPagination
              count={currentCount}
              page={Number(currentFilters.page) || 1}
              pageSize={pageSize}
              disabled={currentRefreshLoader}
              label="foods"
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </TableWrapper>
        </div>
      </div>
    </PageShell>
  );
}
