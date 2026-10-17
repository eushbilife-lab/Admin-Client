import { useEffect, useMemo, useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import storeOrderService from "services/storeOrder.service";
import { storeOrderActions } from "redux/slices/storeOrder";
import ToasterService from "utils/toaster.util";
import "../Store.css";

export default function StoreOrders() {
  const dispatch = useAppDispatch();
  const { orders, loading, refresh, filters } = useAppSelector(
    (state) => state.storeOrder
  );
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const payload: any = {
      page: filters.page || 1,
      page_size: filters.page_size || 50,
      isDelete: false,
    };
    if (status !== "all") payload.status = status;
    storeOrderService.getAll(payload, dispatch);
  }, [dispatch, refresh, filters.page, filters.page_size, status]);

  const items = useMemo(() => orders || [], [orders]);

  const updateStatus = async (id: string, next: string) => {
    const [, error] = await storeOrderService.update(id, { status: next }, dispatch);
    if (error) ToasterService.showError("Update failed");
    else ToasterService.showSuccess("Order updated");
  };

  return (
    <PageShell
      kicker="Store"
      title="Orders"
      subtitle="Mobile checkout orders (PostEx XPay card/JazzCash or cash on delivery)."
    >
      {loading ? <CircleLoader /> : null}
      <div className="store-toolbar">
        <div className="store-filters">
          {(["all", "awaiting_payment", "paid", "placed", "processing", "shipped", "delivered", "cancelled"] as const).map(
            (key) => (
              <button
                key={key}
                type="button"
                className={`store-filters__btn${status === key ? " is-active" : ""}`}
                onClick={() => setStatus(key)}
              >
                {key === "all" ? "All" : key.replace(/_/g, " ")}
              </button>
            )
          )}
        </div>
      </div>

      <div className="store-orders">
        {items.map((order: any) => (
          <article key={order._id} className="store-order">
            <header>
              <div>
                <strong>{order.orderNumber}</strong>
                <p>
                  {order.currency || "PKR"} {Number(order.total || 0).toLocaleString()} ·{" "}
                  {order.paymentMethod} · {order.paymentStatus}
                </p>
              </div>
              <StatusChip
                tone={
                  order.paymentStatus === "paid" || order.status === "delivered"
                    ? "ok"
                    : "warn"
                }
                label={order.status}
              />
            </header>
            <ul>
              {(order.items || []).map((item: any, idx: number) => (
                <li key={`${order._id}-${idx}`}>
                  {item.quantity}× {item.name} — {item.lineTotal}
                </li>
              ))}
            </ul>
            <TextField
              select
              size="small"
              label="Fulfillment status"
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
              sx={{ maxWidth: 240 }}
            >
              {[
                "pending",
                "awaiting_payment",
                "paid",
                "placed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "refunded",
              ].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </article>
        ))}
        {!loading && items.length === 0 ? (
          <div className="store-empty">
            <h2>No orders yet</h2>
            <p>Orders appear after mobile checkout.</p>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
