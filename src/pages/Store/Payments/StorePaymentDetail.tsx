import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import CircleLoader from "@core/basic-components/CircleLoader";
import storePaymentService, {
  type StorePayment,
} from "services/storePayment.service";
import ToasterService from "utils/toaster.util";
import {
  copyText,
  formatWhen,
  money,
  paymentId,
  paymentStatusTone,
} from "./paymentUi";
import "../Store.css";

export default function StorePaymentDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<StorePayment | null>(null);
  const [reason, setReason] = useState("");
  const [refunding, setRefunding] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) return;
      setLoading(true);
      const [success, error]: any = await storePaymentService.get(id);
      if (!alive) return;
      setLoading(false);
      if (error || !success?.data?.data?.payment) {
        ToasterService.showError("Could not load payment");
        navigate("/store/payments");
        return;
      }
      setPayment(success.data.data.payment);
    })();
    return () => {
      alive = false;
    };
  }, [id, navigate]);

  const timeline = useMemo(() => {
    if (!payment) return [];
    const rows: { label: string; at: string | null; tone?: string }[] = [
      { label: "Intent created", at: payment.createdAt || null, tone: "info" },
    ];
    if (payment.paidAt)
      rows.push({ label: "Marked paid", at: payment.paidAt, tone: "ok" });
    if (payment.refundedAt)
      rows.push({
        label: "Refunded",
        at: payment.refundedAt,
        tone: "danger",
      });
    return rows.sort(
      (a, b) =>
        new Date(a.at || 0).getTime() - new Date(b.at || 0).getTime()
    );
  }, [payment]);

  const refund = async () => {
    if (!payment?.canRefund) return;
    const payId = paymentId(payment);
    if (!payId) return;
    const ok = window.confirm(
      "Refund this payment on PostEx XPay? The full amount returns to the customer and the linked store order is marked refunded."
    );
    if (!ok) return;
    setRefunding(true);
    const [success, error]: any = await storePaymentService.refund(
      payId,
      reason.trim() || undefined
    );
    setRefunding(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "XPay refund failed"
      );
      return;
    }
    ToasterService.showSuccess("Refunded on XPay — order marked refunded");
    setPayment(success?.data?.data?.payment || payment);
    setReason("");
  };

  if (loading || !payment) {
    return (
      <PageShell
        kicker="Store · Payments"
        title="Payment"
        subtitle="Loading payment details…"
        actions={
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/store/payments")}
          >
            Back to payments
          </Button>
        }
      >
        <div className="store-order-page__loader">
          <CircleLoader />
        </div>
      </PageShell>
    );
  }

  const customerName = payment.user?.name || "—";
  const customerEmail = payment.user?.email || "—";
  const customerPhone = payment.user?.phone || "—";

  const copyPaymentNo = async () => {
    const ok = await copyText(payment.paymentNo || "");
    if (ok) ToasterService.showSuccess("Payment # copied");
  };

  const copyProviderRef = async () => {
    if (!payment.providerRef) return;
    const ok = await copyText(payment.providerRef);
    if (ok) ToasterService.showSuccess("XPay intent copied");
  };

  return (
    <PageShell
      kicker="Store · Payments"
      title={payment.paymentNo}
      subtitle={`${(payment.method || "").toUpperCase()} · ${formatWhen(
        payment.createdAt,
        true
      )}`}
      actions={
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          alignItems="center"
        >
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            variant="outlined"
            onClick={() => navigate("/store/payments")}
          >
            Back
          </Button>
          <Tooltip title="Copy payment number">
            <IconButton onClick={copyPaymentNo} size="small">
              <ContentCopyRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <StatusChip
            tone={paymentStatusTone(payment.status)}
            label={payment.status}
          />
        </Stack>
      }
    >
      <div className="store-order-progress-card store-order-card">
        <header className="store-order-card__head">
          <h3>Settlement</h3>
          <strong className="store-pay-amount">
            {money(payment.amount, payment.currency)}
          </strong>
        </header>
        <ol className="store-order-steps">
          {[
            {
              key: "created",
              label: "created",
              done: true,
              current: payment.status === "pending",
            },
            {
              key: "paid",
              label: "paid",
              done: ["paid", "refunded"].includes(payment.status),
              current: payment.status === "paid",
            },
            {
              key: "refunded",
              label: "refunded",
              done: payment.status === "refunded",
              current: payment.status === "refunded",
            },
          ].map((step, idx) => (
            <li
              key={step.key}
              className={`store-order-step${step.done ? " is-done" : ""}${
                step.current ? " is-current" : ""
              }`}
            >
              <span className="store-order-step__dot">{idx + 1}</span>
              <span className="store-order-step__label">{step.label}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="store-order-page">
        <div className="store-order-page__main">
          <section className="store-order-card">
            <header className="store-order-card__head">
              <h3>Customer</h3>
            </header>
            <dl className="store-order-meta">
              <div>
                <dt>Name</dt>
                <dd>{customerName}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{customerEmail}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{customerPhone}</dd>
              </div>
            </dl>
          </section>

          <section className="store-order-card">
            <header className="store-order-card__head">
              <h3>Linked order</h3>
              {payment.orderId ? (
                <Button
                  size="small"
                  endIcon={<OpenInNewRoundedIcon />}
                  onClick={() => navigate(`/store/orders/${payment.orderId}`)}
                >
                  Open order
                </Button>
              ) : null}
            </header>
            <dl className="store-order-meta">
              <div>
                <dt>Order #</dt>
                <dd>{payment.orderNumber || "—"}</dd>
              </div>
              <div>
                <dt>Order id</dt>
                <dd>
                  <code>{payment.orderId || "—"}</code>
                </dd>
              </div>
              <div>
                <dt>Title</dt>
                <dd>{payment.title || "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="store-order-card">
            <header className="store-order-card__head">
              <h3>Provider</h3>
              {payment.providerRef ? (
                <Tooltip title="Copy XPay intent">
                  <IconButton size="small" onClick={copyProviderRef}>
                    <ContentCopyRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : null}
            </header>
            <dl className="store-order-meta">
              <div>
                <dt>Provider</dt>
                <dd>{(payment.provider || "xpay").toUpperCase()}</dd>
              </div>
              <div>
                <dt>Method</dt>
                <dd>{(payment.method || "—").toUpperCase()}</dd>
              </div>
              <div>
                <dt>XPay intent</dt>
                <dd>
                  <code>{payment.providerRef || "—"}</code>
                </dd>
              </div>
              <div>
                <dt>XPay refund</dt>
                <dd>
                  <code>{payment.refundProviderRef || "—"}</code>
                </dd>
              </div>
              {payment.failureReason ? (
                <div>
                  <dt>Failure</dt>
                  <dd>{payment.failureReason}</dd>
                </div>
              ) : null}
              {payment.refundReason ? (
                <div>
                  <dt>Refund reason</dt>
                  <dd>{payment.refundReason}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="store-order-card">
            <header className="store-order-card__head">
              <h3>Timeline</h3>
            </header>
            <ul className="store-order-timeline">
              {timeline.map((row) => (
                <li key={`${row.label}-${row.at}`}>
                  <strong>{row.label}</strong>
                  <span>{formatWhen(row.at)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="store-order-page__side">
          <section className="store-order-card">
            <header className="store-order-card__head">
              <h3>Manage</h3>
              <StatusChip
                tone={paymentStatusTone(payment.status)}
                label={payment.status}
              />
            </header>
            <dl className="store-order-meta">
              <div>
                <dt>Amount</dt>
                <dd>
                  <strong>{money(payment.amount, payment.currency)}</strong>
                </dd>
              </div>
              <div>
                <dt>Subtotal</dt>
                <dd>{money(payment.subtotal || payment.amount, payment.currency)}</dd>
              </div>
              <div>
                <dt>Tax</dt>
                <dd>{money(payment.tax || 0, payment.currency)}</dd>
              </div>
              <div>
                <dt>Paid at</dt>
                <dd>{formatWhen(payment.paidAt)}</dd>
              </div>
              <div>
                <dt>Refunded at</dt>
                <dd>{formatWhen(payment.refundedAt)}</dd>
              </div>
            </dl>

            <div className="store-order-detail__btns">
              {payment.canRefund ? (
                <>
                  <TextField
                    label="Refund reason (optional)"
                    size="small"
                    fullWidth
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Refunded by admin"
                  />
                  <Button
                    color="error"
                    variant="contained"
                    disabled={refunding}
                    onClick={() => void refund()}
                  >
                    {refunding ? "Refunding…" : "Refund via XPay"}
                  </Button>
                  <p className="store-pay-refund__hint">
                    Full amount only. PostEx returns the money; linked order
                    payment status becomes refunded.
                  </p>
                </>
              ) : payment.status === "refunded" ? (
                <p className="store-pay-refund__hint">
                  This payment was already refunded on XPay.
                </p>
              ) : (
                <p className="store-pay-refund__hint">
                  Refund is available only for paid JazzCash / card intents with
                  an XPay reference.
                </p>
              )}
              {payment.orderId ? (
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/store/orders/${payment.orderId}`)}
                >
                  View linked order
                </Button>
              ) : null}
            </div>
          </section>

          <aside className="store-pay-policy" aria-label="Refund policy">
            <strong>Refund policy</strong>
            <p>
              PostEx XPay full refunds only. JazzCash / card money returns via
              XPay; the linked store order is marked refunded. COD has no XPay
              refund.
            </p>
          </aside>
        </aside>
      </div>
    </PageShell>
  );
}
