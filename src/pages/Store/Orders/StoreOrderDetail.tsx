import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { storeOrderActions } from "redux/slices/storeOrder";
import storeOrderService from "services/storeOrder.service";
import ToasterService from "utils/toaster.util";
import {
  FULFILLMENT_STATUSES,
  NEXT_STATUS,
  PAYMENTS,
  buildAddressBlock,
  copyText,
  digitsPhone,
  formatWhen,
  fulfillmentStepIndex,
  money,
  paymentTone,
  statusTone,
  whatsappUrl,
} from "./orderUi";
import "../Store.css";

const FLOW = ["placed", "processing", "shipped", "delivered"] as const;

export default function StoreOrderDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.storeOrder.order);
  const [loading, setLoading] = useState(true);
  const [notesDraft, setNotesDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) return;
      setLoading(true);
      const [success, error] = await storeOrderService.get(id, dispatch);
      if (!alive) return;
      setLoading(false);
      if (error || !success) {
        ToasterService.showError("Could not load order");
        navigate("/store/orders");
      }
    })();
    return () => {
      alive = false;
      dispatch(storeOrderActions.setOrder(null));
    };
  }, [dispatch, id, navigate]);

  useEffect(() => {
    setNotesDraft(order?.notes || "");
  }, [order?._id, order?.notes]);

  const updateStatus = async (next: string) => {
    if (!order?._id) return;
    setSaving(true);
    const [, error] = await storeOrderService.update(
      order._id,
      { status: next },
      dispatch
    );
    setSaving(false);
    if (error) ToasterService.showError("Update failed");
    else ToasterService.showSuccess("Order updated");
  };

  const updatePayment = async (paymentStatus: string) => {
    if (!order?._id) return;
    setSaving(true);
    const [, error] = await storeOrderService.update(
      order._id,
      { paymentStatus },
      dispatch
    );
    setSaving(false);
    if (error) ToasterService.showError("Payment update failed");
    else ToasterService.showSuccess("Payment updated");
  };

  const saveNotes = async () => {
    if (!order?._id) return;
    setSaving(true);
    const [, error] = await storeOrderService.update(
      order._id,
      { notes: notesDraft },
      dispatch
    );
    setSaving(false);
    if (error) ToasterService.showError("Could not save notes");
    else ToasterService.showSuccess("Notes saved");
  };

  const cancelOrder = async () => {
    if (!order?._id) return;
    const reason = window.prompt("Cancel reason (optional)") || "";
    setSaving(true);
    const [, error] = await storeOrderService.cancel(order._id, reason, dispatch);
    setSaving(false);
    if (error) ToasterService.showError("Cancel failed");
    else ToasterService.showSuccess("Order cancelled");
  };

  const resyncWebhook = async () => {
    if (!order?._id) return;
    setSaving(true);
    const [, error] = await storeOrderService.resyncWebhook(order._id, dispatch);
    setSaving(false);
    if (error) ToasterService.showError("Webhook sync failed");
    else ToasterService.showSuccess("Webhook queued for partner");
  };

  const timeline = useMemo(() => {
    if (!order) return [];
    const rows: { label: string; at: string | null; tone?: string }[] = [
      { label: "Order placed", at: order.createdAt, tone: "ok" },
      {
        label: "Last updated",
        at: order.updatedAt,
        tone: "info",
      },
    ];
    if (order.paidAt) rows.push({ label: "Marked paid", at: order.paidAt, tone: "ok" });
    if (order.cancelledAt)
      rows.push({
        label: "Cancelled",
        at: order.cancelledAt,
        tone: "danger",
      });
    return rows.sort(
      (a, b) =>
        new Date(a.at || 0).getTime() - new Date(b.at || 0).getTime()
    );
  }, [order]);

  if (loading || !order) {
    return (
      <PageShell
        kicker="Store"
        title="Order"
        subtitle="Loading order details…"
        actions={
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/store/orders")}
          >
            Back to orders
          </Button>
        }
      >
        <div className="store-order-page__loader">
          <CircleLoader />
        </div>
      </PageShell>
    );
  }

  const address = order.shippingAddress || {};
  const customer = order.customer || {};
  const customerName = customer.name || address.fullName || "—";
  const customerPhone = customer.phone || address.phone || "";
  const customerEmail = customer.email || "—";
  const step = fulfillmentStepIndex(order.status);
  const next = NEXT_STATUS[order.status];
  const wa = whatsappUrl(
    customerPhone || address.phone,
    `Hi ${customerName}, regarding your Eushbi order ${order.orderNumber}:`
  );
  const tel = digitsPhone(customerPhone || address.phone);
  const cancelled = order.status === "cancelled";

  const copyOrder = async () => {
    const ok = await copyText(order.orderNumber || "");
    if (ok) ToasterService.showSuccess("Order # copied");
  };

  const copyAddress = async () => {
    const ok = await copyText(buildAddressBlock(address, customerName));
    if (ok) ToasterService.showSuccess("Address copied");
  };

  return (
    <PageShell
      kicker="Store · Orders"
      title={order.orderNumber}
      subtitle={`Placed ${formatWhen(order.createdAt, true)}`}
      actions={
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            variant="outlined"
            onClick={() => navigate("/store/orders")}
          >
            Back
          </Button>
          <Tooltip title="Copy order number">
            <IconButton onClick={copyOrder} size="small">
              <ContentCopyRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton onClick={() => window.print()} size="small">
              <PrintRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <StatusChip tone={statusTone(order.status)} label={order.status} />
          <StatusChip
            tone={paymentTone(order.paymentStatus)}
            label={order.paymentStatus || "unpaid"}
          />
        </Stack>
      }
    >
      <div className="store-order-progress-card store-order-card">
        <header className="store-order-card__head">
          <h3>Fulfillment progress</h3>
          {cancelled ? (
            <StatusChip tone="danger" label="Cancelled" />
          ) : next ? (
            <Button
              size="small"
              variant="contained"
              disabled={saving}
              onClick={() => updateStatus(next)}
            >
              Advance to {next}
            </Button>
          ) : (
            <StatusChip tone="ok" label="Complete" />
          )}
        </header>
        <ol className={`store-order-steps${cancelled ? " is-cancelled" : ""}`}>
          {FLOW.map((key, idx) => {
            const done = !cancelled && step >= idx;
            const current = !cancelled && step === idx;
            return (
              <li
                key={key}
                className={`store-order-step${done ? " is-done" : ""}${
                  current ? " is-current" : ""
                }`}
              >
                <span className="store-order-step__dot">{idx + 1}</span>
                <span className="store-order-step__label">{key}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        className="store-order-detail-tabs"
        variant="scrollable"
        allowScrollButtonsMobile
      >
        <Tab label="Overview" />
        <Tab label="Timeline" />
        <Tab label="Notes & sync" />
      </Tabs>

      {tab === 0 ? (
        <div className="store-order-page">
          <div className="store-order-page__main">
            <section className="store-order-card">
              <header className="store-order-card__head">
                <h3>Customer</h3>
                <div className="store-order-inline-actions">
                  {tel ? (
                    <Tooltip title="Call">
                      <IconButton
                        size="small"
                        component="a"
                        href={`tel:${tel}`}
                      >
                        <LocalPhoneRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                  {wa ? (
                    <Tooltip title="WhatsApp">
                      <IconButton
                        size="small"
                        component="a"
                        href={wa}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ChatRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </div>
              </header>
              <dl className="store-order-meta">
                <div>
                  <dt>Name</dt>
                  <dd>{customerName}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{customerPhone || "—"}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{customerEmail}</dd>
                </div>
                <div>
                  <dt>Payment method</dt>
                  <dd>{(order.paymentMethod || "cod").toUpperCase()}</dd>
                </div>
              </dl>
            </section>

            <section className="store-order-card">
              <header className="store-order-card__head">
                <h3>Shipping address</h3>
                <Button size="small" onClick={copyAddress}>
                  Copy address
                </Button>
              </header>
              <dl className="store-order-meta">
                <div>
                  <dt>Recipient</dt>
                  <dd>{address.fullName || customerName}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{address.phone || customerPhone || "—"}</dd>
                </div>
                <div className="is-wide">
                  <dt>Address</dt>
                  <dd>
                    {[address.line1, address.line2].filter(Boolean).join(", ") ||
                      "—"}
                  </dd>
                </div>
                <div>
                  <dt>City</dt>
                  <dd>{address.city || "—"}</dd>
                </div>
                <div>
                  <dt>State / Province</dt>
                  <dd>{address.state || "—"}</dd>
                </div>
                <div>
                  <dt>Postal code</dt>
                  <dd>{address.postalCode || "—"}</dd>
                </div>
                <div>
                  <dt>Country</dt>
                  <dd>{address.country || "PK"}</dd>
                </div>
              </dl>
            </section>

            <section className="store-order-card">
              <header className="store-order-card__head">
                <h3>Line items</h3>
                <span className="store-table-muted">
                  {(order.items || []).length} item
                  {(order.items || []).length === 1 ? "" : "s"}
                </span>
              </header>
              <div className="store-order-table-wrap">
                <table className="store-order-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Line total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item: any, idx: number) => (
                      <tr key={`${order._id}-item-${idx}`}>
                        <td>
                          <div className="store-order-item-cell">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt=""
                                className="store-order-item-thumb"
                              />
                            ) : (
                              <div className="store-order-item-thumb is-empty" />
                            )}
                            <div>
                              <div className="store-table-primary">
                                {item.name}
                              </div>
                              {item.category ? (
                                <div className="store-table-muted">
                                  {item.category}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>
                          {money(
                            item.unitPrice ?? item.price ?? 0,
                            order.currency
                          )}
                        </td>
                        <td>
                          <strong>
                            {money(item.lineTotal, order.currency)}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="store-order-summary">
                <div>
                  <span>Subtotal</span>
                  <span>{money(order.subtotal, order.currency)}</span>
                </div>
                <div>
                  <span>Shipping</span>
                  <span>{money(order.shipping, order.currency)}</span>
                </div>
                {order.discount ? (
                  <div>
                    <span>Discount</span>
                    <span>−{money(order.discount, order.currency)}</span>
                  </div>
                ) : null}
                <div className="is-total">
                  <span>Total</span>
                  <span>{money(order.total, order.currency)}</span>
                </div>
              </div>
            </section>
          </div>

          <aside className="store-order-page__side">
            <section className="store-order-card store-order-card--sticky">
              <header className="store-order-card__head">
                <h3>Manage</h3>
              </header>
              <div className="store-order-actions">
                <TextField
                  select
                  size="small"
                  label="Status"
                  disabled={saving || cancelled}
                  value={
                    (FULFILLMENT_STATUSES as readonly string[]).includes(
                      order.status
                    )
                      ? order.status
                      : "placed"
                  }
                  onChange={(e) => updateStatus(e.target.value)}
                  fullWidth
                >
                  {FULFILLMENT_STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  size="small"
                  label="Payment"
                  disabled={saving}
                  value={
                    (PAYMENTS as readonly string[]).includes(order.paymentStatus)
                      ? order.paymentStatus
                      : "unpaid"
                  }
                  onChange={(e) => updatePayment(e.target.value)}
                  fullWidth
                >
                  {PAYMENTS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
                <div className="store-order-detail__btns">
                  {order.paymentStatus !== "paid" ? (
                    <Button
                      variant="contained"
                      disabled={saving}
                      onClick={() => updatePayment("paid")}
                    >
                      Mark paid
                    </Button>
                  ) : null}
                  {next ? (
                    <Button
                      variant="outlined"
                      disabled={saving}
                      onClick={() => updateStatus(next)}
                    >
                      Mark {next}
                    </Button>
                  ) : null}
                  {!cancelled && order.status !== "delivered" ? (
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={cancelOrder}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
                {order.cancelReason ? (
                  <p className="store-order-detail__cancel">
                    Cancelled: {order.cancelReason}
                  </p>
                ) : null}
              </div>
            </section>
          </aside>
        </div>
      ) : null}

      {tab === 1 ? (
        <section className="store-order-card">
          <header className="store-order-card__head">
            <h3>Order timeline</h3>
          </header>
          <ul className="store-order-timeline">
            {timeline.map((row) => (
              <li key={`${row.label}-${row.at}`}>
                <span className={`store-order-timeline__dot is-${row.tone || "info"}`} />
                <div>
                  <strong>{row.label}</strong>
                  <p>{formatWhen(row.at, true)}</p>
                  {row.label === "Cancelled" && order.cancelReason ? (
                    <p className="store-order-detail__cancel">
                      {order.cancelReason}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === 2 ? (
        <div className="store-order-page store-order-page--single">
          <section className="store-order-card">
            <header className="store-order-card__head">
              <h3>Admin notes</h3>
            </header>
            <div className="store-order-actions">
              <TextField
                size="small"
                label="Internal notes"
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                multiline
                minRows={6}
                fullWidth
                disabled={saving}
                placeholder="Courier instructions, customer callbacks, warehouse notes…"
              />
              <div className="store-order-detail__btns">
                <Button
                  variant="contained"
                  onClick={saveNotes}
                  disabled={saving}
                >
                  Save notes
                </Button>
                <Button
                  variant="outlined"
                  onClick={resyncWebhook}
                  disabled={saving}
                >
                  Sync to partner
                </Button>
              </div>
              <p className="store-table-muted">
                Partner sync re-queues the current order snapshot to the
                configured webhook.
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </PageShell>
  );
}
