export const FULFILLMENT_STATUSES = [
  "placed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const ORDER_TABS = [
  { key: "all", label: "All orders" },
  { key: "placed", label: "Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
] as const;

export const PAYMENT_FILTERS = [
  { key: "all", label: "All payments" },
  { key: "unpaid", label: "Unpaid" },
  { key: "paid", label: "Paid" },
  { key: "refunded", label: "Refunded" },
] as const;

export const PAYMENTS = ["unpaid", "paid", "refunded"] as const;

export const NEXT_STATUS: Record<string, string | null> = {
  placed: "processing",
  processing: "shipped",
  shipped: "delivered",
  delivered: null,
  cancelled: null,
};

export function money(amount: number, currency = "PKR") {
  return `${currency} ${Number(amount || 0).toLocaleString()}`;
}

export function statusTone(status: string) {
  if (status === "cancelled") return "danger" as const;
  if (status === "delivered") return "ok" as const;
  if (status === "shipped") return "info" as const;
  if (status === "processing") return "warn" as const;
  return "info" as const;
}

export function paymentTone(paymentStatus: string) {
  if (paymentStatus === "paid") return "ok" as const;
  if (paymentStatus === "refunded") return "danger" as const;
  return "warn" as const;
}

export function itemsSummary(items: any[] = []) {
  if (!items.length) return "—";
  const first = items[0];
  const more = items.length - 1;
  const base = `${first.quantity}× ${first.name}`;
  return more > 0 ? `${base} +${more}` : base;
}

export function formatWhen(value?: string | Date | null, withWeekday = false) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString(undefined, {
      ...(withWeekday ? { weekday: "short" as const } : {}),
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function formatRelative(value?: string | Date | null) {
  if (!value) return "";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 14) return `${days}d ago`;
  return formatWhen(value);
}

export function digitsPhone(phone?: string) {
  return String(phone || "").replace(/[^\d+]/g, "");
}

export function whatsappUrl(phone?: string, text?: string) {
  const digits = digitsPhone(phone).replace(/^\+/, "");
  if (!digits) return null;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}

export async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function buildAddressBlock(address: any = {}, fallbackName = "") {
  return [
    address.fullName || fallbackName,
    address.line1,
    address.line2,
    [address.city, address.state, address.postalCode].filter(Boolean).join(", "),
    address.country || "PK",
    address.phone,
  ]
    .filter(Boolean)
    .join("\n");
}

export function fulfillmentStepIndex(status: string) {
  const flow = ["placed", "processing", "shipped", "delivered"];
  if (status === "cancelled") return -1;
  const idx = flow.indexOf(status);
  return idx < 0 ? 0 : idx;
}
