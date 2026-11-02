import { useCallback, useEffect, useState } from "react";
import { Button, IconButton, MenuItem, Skeleton, TextField } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PageShell from "@core/templates/PageShell";
import StoreImageField from "pages/Store/StoreImageField";
import storeCategoryService from "services/storeCategory.service";
import ToasterService from "utils/toaster.util";
import "../Store.css";

type CategoryRow = {
  _id?: string;
  id?: string;
  key: string;
  label: string;
  description?: string;
  iconUrl?: string;
  sortOrder?: number;
  status?: string;
};

const DEFAULT_KEYS = new Set(["supper_foods", "supplements"]);

const emptyForm = {
  label: "",
  description: "",
  iconUrl: "",
  sortOrder: 10,
  status: "published",
};

export default function StoreCategories() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<CategoryRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    const [success, error]: any = await storeCategoryService.getAll({});
    setLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Failed to load sections"
      );
      return;
    }
    setItems(success?.data?.data?.categories || []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const startEdit = (row: CategoryRow) => {
    const id = row._id || row.id || "";
    if (!id) return;
    setEditingId(id);
    setForm({
      label: row.label || "",
      description: row.description || "",
      iconUrl: row.iconUrl || "",
      sortOrder: Number(row.sortOrder) || 0,
      status: row.status || "published",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    if (!form.label.trim()) {
      ToasterService.showError("Section name is required");
      return;
    }
    setSaving(true);
    const payload = {
      label: form.label.trim(),
      description: form.description.trim(),
      iconUrl: form.iconUrl.trim(),
      sortOrder: Number(form.sortOrder) || 0,
      status: form.status,
    };
    const [success, error]: any = editingId
      ? await storeCategoryService.update(editingId, payload)
      : await storeCategoryService.create(payload);
    setSaving(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message ||
          (editingId ? "Could not update section" : "Could not create section")
      );
      return;
    }
    ToasterService.showSuccess(editingId ? "Section updated" : "Section created");
    resetForm();
    await load();
    void success;
  };

  const remove = async (row: CategoryRow) => {
    const id = row._id || row.id;
    if (!id) return;
    if (DEFAULT_KEYS.has(row.key)) {
      ToasterService.showError("Default sections cannot be deleted");
      return;
    }
    const [, error]: any = await storeCategoryService.remove(id);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Delete failed"
      );
      return;
    }
    if (editingId === id) resetForm();
    ToasterService.showSuccess("Section deleted");
    await load();
  };

  return (
    <PageShell
      kicker="Store"
      title="Shop sections"
      subtitle="These are the All / Supper Foods / Supplements chips on Store → Products and on the mobile Store home. Add an icon so it shows in the user categories API."
      actions={
        <div style={{ display: "flex", gap: 8 }}>
          {editingId ? (
            <Button variant="outlined" disabled={saving} onClick={resetForm}>
              Cancel edit
            </Button>
          ) : null}
          <Button variant="contained" disabled={saving} onClick={() => void save()}>
            {saving
              ? "Saving…"
              : editingId
                ? "Update section"
                : "Add section"}
          </Button>
        </div>
      }
    >
      <section className="store-section">
        <h2>{editingId ? "Edit section" : "Add a section"}</h2>
        <p style={{ margin: 0, color: "#667066", fontSize: "0.875rem" }}>
          Example: Bundles, Diet Plans, New Arrivals — then pick it on a product as
          the shop section. Upload an icon for the mobile categories tabs.
        </p>
        <div className="store-editor__row">
          <TextField
            label="Section name"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            fullWidth
            placeholder="Bundles"
            helperText="Shown on admin filters and mobile home"
          />
          <TextField
            label="Sort order"
            type="number"
            value={form.sortOrder}
            onChange={(e) =>
              setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))
            }
            fullWidth
          />
          <TextField
            select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            fullWidth
          >
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </div>
        <TextField
          label="Description"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          fullWidth
          multiline
          minRows={2}
          helperText="Optional — helps staff know what belongs here"
        />
        <StoreImageField
          label="Section icon"
          value={form.iconUrl}
          onChange={(url) => setForm((f) => ({ ...f, iconUrl: url }))}
          folder="store-sections"
          helperText="Shown on mobile GET /store/categories (and /store/types, home tabs)"
        />
      </section>

      <section className="store-section" style={{ marginTop: 20 }}>
        <h2>Current sections</h2>
        <div className="store-section-list">
          {loading && items.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <article key={`sk-${i}`} className="store-section-list__row">
                  <div style={{ flex: 1 }}>
                    <Skeleton animation="wave" height={22} width="40%" />
                    <Skeleton animation="wave" height={16} width="70%" />
                    <Skeleton animation="wave" height={14} width="55%" />
                  </div>
                </article>
              ))
            : null}
          {items.map((row) => {
            const id = row._id || row.id || "";
            const locked = DEFAULT_KEYS.has(row.key);
            return (
              <article key={id || row.key} className="store-section-list__row">
                <div className="store-section-list__main">
                  {row.iconUrl ? (
                    <img
                      className="store-section-list__icon"
                      src={row.iconUrl}
                      alt=""
                    />
                  ) : (
                    <div className="store-section-list__icon store-section-list__icon--empty" />
                  )}
                  <div>
                    <strong>{row.label}</strong>
                    <p>{row.description || "—"}</p>
                    <code>
                      key: {row.key}
                      {id ? ` · id: ${id}` : ""}
                    </code>
                  </div>
                </div>
                <div className="store-section-list__actions">
                  <span>{row.status}</span>
                  <span>order {row.sortOrder ?? 0}</span>
                  <IconButton
                    size="small"
                    aria-label="Edit section"
                    onClick={() => startEdit(row)}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  {!locked ? (
                    <IconButton
                      size="small"
                      aria-label="Delete section"
                      onClick={() => void remove(row)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <small>Default</small>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
