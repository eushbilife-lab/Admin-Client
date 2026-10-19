import { useEffect, useMemo, useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import storeOrderService from "services/storeOrder.service";
import ToasterService from "utils/toaster.util";
import "../Store.css";

const STATUSES = [
  "all",
  "placed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const FULFILLMENT = [
  "placed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

function money(amount: number, currency = "PKR") {
  return `${currency} ${Number(amount || 0).toLocaleString()}`;
}

function toneFor(status: string, paymentStatus: string) {
  if (status === "cancelled") return "warn" as const;
  if (status === "delivered" || paymentStatus === "paid") return "ok" as const;
  return "warn" as const;
}

export default function StoreOrders() {
  const dispatch = useAppDispatch();
  const { orders, loading, refresh, filters, order } = useAppSelector(
    (state) => state.storeOrder
  );
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [notesDraft, setNotesDraft] = useState("");

  useEffect(() => {
    const payload: any = {
      page: filters.page || 1,
      page_size: filters.page_size || 50,
      isDelete: false,
    };
    if (status !== "all") payload.status = status;
    if (query.trim()) payload.search = query.trim();
    storeOrderService.getAll(payload, dispatch);
  }, [dispatch, refresh, filters.page, filters.page_size, status, query]);

  const items = useMemo(() => orders || [], [orders]);
  const selected = order;

  useEffect(() => {
    setNotesDraft(selected?.notes || "");
  }, [selected?._id, selected?.notes]);

  const openDetail = async (id: string) => {
    const [, error] = await storeOrderService.get(id, dispatch);
    if (error) ToasterService.showError("Could not load order");
  };

  const updateStatus = async (id: string, next: string) => {
    const [, error] = await storeOrderService.update(id, { status: next }, dispatch);
    if (error) ToasterService.showError("Update failed");
    else ToasterService.showSuccess("Order updated");
  };

  const updatePayment = async (id: string, paymentStatus: string) => {
    const [, error] = await storeOrderService.update(
      id,
      { paymentStatus },
      dispatch
    );
    if (error) ToasterService.showError("Payment update failed");
    else ToasterService.showSuccess("Payment updated");
  };

  const saveNotes = async (id: string) => {
    const [, error] = await storeOrderService.update(
      id,
      { notes: notesDraft },
      dispatch
    );
    if (error) ToasterService.showError("Could not save notes");
    else ToasterService.showSuccess("Notes saved");
  };

  const cancelOrder = async (id: string) => {
    const reason = window.prompt("Cancel reason (optional)") || "";
    const [, error] = await storeOrderService.cancel(id, reason, dispatch);
    if (error) ToasterService.showError("Cancel failed");
    else ToasterService.showSuccess("Order cancelled");
  };

  const resyncWebhook = async (id: string) => {
    const [, error] = await storeOrderService.resyncWebhook(id, dispatch);
    if (error) ToasterService.showError("Webhook sync failed");
    else ToasterService.showSuccess("Webhook queued for partner");
  };

  const address = selected?.shippingAddress || {};
  const customer = selected?.customer;

  return (
    <PageShell
      kicker="Store"
      title="Orders"
      subtitle="Customer store orders — place from mobile cart, manage fulfillment here."
    >
      {loading ? <CircleLoader /> : null}
      <div className="store-toolbar">
        <input
          className="store-search"
          placeholder="Search order #, name, phone, city"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setQuery(search);
          }}
        />
        <Button variant="outlined" onClick={() => setQuery(search)}>
          Search
        </Button>
        <div className="store-filters">
          {STATUSES.map((key) => (
            <button
              key={key}
              type="button"
              className={`store-filters__btn${status === key ? " is-active" : ""}`}
              onClick={() => setStatus(key)}
            >
              {key === "all" ? "All" : key}
            </button>
          ))}
        </div>
      </div>

      <div className="store-orders-layout">
        <div className="store-orders">
          {items.map((row: any) => (
            <article
              key={row._id}
              className={`store-order${selected?._id === row._id ? " is-selected" : ""}`}
              onClick={() => openDetail(row._id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") openDetail(row._id);
              }}
            >
              <header>
                <div>
                  <strong>{row.orderNumber}</strong>
                  <p>
                    {money(row.total, row.currency)} · {row.paymentMethod || "cod"} ·{" "}
                    {row.paymentStatus}
                  </p>
                  <p>
                    {row.customer?.name ||
                      row.shippingAddress?.fullName ||
                      "Customer"}{" "}
                    · {row.shippingAddress?.city || "—"}
                  </p>
                </div>
                <StatusChip
                  tone={toneFor(row.status, row.paymentStatus)}
                  label={row.status}
                />
              </header>
              <ul>
                {(row.items || []).slice(0, 3).map((item: any, idx: number) => (
                  <li key={`${row._id}-${idx}`}>
                    {item.quantity}× {item.name}
                  </li>
                ))}
                {(row.items || []).length > 3 ? (
                  <li>+{(row.items || []).length - 3} more</li>
                ) : null}
              </ul>
            </article>
          ))}
          {!loading && items.length === 0 ? (
            <div className="store-empty">
              <h2>No orders yet</h2>
              <p>Orders appear when a user places from their cart.</p>
            </div>
          ) : null}
        </div>

        <aside className="store-order-detail">
          {!selected ? (
            <div className="store-empty">
              <h2>Order details</h2>
              <p>Select an order to view customer, shipping, and actions.</p>
            </div>
          ) : (
            <>
              <header className="store-order-detail__head">
                <div>
                  <strong>{selected.orderNumber}</strong>
                  <p>
                    {selected.createdAt
                      ? new Date(selected.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>
                <StatusChip
                  tone={toneFor(selected.status, selected.paymentStatus)}
                  label={selected.status}
                />
              </header>

              <section>
                <h3>Customer</h3>
                <p>
                  {customer?.name || address.fullName || "—"}
                  <br />
                  {customer?.email || "—"}
                  <br />
                  {customer?.phone || address.phone || "—"}
                </p>
              </section>

              <section>
                <h3>Shipping</h3>
                <p>
                  {address.fullName}
                  <br />
                  {address.line1}
                  {address.line2 ? (
                    <>
                      <br />
                      {address.line2}
                    </>
                  ) : null}
                  <br />
                  {[address.city, address.state, address.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                  <br />
                  {address.country || "PK"}
                  <br />
                  {address.phone}
                </p>
              </section>

              <section>
                <h3>Items</h3>
                <ul>
                  {(selected.items || []).map((item: any, idx: number) => (
                    <li key={`${selected._id}-d-${idx}`}>
                      {item.quantity}× {item.name} —{" "}
                      {money(item.lineTotal, selected.currency)}
                    </li>
                  ))}
                </ul>
                <p className="store-order-detail__totals">
                  Subtotal {money(selected.subtotal, selected.currency)}
                  <br />
                  Shipping {money(selected.shipping, selected.currency)}
                  <br />
                  <strong>Total {money(selected.total, selected.currency)}</strong>
                </p>
              </section>

              <section className="store-order-detail__actions">
                <TextField
                  select
                  size="small"
                  label="Fulfillment"
                  value={
                    (FULFILLMENT as readonly string[]).includes(selected.status)
                      ? selected.status
                      : "placed"
                  }
                  onChange={(e) => updateStatus(selected._id, e.target.value)}
                  fullWidth
                >
                  {FULFILLMENT.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  size="small"
                  label="Payment"
                  value={
                    ["unpaid", "paid", "refunded"].includes(selected.paymentStatus)
                      ? selected.paymentStatus
                      : "unpaid"
                  }
                  onChange={(e) => updatePayment(selected._id, e.target.value)}
                  fullWidth
                >
                  {["unpaid", "paid", "refunded"].map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  size="small"
                  label="Admin notes"
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  multiline
                  minRows={2}
                  fullWidth
                />
                <div className="store-order-detail__btns">
                  <Button variant="outlined" onClick={() => saveNotes(selected._id)}>
                    Save notes
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => resyncWebhook(selected._id)}
                  >
                    Sync to partner
                  </Button>
                  {selected.status !== "cancelled" &&
                  selected.status !== "delivered" ? (
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => cancelOrder(selected._id)}
                    >
                      Cancel order
                    </Button>
                  ) : null}
                </div>
                {selected.cancelReason ? (
                  <p className="store-order-detail__cancel">
                    Cancelled: {selected.cancelReason}
                  </p>
                ) : null}
              </section>
            </>
          )}
        </aside>
      </div>
    </PageShell>
  );
}
