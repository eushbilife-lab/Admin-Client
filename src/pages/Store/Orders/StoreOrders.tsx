import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import TableWrapper from "@core/templates/TableWrapper";
import {
  StyledTableCell,
  StyledTableCellAction,
  StyledTableRow,
  adminTableSx,
} from "@core/templates/Tables";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { storeOrderActions } from "redux/slices/storeOrder";
import storeOrderService from "services/storeOrder.service";
import ToasterService from "utils/toaster.util";
import {
  NEXT_STATUS,
  ORDER_TABS,
  PAYMENT_FILTERS,
  copyText,
  formatRelative,
  formatWhen,
  itemsSummary,
  money,
  paymentTone,
  statusTone,
} from "./orderUi";
import "../Store.css";

export default function StoreOrders() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders, loading, refresh, filters, count } = useAppSelector(
    (state) => state.storeOrder
  );
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({});
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuOrder, setMenuOrder] = useState<any>(null);

  const pageSize = Number(filters.page_size) || 50;
  const pageCount = Math.max(1, Math.ceil((count || 0) / pageSize));

  const loadCounts = useCallback(async () => {
    try {
      const counts = await storeOrderService.getStatusCounts(query, payment);
      setTabCounts(counts);
    } catch {
      /* ignore count errors — table still works */
    }
  }, [query, payment]);

  useEffect(() => {
    const payload: Record<string, unknown> = {
      page: filters.page || 1,
      page_size: pageSize,
      isDelete: false,
    };
    if (status !== "all") payload.status = status;
    if (payment !== "all") payload.paymentStatus = payment;
    if (query.trim()) payload.search = query.trim();
    storeOrderService.getAll(payload, dispatch);
  }, [dispatch, refresh, filters.page, pageSize, status, payment, query]);

  useEffect(() => {
    loadCounts();
  }, [loadCounts, refresh]);

  const items = useMemo(() => orders || [], [orders]);

  const kpi = useMemo(() => {
    const total = tabCounts.all ?? count ?? 0;
    const needsAction =
      (tabCounts.placed || 0) + (tabCounts.processing || 0);
    const inTransit = tabCounts.shipped || 0;
    const done = tabCounts.delivered || 0;
    return { total, needsAction, inTransit, done };
  }, [tabCounts, count]);

  const openDetail = (id: string) => navigate(`/store/orders/${id}`);

  const runSearch = () => {
    dispatch(storeOrderActions.resetPage());
    setQuery(search);
  };

  const changeStatusTab = (key: string) => {
    dispatch(storeOrderActions.resetPage());
    setStatus(key);
  };

  const changePayment = (key: string) => {
    dispatch(storeOrderActions.resetPage());
    setPayment(key);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuOrder(null);
  };

  const quickUpdate = async (patch: Record<string, string>) => {
    if (!menuOrder?._id) return;
    const [, error] = await storeOrderService.update(
      menuOrder._id,
      patch,
      dispatch
    );
    closeMenu();
    if (error) ToasterService.showError("Update failed");
    else {
      ToasterService.showSuccess("Order updated");
      loadCounts();
    }
  };

  return (
    <PageShell
      kicker="Store"
      title="Orders"
      subtitle="Track fulfillment, payments, and partner sync for every store order."
      actions={
        <Tooltip title="Refresh">
          <IconButton
            onClick={() => {
              dispatch(storeOrderActions.refresh());
              loadCounts();
            }}
            aria-label="Refresh orders"
          >
            <RefreshRoundedIcon />
          </IconButton>
        </Tooltip>
      }
    >
      <div className="store-order-kpis">
        <article className="store-order-kpi">
          <span>Total</span>
          <strong>{kpi.total}</strong>
        </article>
        <article className="store-order-kpi is-warn">
          <span>Needs action</span>
          <strong>{kpi.needsAction}</strong>
        </article>
        <article className="store-order-kpi is-info">
          <span>In transit</span>
          <strong>{kpi.inTransit}</strong>
        </article>
        <article className="store-order-kpi is-ok">
          <span>Delivered</span>
          <strong>{kpi.done}</strong>
        </article>
      </div>

      <div className="store-order-tabs" role="tablist" aria-label="Order status">
        {ORDER_TABS.map((tab) => {
          const active = status === tab.key;
          const n = tabCounts[tab.key];
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              className={`store-order-tab${active ? " is-active" : ""}`}
              onClick={() => changeStatusTab(tab.key)}
            >
              <span>{tab.label}</span>
              {typeof n === "number" ? (
                <em className="store-order-tab__count">{n}</em>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="store-toolbar store-toolbar--orders">
        <input
          className="store-search"
          placeholder="Search order #, name, phone, city"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch();
          }}
        />
        <Button variant="outlined" onClick={runSearch}>
          Search
        </Button>
        <div className="store-payment-filters" role="group" aria-label="Payment">
          {PAYMENT_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`store-payment-filter${payment === f.key ? " is-active" : ""}`}
              onClick={() => changePayment(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <TableWrapper refreshing={loading && items.length > 0}>
        <TableContainer sx={{ maxHeight: "68vh", overflowX: "auto" }}>
          <Table aria-label="store orders" sx={adminTableSx} stickyHeader>
            <TableLoadingWrapper
              coloumns={9}
              loading={loading && items.length === 0}
              length={items.length}
              message="No orders match these filters."
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Order</StyledTableCell>
                  <StyledTableCell>Placed</StyledTableCell>
                  <StyledTableCell>Customer</StyledTableCell>
                  <StyledTableCell>Items</StyledTableCell>
                  <StyledTableCell>Total</StyledTableCell>
                  <StyledTableCell>Payment</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>City</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((row: any) => {
                  const name =
                    row.customer?.name ||
                    row.shippingAddress?.fullName ||
                    "Customer";
                  const phone =
                    row.customer?.phone || row.shippingAddress?.phone || "";
                  return (
                    <StyledTableRow
                      key={row._id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => openDetail(row._id)}
                    >
                      <StyledTableCell>
                        <div className="store-order-id-cell">
                          <strong>{row.orderNumber}</strong>
                          <Tooltip title="Copy order number">
                            <IconButton
                              size="small"
                              onClick={async (e) => {
                                e.stopPropagation();
                                const ok = await copyText(row.orderNumber || "");
                                if (ok)
                                  ToasterService.showSuccess("Order # copied");
                              }}
                            >
                              <ContentCopyRoundedIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className="store-table-muted">
                          {(row.paymentMethod || "cod").toUpperCase()}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell>
                        <div title={formatWhen(row.createdAt)}>
                          {formatRelative(row.createdAt) ||
                            formatWhen(row.createdAt)}
                        </div>
                        <div className="store-table-muted">
                          {formatWhen(row.createdAt)}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell>
                        <div className="store-table-primary">{name}</div>
                        {phone ? (
                          <div className="store-table-muted">{phone}</div>
                        ) : null}
                      </StyledTableCell>
                      <StyledTableCell sx={{ maxWidth: 220 }}>
                        <div className="store-table-clamp">
                          {itemsSummary(row.items)}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell>
                        <strong>{money(row.total, row.currency)}</strong>
                      </StyledTableCell>
                      <StyledTableCell onClick={(e) => e.stopPropagation()}>
                        <StatusChip
                          tone={paymentTone(row.paymentStatus)}
                          label={row.paymentStatus || "unpaid"}
                        />
                      </StyledTableCell>
                      <StyledTableCell onClick={(e) => e.stopPropagation()}>
                        <StatusChip
                          tone={statusTone(row.status)}
                          label={row.status}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.shippingAddress?.city || "—"}
                      </StyledTableCell>
                      <StyledTableCellAction
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => openDetail(row._id)}
                          >
                            Manage
                          </Button>
                          <IconButton
                            size="small"
                            aria-label="Quick actions"
                            onClick={(e) => {
                              setMenuAnchor(e.currentTarget);
                              setMenuOrder(row);
                            }}
                          >
                            <MoreVertRoundedIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </StyledTableCellAction>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>
      </TableWrapper>

      {count > pageSize ? (
        <Stack alignItems="flex-end" sx={{ mt: 2 }}>
          <Pagination
            color="primary"
            count={pageCount}
            page={filters.page || 1}
            onChange={(_, page) => dispatch(storeOrderActions.setPage(page))}
          />
        </Stack>
      ) : null}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            if (menuOrder?._id) openDetail(menuOrder._id);
            closeMenu();
          }}
        >
          Open details
        </MenuItem>
        {menuOrder && NEXT_STATUS[menuOrder.status] ? (
          <MenuItem
            onClick={() =>
              quickUpdate({ status: NEXT_STATUS[menuOrder.status]! })
            }
          >
            Advance to {NEXT_STATUS[menuOrder.status]}
          </MenuItem>
        ) : null}
        {menuOrder?.paymentStatus !== "paid" ? (
          <MenuItem onClick={() => quickUpdate({ paymentStatus: "paid" })}>
            Mark paid
          </MenuItem>
        ) : (
          <MenuItem onClick={() => quickUpdate({ paymentStatus: "unpaid" })}>
            Mark unpaid
          </MenuItem>
        )}
        {menuOrder &&
        menuOrder.status !== "cancelled" &&
        menuOrder.status !== "delivered" ? (
          <MenuItem
            onClick={async () => {
              if (!menuOrder?._id) return;
              const reason = window.prompt("Cancel reason (optional)") || "";
              const [, error] = await storeOrderService.cancel(
                menuOrder._id,
                reason,
                dispatch
              );
              closeMenu();
              if (error) ToasterService.showError("Cancel failed");
              else {
                ToasterService.showSuccess("Order cancelled");
                loadCounts();
              }
            }}
          >
            Cancel order
          </MenuItem>
        ) : null}
      </Menu>
    </PageShell>
  );
}
