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
  Pagination,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import BlockComponent from "@core/api-components/BlockComponent";
import { useTranslation } from "react-i18next";
import { localizedData } from "utils/localizedData.util";
import Tooltip from "@core/basic-components/Tooltip";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MODAL, modalActions } from "redux/slices/modal";
import draftProductService from "services/draftProduct.service";
import { draftProductActions } from "redux/slices/draftProduct";

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

  // Memoize current products based on active tab
  const currentProducts = useMemo(
    () => (activeTab === 2 ? draftProducts : products),
    [activeTab, draftProducts, products]
  );

  // Memoize current loading state
  const currentLoading = useMemo(
    () => (activeTab === 2 ? draftLoading : loading),
    [activeTab, draftLoading, loading]
  );

  // Memoize current refresh loader state
  const currentRefreshLoader = useMemo(
    () => (activeTab === 2 ? draftRefreshLoader : refreshLoader),
    [activeTab, draftRefreshLoader, refreshLoader]
  );

  // Memoize current count
  const currentCount = useMemo(
    () => (activeTab === 2 ? draftCount : count),
    [activeTab, draftCount, count]
  );

  // Memoize current filters with explicit status for activeTab 0
  const currentFilters = useMemo(() => {
    if (activeTab === 2) {
      return draftFilters;
    }
    return {
      ...filters,
      status: activeTab === 1 ? "pending" : undefined
    };
  }, [activeTab, draftFilters, filters]);

  // Memoize table columns
  const columns = useMemo(
    () => [
      { id: "id", label: t("ID") },
      { id: "productName", label: t("Food") },
      { id: "barcode", label: t("Barcode") },
      { id: "label", label: t("Label") },
      { id: "status", label: t("Status") },
      { id: "action", label: t("Action") },
    ],
    [t]
  );

  // Memoize row renderer
  const renderRow = useCallback(
    (item: any) => (
      <StyledTableRow key={item._id}>
        <StyledTableCell>
          <Typography variant="body2">{item?.doc_number}</Typography>
        </StyledTableCell>
        <StyledTableCell>
           <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "35px",
                  height: "35px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            )}
            {item?.productName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {localizedData({
              en: item?.levels?.level1_id?.en?.name,
              ar: item?.levels?.level1_id?.ar?.name,
            }) || item.HNSSProductCategory}
          </Typography>
        </StyledTableCell>
        <StyledTableCell>
          <Typography variant="body2">{item?.barcode}</Typography>
          {item?.brand ? (
            <Typography variant="caption" color="text.secondary">
              {item.brand}
            </Typography>
          ) : null}
        </StyledTableCell>
        <StyledTableCell>
          <div className="ops-card__meta">
            <StatusChip
              label={item.hasNutritionFacts || item.nfCount > 0 ? "Facts" : "No facts"}
              tone={item.hasNutritionFacts || item.nfCount > 0 ? "ok" : "warn"}
            />
            <StatusChip
              label={item.foplCount > 0 ? `FOPL ${item.foplCount}` : "No FOPL"}
              tone={item.foplCount > 0 ? "info" : "warn"}
            />
          </div>
        </StyledTableCell>
        <StyledTableCell>
          <Typography variant="body2">{t(item?.status)}</Typography>
        </StyledTableCell>
        <StyledTableCellAction>
          <Tooltip title={t("Edit")}>
            <IconButton
              onClick={() =>
                navigate(
                  activeTab === 2
                    ? `/update-draftProduct/${item._id}?isDraft=true`
                    : `/update-product/${item._id}`
                )
              }
            >
              <EditNoteIcon />
            </IconButton>
          </Tooltip>
          <BlockComponent allowedRoles={["admin"]}>
            <Tooltip title={t("Delete")}>
              <IconButton
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
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
          </BlockComponent>
          {activeTab === 1 && (
            <BlockComponent allowedRoles={["admin"]}>
              <Tooltip title={t("Approve")}>
                <IconButton
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
                  <CheckCircleOutlineIcon />
                </IconButton>
              </Tooltip>
            </BlockComponent>
          )}
        </StyledTableCellAction>
      </StyledTableRow>
    ),
    [activeTab, dispatch, navigate, t]
  );

  // Handle tab change
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

  // Handle pagination change
  const handlePageChange = useCallback(
    (_e: any, page: number) => {
      if (activeTab === 2) {
        dispatch(draftProductActions.setPage(page));
      } else {
        dispatch(productActions.setPage(page));
      }
    },
    [activeTab, dispatch]
  );

  // Fetch data based on active tab and filters
  useEffect(() => {
    if (!catalogQuery) return;
    dispatch(
      productActions.setFilters({
        page: 1,
        page_size: filters.page_size,
        productName: catalogQuery,
      })
    );
  }, [catalogQuery, dispatch, filters.page_size]);

  useEffect(() => {
    if (catalogQuery && filters.productName !== catalogQuery) return;
    if (activeTab === 2) {
      draftProductService.getAll(draftFilters, dispatch);
    } else {
      const apiFilters = activeTab === 0 
        ? {...filters, status: undefined} 
        : filters;
      productService.getAll(apiFilters, dispatch);
    }
  }, [dispatch, activeTab, refresh, filters, draftRefresh, draftFilters, catalogQuery]);

  // Cleanup on unmount
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
        {currentLoading && <CircleLoader />}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": { fontSize: "14px", textTransform: "capitalize" },
          }}
        >
          <Tab label={t("Approved")} />
          <Tab label={t("Under Review")} />
          {userRole?.includes("admin") && <Tab label={t("Draft")} />}
        </Tabs>
        <br />
        <ProductFilters
          count={currentCount}
          productActions={activeTab === 2 ? draftProductActions : productActions}
          refreshLoader={currentRefreshLoader}
          filters={currentFilters}
          activeTab={activeTab}
        />
        <TableWrapper>
          <TableContainer style={{ maxHeight: "600px", overflow: "auto" }}>
            <Table
              aria-label="customized table"
              sx={adminTableSx}
            >
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
          <div className="pagination-list-bottom">
            <p>
              {currentCount > 0 &&
                `${currentCount} ${
                  currentCount > 1 ? t("Products") : t("Product")
                }`}
            </p>
            {currentCount > 0 && (
              <Pagination
                variant="outlined"
                color="primary"
                page={currentFilters.page}
                disabled={currentRefreshLoader}
                count={Math.ceil(currentCount / currentFilters.page_size)}
                onChange={handlePageChange}
              />
            )}
          </div>
        </TableWrapper>
    </PageShell>
  );
}