import { useCallback, useEffect, useState } from "react";
import { Button, MenuItem, Skeleton, TextField } from "@mui/material";
import StatusChip from "@core/templates/PageShell/StatusChip";
import StoreImageField from "pages/Store/StoreImageField";
import dietPlanService from "services/dietPlan.service";
import ToasterService from "utils/toaster.util";
import ConfirmDeleteButton from "@core/api-components/ConfirmDeleteButton";

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

export default function DietPlanGallery() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<PlanRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [success, error]: any = await dietPlanService.getAll({
      search: search.trim() || undefined,
    });
    setLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Failed to load diet plans"
      );
      return;
    }
    setItems(success?.data?.data?.plans || []);
  }, [search]);

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
    const [, error]: any = editingId
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
    <div className="diet-tab">
      <p className="diet-tab__intro">
        Mobile gallery cards shown on <code>GET /api/v1/diet-plans</code>. Upload
        flyer-style images members browse in the app.
      </p>

      <section className="diet-plan-form store-order-card">
        <header className="store-order-card__head">
          <h3>{editingId ? "Edit gallery card" : "Add gallery card"}</h3>
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
            {saving ? "Saving…" : editingId ? "Update card" : "Publish card"}
          </Button>
        </div>
      </section>

      <div className="diet-toolbar">
        <TextField
          size="small"
          label="Search gallery"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 220 }}
        />
        <Button size="small" variant="outlined" onClick={() => void load()}>
          Refresh
        </Button>
      </div>

      <section className="diet-plan-list">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={120} sx={{ borderRadius: 2 }} />
            ))
          : null}
        {!loading && !items.length ? (
          <p className="store-empty">No gallery cards yet — add the first above.</p>
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
                    <ConfirmDeleteButton
                      title="Delete diet plan"
                      message={`Delete “${row.title}”?`}
                      onConfirm={() => remove(row)}
                    />
                  </div>
                </article>
              );
            })
          : null}
      </section>
    </div>
  );
}
