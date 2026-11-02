export const PAYMENT_STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "paid", label: "Paid" },
  { key: "pending", label: "Pending" },
  { key: "failed", label: "Failed" },
  { key: "refunded", label: "Refunded" },
] as const;

export const PAYMENT_METHOD_FILTERS = [
  { key: "all", label: "All methods" },
  { key: "jazzcash", label: "JazzCash" },
  { key: "card", label: "Card" },
] as const;

export function money(amount: number, currency = "PKR") {
  return `${currency} ${Number(amount || 0).toLocaleString()}`;
}

export function paymentStatusTone(status: string) {
  if (status === "paid") return "ok" as const;
  if (status === "pending") return "warn" as const;
  if (status === "refunded") return "info" as const;
  if (status === "failed" || status === "cancelled") return "danger" as const;
  return "info" as const;
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
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return "";
}

export async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function paymentId(row: { _id?: string; id?: string } | null | undefined) {
  return row?._id || row?.id || "";
}
