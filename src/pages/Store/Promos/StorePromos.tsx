import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
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
  type: "percent" | "fixed";
  value: number;
  minSubtotal?: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount?: number;
  status?: string;
};

const emptyForm = {
  code: "",
  title: "",
  type: "percent" as "percent" | "fixed",
  value: 10,
  minSubtotal: 0,
  maxDiscount: "" as number | "",
  usageLimit: "" as number | "",
  status: "published",
};

export default function StorePromos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<PromoRow[]>([]);
  const [form, setForm] = useState(emptyForm);

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

  const create = async () => {
    if (!form.code.trim()) {
      ToasterService.showError("Promo code is required");
      return;
    }
    setSaving(true);
    const [, error]: any = await storePromoService.create({
      code: form.code.trim(),
      title: form.title.trim(),
      type: form.type,
      value: Number(form.value) || 0,
      minSubtotal: Number(form.minSubtotal) || 0,
      maxDiscount: form.maxDiscount === "" ? null : Number(form.maxDiscount),
      usageLimit: form.usageLimit === "" ? null : Number(form.usageLimit),
      status: form.status,
    });
    setSaving(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Could not create promo"
      );
      return;
    }
    ToasterService.showSuccess("Promo created — live on mobile checkout");
    setForm(emptyForm);
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
    ToasterService.showSuccess("Promo deleted");
    await load();
  };

  return (
    <PageShell
      kicker="Store"
      title="Promo codes"
      subtitle="Codes shoppers enter on Cart (Apply). Published codes are validated by the User API and applied at checkout."
    >
      <section className="store-order-card" style={{ marginBottom: 20 }}>
        <header className="store-order-card__head">
          <h3>New promo</h3>
        </header>
        <div className="store-promo-form">
          <TextField
            size="small"
            label="Code"
            value={form.code}
            onChange={(e) =>
              setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
            }
            placeholder="WELCOME10"
          />
          <TextField
            size="small"
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Welcome 10% off"
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
            label="Value"
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
          <Button variant="contained" disabled={saving} onClick={create}>
            {saving ? "Saving…" : "Add promo"}
          </Button>
        </div>
      </section>

      {loading ? (
        <Skeleton variant="rounded" height={160} />
      ) : items.length === 0 ? (
        <div className="store-empty">
          <h2>No promo codes</h2>
          <p>Add WELCOME10 or SAVE500 for the mobile cart Apply field.</p>
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
                  {row.minSubtotal
                    ? ` · min ${row.minSubtotal}`
                    : ""}
                  {row.usedCount != null ? ` · used ${row.usedCount}` : ""}
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
