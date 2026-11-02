import { useCallback, useEffect, useState } from "react";
import {
  Button,
  IconButton,
  MenuItem,
  Skeleton,
  TextField,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import StoreImageField from "pages/Store/StoreImageField";
import dietPlanService from "services/dietPlan.service";
import ToasterService from "utils/toaster.util";
import "./DietPlans.css";

type PlanRow = {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  sortOrder?: number;
  status?: string;
};

const emptyForm = {
  title: "",
  description: "",
  imageUrl: "",
  sortOrder: 0,
  status: "published",
};

export default function DietPlans() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<PlanRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [success, error]: any = await dietPlanService.getAll({});
    setLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Failed to load diet plans"
      );
      return;
    }
    setItems(success?.data?.data?.plans || []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (row: PlanRow) => {
    setEditingId(row._id || row.id || null);
    setForm({
      title: row.title || "",
      description: row.description || "",
      imageUrl: row.imageUrl || "",
      sortOrder: Number(row.sortOrder) || 0,
      status: row.status || "published",
    });
  };

  const save = async () => {
    if (!form.title.trim()) {
      ToasterService.showError("Title is required");
      return;
    }
    if (!form.imageUrl.trim()) {
      ToasterService.showError("Upload a diet plan image");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      sortOrder: Number(form.sortOrder) || 0,
      status: form.status,
    };
    const [success, error]: any = editingId
      ? await dietPlanService.update(editingId, payload)
      : await dietPlanService.create(payload);
    setSaving(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Could not save diet plan"
      );
      return;
    }
    ToasterService.showSuccess(
      editingId ? "Diet plan updated" : "Diet plan published for mobile"
    );
    resetForm();
    await load();
    return success;
  };

  const setStatus = async (row: PlanRow, status: string) => {
    const id = row._id || row.id;
    if (!id) return;
    const [, error]: any = await dietPlanService.update(id, {
      title: row.title,
      description: row.description || "",
      imageUrl: row.imageUrl,
      sortOrder: row.sortOrder || 0,
      status,
    });
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Update failed"
      );
      return;
    }
    ToasterService.showSuccess("Status updated");
    await load();
  };

  const remove = async (row: PlanRow) => {
    const id = row._id || row.id;
    if (!id) return;
    if (!window.confirm(`Delete diet plan “${row.title}”?`)) return;
    const [, error]: any = await dietPlanService.remove(id);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Delete failed"
      );
      return;
    }
    ToasterService.showSuccess("Diet plan deleted");
    if (editingId === id) resetForm();
    await load();
  };

  return (
    <PageShell
      kicker="Content"
      title="Diet plans"
      subtitle="Upload diet plan images for the mobile app. Published plans appear on GET /api/v1/diet-plans."
    >
      <section className="diet-plan-form store-order-card">
        <header className="store-order-card__head">
          <h3>{editingId ? "Edit diet plan" : "Add diet plan"}</h3>
          {editingId ? (
            <Button size="small" onClick={resetForm}>
              Cancel edit
            </Button>
          ) : null}
        </header>
        <div className="diet-plan-form__grid">
          <TextField
            label="Title"
            size="small"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Sort order"
            size="small"
            type="number"
            value={form.sortOrder}
            onChange={(e) =>
              setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))
            }
          />
          <TextField
            select
            label="Status"
            size="small"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          >
            <MenuItem value="published">published</MenuItem>
            <MenuItem value="draft">draft</MenuItem>
            <MenuItem value="inactive">inactive</MenuItem>
          </TextField>
          <TextField
            label="Description (optional)"
            size="small"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            fullWidth
            multiline
            minRows={2}
            sx={{ gridColumn: "1 / -1" }}
          />
          <div style={{ gridColumn: "1 / -1" }}>
            <StoreImageField
              label="Diet plan image"
              value={form.imageUrl}
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
              folder="diet-plans"
              helperText="JPEG / PNG / WebP · max 5 MB. Shown on mobile diet plans."
            />
          </div>
        </div>
        <div className="diet-plan-form__actions">
          <Button
            variant="contained"
            disabled={saving}
            onClick={() => void save()}
          >
            {saving ? "Saving…" : editingId ? "Update plan" : "Publish plan"}
          </Button>
        </div>
      </section>

      <section className="diet-plan-list">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={120} sx={{ borderRadius: 2 }} />
            ))
          : null}
        {!loading && !items.length ? (
          <p className="store-empty">No diet plans yet — upload the first image above.</p>
        ) : null}
        {!loading
          ? items.map((row) => {
              const id = row._id || row.id || "";
              const live =
                row.status === "published" || row.status === "active";
              return (
                <article key={id} className="diet-plan-row">
                  <div
                    className="diet-plan-row__media"
                    style={{
                      backgroundImage: row.imageUrl
                        ? `url(${row.imageUrl})`
                        : undefined,
                    }}
                  />
                  <div className="diet-plan-row__body">
                    <div className="diet-plan-row__top">
                      <strong>{row.title}</strong>
                      <StatusChip
                        tone={live ? "ok" : "warn"}
                        label={row.status || "draft"}
                      />
                    </div>
                    <p>{row.description || "—"}</p>
                    <small>Sort {row.sortOrder ?? 0}</small>
                  </div>
                  <div className="diet-plan-row__actions">
                    <Button size="small" onClick={() => startEdit(row)}>
                      Edit
                    </Button>
                    {live ? (
                      <Button
                        size="small"
                        onClick={() => void setStatus(row, "draft")}
                      >
                        Unpublish
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => void setStatus(row, "published")}
                      >
                        Publish
                      </Button>
                    )}
                    <IconButton
                      aria-label="Delete"
                      color="error"
                      onClick={() => void remove(row)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </div>
                </article>
              );
            })
          : null}
      </section>
    </PageShell>
  );
}
