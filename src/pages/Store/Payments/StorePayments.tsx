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
import storePaymentService, {
  type StorePayment,
} from "services/storePayment.service";
import ToasterService from "utils/toaster.util";
import {
  PAYMENT_METHOD_FILTERS,
  PAYMENT_STATUS_TABS,
  copyText,
  formatRelative,
  formatWhen,
  money,
  paymentId,
  paymentStatusTone,
} from "./paymentUi";
import "../Store.css";

type Stats = {
  total: number;
  paid: number;
  pending: number;
  failed: number;
  refunded: number;
  paidAmount: number;
  refundedAmount: number;
  jazzcashPaid: number;
  cardPaid: number;
};

type Policy = {
  summary?: string;
  rules?: string[];
};

export default function StorePayments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<StorePayment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuRow, setMenuRow] = useState<StorePayment | null>(null);
  const [refunding, setRefunding] = useState(false);

  const pageCount = Math.max(1, Math.ceil((count || 0) / pageSize));

  const load = useCallback(async () => {
    setLoading(true);
    const [success, error]: any = await storePaymentService.getAll({
      page,
      page_size: pageSize,
      search: query.trim() || undefined,
      status,
      method,
    });
    setLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Failed to load payments"
      );
      return;
    }
    const data = success?.data?.data || {};
    setItems(data.payments || []);
    setStats(data.stats || null);
    setPolicy(data.policy || null);
    setCount(data.pagination?.total ?? data.count ?? 0);
  }, [page, pageSize, query, status, method]);

  useEffect(() => {
    void load();
  }, [load]);

  const openManage = (id: string) => {
    if (!id) return;
    navigate(`/store/payments/${id}`);
  };

  const runSearch = () => {
    setPage(1);
    setQuery(search);
  };

  const changeStatusTab = (key: string) => {
    setPage(1);
    setStatus(key);
  };

  const changeMethod = (key: string) => {
    setPage(1);
    setMethod(key);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuRow(null);
  };

  const quickRefund = async () => {
    const id = paymentId(menuRow);
    if (!id || !menuRow?.canRefund) return;
    const ok = window.confirm(
      "Refund this payment on PostEx XPay? Full amount returns to the customer and the linked order is marked refunded."
    );
    if (!ok) return;
    setRefunding(true);
    const [, error]: any = await storePaymentService.refund(id);
    setRefunding(false);
    closeMenu();
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "XPay refund failed"
      );
      return;
    }
    ToasterService.showSuccess("Refunded on XPay");
    await load();
  };

  const tabCounts = useMemo(() => {
    if (!stats) return {} as Record<string, number>;
    return {
      all: stats.total,
      paid: stats.paid,
      pending: stats.pending,
      failed: stats.failed,
      refunded: stats.refunded,
    };
  }, [stats]);

  return (
    <PageShell
      kicker="Store"
      title="Payments"
      subtitle="JazzCash and card intents for store orders. Manage refunds through PostEx XPay."
      actions={
        <Tooltip title="Refresh">
          <IconButton onClick={() => void load()} aria-label="Refresh payments">
            <RefreshRoundedIcon />
          </IconButton>
        </Tooltip>
      }
    >
      {policy?.summary ? (
        <aside className="store-pay-policy" aria-label="Refund policy">
          <strong>Refund policy</strong>
          <p>{policy.summary}</p>
        </aside>
      ) : null}

      <div className="store-order-kpis">
        <article className="store-order-kpi is-ok">
          <span>Paid revenue</span>
          <strong>{money(stats?.paidAmount || 0)}</strong>
        </article>
        <article className="store-order-kpi">
          <span>Paid</span>
          <strong>{stats?.paid ?? 0}</strong>
        </article>
        <article className="store-order-kpi is-warn">
          <span>Pending</span>
          <strong>{stats?.pending ?? 0}</strong>
        </article>
        <article className="store-order-kpi is-info">
          <span>Refunded</span>
          <strong>
            {stats?.refunded ?? 0}
            {stats?.refundedAmount
              ? ` · ${money(stats.refundedAmount)}`
              : ""}
          </strong>
        </article>
      </div>

      <div className="store-order-tabs" role="tablist" aria-label="Payment status">
        {PAYMENT_STATUS_TABS.map((tab) => {
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
          placeholder="Search payment no, order #, XPay ref…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch();
          }}
        />
        <Button variant="outlined" onClick={runSearch}>
          Search
        </Button>
        <div className="store-payment-filters" role="group" aria-label="Method">
          {PAYMENT_METHOD_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`store-payment-filter${method === f.key ? " is-active" : ""}`}
              onClick={() => changeMethod(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <TableWrapper refreshing={loading && items.length > 0}>
        <TableContainer sx={{ maxHeight: "68vh", overflowX: "auto" }}>
          <Table aria-label="store payments" sx={adminTableSx} stickyHeader>
            <TableLoadingWrapper
              coloumns={8}
              loading={loading && items.length === 0}
              length={items.length}
              message="No payments match these filters."
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Payment</StyledTableCell>
                  <StyledTableCell>Created</StyledTableCell>
                  <StyledTableCell>Customer</StyledTableCell>
                  <StyledTableCell>Order</StyledTableCell>
                  <StyledTableCell>Method</StyledTableCell>
                  <StyledTableCell>Amount</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((row) => {
                  const id = paymentId(row);
                  const name =
                    row.user?.name || row.user?.email || "Customer";
                  return (
                    <StyledTableRow
                      key={id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => openManage(id)}
                    >
                      <StyledTableCell>
                        <div className="store-order-id-cell">
                          <strong>{row.paymentNo}</strong>
                          <Tooltip title="Copy payment no">
                            <IconButton
                              size="small"
                              onClick={async (e) => {
                                e.stopPropagation();
                                const ok = await copyText(row.paymentNo || "");
                                if (ok)
                                  ToasterService.showSuccess("Payment # copied");
                              }}
                            >
                              <ContentCopyRoundedIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className="store-table-muted">
                          {row.providerRef
                            ? String(row.providerRef).slice(0, 18) + "…"
                            : "No XPay ref"}
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
                        {row.user?.email ? (
                          <div className="store-table-muted">
                            {row.user.email}
                          </div>
                        ) : null}
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={(e) => {
                          if (!row.orderId) return;
                          e.stopPropagation();
                          navigate(`/store/orders/${row.orderId}`);
                        }}
                      >
                        <div className="store-table-primary">
                          {row.orderNumber || "—"}
                        </div>
                        {row.orderId ? (
                          <div className="store-table-muted">Open order</div>
                        ) : null}
                      </StyledTableCell>
                      <StyledTableCell>
                        {(row.method || "—").toUpperCase()}
                      </StyledTableCell>
                      <StyledTableCell>
                        <strong>{money(row.amount, row.currency)}</strong>
                      </StyledTableCell>
                      <StyledTableCell onClick={(e) => e.stopPropagation()}>
                        <StatusChip
                          tone={paymentStatusTone(row.status)}
                          label={row.status}
                        />
                      </StyledTableCell>
                      <StyledTableCellAction
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => openManage(id)}
                          >
                            Manage
                          </Button>
                          <IconButton
                            size="small"
                            aria-label="Quick actions"
                            onClick={(e) => {
                              setMenuAnchor(e.currentTarget);
                              setMenuRow(row);
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
            page={page}
            onChange={(_, next) => setPage(next)}
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
            openManage(paymentId(menuRow));
            closeMenu();
          }}
        >
          Open details
        </MenuItem>
        {menuRow?.orderId ? (
          <MenuItem
            onClick={() => {
              navigate(`/store/orders/${menuRow.orderId}`);
              closeMenu();
            }}
          >
            Open order
          </MenuItem>
        ) : null}
        {menuRow?.canRefund ? (
          <MenuItem disabled={refunding} onClick={() => void quickRefund()}>
            Refund via XPay
          </MenuItem>
        ) : null}
      </Menu>
    </PageShell>
  );
}
