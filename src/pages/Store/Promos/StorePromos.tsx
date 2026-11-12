import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Skeleton,
  TextField,
  Tooltip,
} from "@mui/material";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import storePromoService from "services/storePromo.service";
import ToasterService from "utils/toaster.util";
import ConfirmDeleteButton from "@core/api-components/ConfirmDeleteButton";
import "../Store.css";

type PromoRow = {
  _id?: string;
  id?: string;
  code: string;
  title?: string;
  description?: string;
  type: "percent" | "fixed";
  value: number;
  minSubtotal?: number;
  maxDiscount?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  usageLimit?: number | null;
  perUserLimit?: number | null;
  firstOrderOnly?: boolean;
  usedCount?: number;
  status?: string;
};

const emptyForm = {
  code: "",
  title: "",
  description: "",
  type: "percent" as "percent" | "fixed",
  value: 10,
  minSubtotal: 0,
  maxDiscount: "" as number | "",
  usageLimit: "" as number | "",
  perUserLimit: "" as number | "",
  firstOrderOnly: false,
  startsAt: "",
  endsAt: "",
  status: "published",
};

function dateInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatWhen(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
}

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let body = "";
  for (let i = 0; i < 6; i += 1) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `EUSH-${body}`;
}

function payloadFrom(form: typeof emptyForm) {
  return {
    code: form.code.trim(),
    title: form.title.trim(),
    description: form.description.trim(),
    type: form.type,
    value: Number(form.value) || 0,
    minSubtotal: Number(form.minSubtotal) || 0,
    maxDiscount: form.maxDiscount === "" ? null : Number(form.maxDiscount),
    usageLimit: form.usageLimit === "" ? null : Number(form.usageLimit),
    perUserLimit: form.perUserLimit === "" ? null : Number(form.perUserLimit),
    firstOrderOnly: form.firstOrderOnly,
    startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
    endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
    status: form.status,
  };
}

export default function StorePromos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<PromoRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const notifyPromo = (row: PromoRow) => {
    const id = row._id || row.id || "";
    const qs = new URLSearchParams({
      promo: row.code,
      ...(id ? { promoId: id } : {}),
    });
    navigate(`/notifications?${qs.toString()}`);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const [success, error]: any = await storePromoService.getAll({});
    setLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Failed to load promos"
      );
      return;
    }
    setItems(success?.data?.data?.promos || []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const edit = (row: PromoRow) => {
    setEditingId(row._id || row.id || "");
    setForm({
      code: row.code || "",
      title: row.title || "",
      description: row.description || "",
      type: row.type === "fixed" ? "fixed" : "percent",
      value: Number(row.value) || 0,
      minSubtotal: Number(row.minSubtotal) || 0,
      maxDiscount: row.maxDiscount == null ? "" : Number(row.maxDiscount),
      usageLimit: row.usageLimit == null ? "" : Number(row.usageLimit),
      perUserLimit: row.perUserLimit == null ? "" : Number(row.perUserLimit),
      firstOrderOnly: Boolean(row.firstOrderOnly),
      startsAt: dateInput(row.startsAt),
      endsAt: dateInput(row.endsAt),
      status: row.status || "published",
    });
  };

  const save = async () => {
    if (!form.code.trim()) {
      ToasterService.showError("Promo code is required");
      return;
    }
    setSaving(true);
    const payload = payloadFrom(form);
    const [, error]: any = editingId
      ? await storePromoService.update(editingId, payload)
      : await storePromoService.create(payload);
    setSaving(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message ||
          error?.data?.message ||
          "Could not save promo"
      );
      return;
    }
    ToasterService.showSuccess(
      editingId
        ? "Promo updated"
        : "Promo created — live on mobile checkout when published"
    );
    setForm(emptyForm);
    setEditingId("");
    await load();
  };

  const setStatus = async (row: PromoRow, status: string) => {
    const id = row._id || row.id;
    if (!id) return;
    const [, error]: any = await storePromoService.update(id, { status });
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Update failed"
      );
      return;
    }
    ToasterService.showSuccess("Promo updated");
    await load();
  };

  const remove = async (row: PromoRow) => {
    const id = row._id || row.id;
    if (!id) return;
    const [, error]: any = await storePromoService.remove(id);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Delete failed"
      );
      return;
    }
    if ((row._id || row.id) === editingId) {
      setEditingId("");
      setForm(emptyForm);
    }
    ToasterService.showSuccess("Promo deleted");
    await load();
  };

  return (
    <PageShell
      kicker="Store"
      title="Promo codes"
      subtitle="Type a code yourself or generate one. Published codes are checked on the User API for dates, cart minimum, total uses, uses per customer, and first-order only."
    >
      <section className="store-order-card" style={{ marginBottom: 20 }}>
        <header className="store-order-card__head">
          <h3>{editingId ? "Edit promo" : "New promo"}</h3>
        </header>
        <div className="store-promo-form">
          <div className="store-promo-code">
            <TextField
              size="small"
              label="Code"
              value={form.code}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                }))
              }
              placeholder="WELCOME10"
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={() => setForm((f) => ({ ...f, code: makeCode() }))}
            >
              Generate
            </Button>
          </div>
          <TextField
            size="small"
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Welcome 10% off"
          />
          <TextField
            size="small"
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Shown with the code"
          />
          <TextField
            select
            size="small"
            label="Type"
            value={form.type}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                type: e.target.value as "percent" | "fixed",
              }))
            }
          >
            <MenuItem value="percent">Percent %</MenuItem>
            <MenuItem value="fixed">Fixed PKR</MenuItem>
          </TextField>
          <TextField
            size="small"
            type="number"
            label={form.type === "percent" ? "Percent" : "Amount (PKR)"}
            value={form.value}
            onChange={(e) =>
              setForm((f) => ({ ...f, value: Number(e.target.value) || 0 }))
            }
          />
          <TextField
            size="small"
            type="number"
            label="Min subtotal"
            value={form.minSubtotal}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                minSubtotal: Number(e.target.value) || 0,
              }))
            }
          />
          <TextField
            size="small"
            type="number"
            label="Max discount"
            value={form.maxDiscount}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                maxDiscount:
                  e.target.value === "" ? "" : Number(e.target.value) || 0,
              }))
            }
            placeholder="Optional"
          />
          <TextField
            size="small"
            type="number"
            label="Total uses"
            value={form.usageLimit}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                usageLimit:
                  e.target.value === "" ? "" : Number(e.target.value) || 0,
              }))
            }
            placeholder="Unlimited"
          />
          <TextField
            size="small"
            type="number"
            label="Uses per customer"
            value={form.perUserLimit}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                perUserLimit:
                  e.target.value === "" ? "" : Number(e.target.value) || 0,
              }))
            }
            placeholder="Unlimited"
          />
          <TextField
            size="small"
            type="datetime-local"
            label="Starts"
            value={form.startsAt}
            onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            type="datetime-local"
            label="Ends"
            value={form.endsAt}
            onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            size="small"
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          >
            <MenuItem value="published">published</MenuItem>
            <MenuItem value="draft">draft</MenuItem>
            <MenuItem value="disabled">disabled</MenuItem>
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.firstOrderOnly}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstOrderOnly: e.target.checked }))
                }
              />
            }
            label="First order only"
          />
          <div className="store-promo-actions">
            <Button variant="contained" disabled={saving} onClick={save}>
              {saving ? "Saving…" : editingId ? "Update promo" : "Add promo"}
            </Button>
            {editingId ? (
              <Button
                variant="text"
                onClick={() => {
                  setEditingId("");
                  setForm(emptyForm);
                }}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {loading ? (
        <Skeleton variant="rounded" height={160} />
      ) : items.length === 0 ? (
        <div className="store-empty">
          <h2>No promo codes</h2>
          <p>Add a code by hand, or generate one for the mobile cart.</p>
        </div>
      ) : (
        <div className="store-promo-list">
          {items.map((row) => (
            <article key={row._id || row.code} className="store-promo-row">
              <div>
                <strong>{row.code}</strong>
                <p className="store-table-muted">
                  {row.title || "—"} ·{" "}
                  {row.type === "percent"
                    ? `${row.value}% off`
                    : `PKR ${row.value} off`}
                  {row.minSubtotal ? ` · min ${row.minSubtotal}` : ""}
                  {row.maxDiscount != null ? ` · cap ${row.maxDiscount}` : ""}
                  {row.usageLimit != null
                    ? ` · ${row.usedCount || 0}/${row.usageLimit} uses`
                    : ` · used ${row.usedCount || 0}`}
                  {row.perUserLimit != null
                    ? ` · ${row.perUserLimit}/customer`
                    : ""}
                  {row.firstOrderOnly ? " · first order" : ""}
                  {row.startsAt ? ` · from ${formatWhen(row.startsAt)}` : ""}
                  {row.endsAt ? ` · until ${formatWhen(row.endsAt)}` : ""}
                </p>
              </div>
              <StatusChip
                tone={
                  row.status === "published" || row.status === "active"
                    ? "ok"
                    : "warn"
                }
                label={row.status || "draft"}
              />
              <div className="store-order-detail__btns">
                <Button size="small" variant="outlined" onClick={() => edit(row)}>
                  Edit
                </Button>
                <Tooltip title="Send push / inbox about this promo">
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<CampaignOutlinedIcon />}
                    onClick={() => notifyPromo(row)}
                  >
                    Notify
                  </Button>
                </Tooltip>
                {row.status !== "published" ? (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setStatus(row, "published")}
                  >
                    Publish
                  </Button>
                ) : (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setStatus(row, "disabled")}
                  >
                    Disable
                  </Button>
                )}
                <ConfirmDeleteButton
                  title="Delete promo"
                  message={`Delete promo ${row.code}?`}
                  onConfirm={() => remove(row)}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
