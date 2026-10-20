import {
  StyledTableCell,
  StyledTableCellAction,
  StyledTableRow,
  adminTableSx,
} from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import TableWrapper from "@core/templates/TableWrapper";
import ListPagination from "@core/templates/ListPagination";
import productService from "services/product.service";
import { productActions } from "redux/slices/product";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductFilters from "./ProductFilters";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Button,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import BlockComponent from "@core/api-components/BlockComponent";
import { useTranslation } from "react-i18next";
import { englishName } from "utils/localizedData.util";
import Tooltip from "@core/basic-components/Tooltip";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MODAL, modalActions } from "redux/slices/modal";
import draftProductService from "services/draftProduct.service";
import { draftProductActions } from "redux/slices/draftProduct";

function statusTone(status?: string): "ok" | "warn" | "danger" | "info" {
  const s = String(status || "").toLowerCase();
  if (s === "active" || s === "approved") return "ok";
  if (s === "pending") return "warn";
  if (s === "inactive" || s === "rejected") return "danger";
  return "info";
}

export default function Product() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const catalogQuery = searchParams.get("q")?.trim() || "";
  const userRole = useAppSelector((state) => state?.auth?.user?.role);
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation();
  const { count, products, loading, refreshLoader, filters, refresh } =
    useAppSelector((state) => state.product);
  const {
    count: draftCount,
    draftProducts,
    loading: draftLoading,
    refreshLoader: draftRefreshLoader,
    filters: draftFilters,
    refresh: draftRefresh,
  } = useAppSelector((state) => state.draftProduct);

  const currentProducts = useMemo(
    () => (activeTab === 2 ? draftProducts : products),
    [activeTab, draftProducts, products]
  );
  const currentLoading = activeTab === 2 ? draftLoading : loading;
  const currentRefreshLoader =
    activeTab === 2 ? draftRefreshLoader : refreshLoader;
  const currentCount = activeTab === 2 ? draftCount : count;
  const currentFilters = activeTab === 2 ? draftFilters : filters;
  const pageSize = Number(currentFilters.page_size) || 25;

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
        <StyledTableRow key={item._id}>
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
          <StyledTableCellAction>
            <Tooltip title={t("Edit")}>
              <IconButton
                size="small"
                onClick={() =>
                  navigate(
                    activeTab === 2
                      ? `/update-draftProduct/${item._id}?isDraft=true`
                      : `/update-product/${item._id}`
                  )
                }
              >
                <EditNoteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <BlockComponent allowedRoles={["admin"]}>
              <Tooltip title={t("Delete")}>
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(
                      modalActions.openModal({
                        type: MODAL.CONFIRMATION_FORM,
                        data: {
                          heading: t("Delete Product"),
                          message: t(
                            "Are you sure you want to delete this product?"
                          ),
                          confirmAction: () => {
                            if (activeTab === 2) {
                              draftProductService.remove(item?._id, dispatch);
                            } else {
                              productService.remove(item?._id, dispatch);
                            }
                          },
                        },
                        width: "500px",
                      })
                    )
                  }
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </BlockComponent>
            {activeTab === 1 ? (
              <BlockComponent allowedRoles={["admin"]}>
                <Tooltip title={t("Approve")}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      dispatch(
                        modalActions.openModal({
                          type: MODAL.CONFIRMATION_FORM,
                          data: {
                            heading: t("Approve Product"),
                            message: t(
                              "Are you sure you want to approve this product?"
                            ),
                            confirmAction: () => {
                              productService.updateStatus(
                                item._id,
                                "approved",
                                dispatch
                              );
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
          </StyledTableCellAction>
        </StyledTableRow>
      );
    },
    [activeTab, dispatch, navigate, t]
  );

  const handleTabChange = useCallback(
    (_: any, newTab: number) => {
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
    if (catalogQuery && filters.productName !== catalogQuery) return;
    if (activeTab === 2) {
      draftProductService.getAll(draftFilters, dispatch);
    } else {
      const apiFilters =
        activeTab === 0 ? { ...filters, status: undefined } : filters;
      productService.getAll(apiFilters, dispatch);
    }
  }, [
    dispatch,
    activeTab,
    refresh,
    filters,
    draftRefresh,
    draftFilters,
    catalogQuery,
  ]);

  useEffect(() => {
    return () => {
      dispatch(productActions.resetFilters());
      dispatch(draftProductActions.resetFilters());
      dispatch(productActions.resetPage());
    };
  }, [dispatch]);

  return (
    <PageShell
      kicker="Foods"
      title="Catalog"
      subtitle="Barcodes, nutrition facts, front-of-pack marks, and scoring-ready labels."
      actions={
        <Button variant="contained" onClick={() => navigate("/add-product")}>
          Add food
        </Button>
      }
    >
      {currentLoading ? <CircleLoader /> : null}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          mb: 1.5,
          "& .MuiTab-root": { fontSize: "14px", textTransform: "capitalize" },
        }}
      >
        <Tab label={t("Approved")} />
        <Tab label={t("Under Review")} />
        {userRole?.includes("admin") ? <Tab label={t("Draft")} /> : null}
      </Tabs>

      <ProductFilters
        count={currentCount}
        productActions={
          activeTab === 2 ? draftProductActions : productActions
        }
        refreshLoader={currentRefreshLoader}
        filters={currentFilters}
        activeTab={activeTab}
      />

      <TableWrapper>
        <TableContainer className="catalog-table-scroll">
          <Table aria-label="Catalog foods" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={columns.length}
              loading={currentLoading}
              length={currentRefreshLoader ? 0 : currentProducts?.length}
              message={t("No Products Data currently available")}
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
    </PageShell>
  );
}
