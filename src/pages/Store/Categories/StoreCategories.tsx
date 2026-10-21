import { useCallback, useEffect, useState } from "react";
import { Button, IconButton, MenuItem, Skeleton, TextField } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PageShell from "@core/templates/PageShell";
import storeCategoryService from "services/storeCategory.service";
import ToasterService from "utils/toaster.util";
import "../Store.css";

type CategoryRow = {
  _id?: string;
  id?: string;
  key: string;
  label: string;
  description?: string;
  sortOrder?: number;
  status?: string;
};

const DEFAULT_KEYS = new Set(["supper_foods", "supplements"]);

export default function StoreCategories() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<CategoryRow[]>([]);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(10);
  const [status, setStatus] = useState("published");

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

  const create = async () => {
    if (!label.trim()) {
      ToasterService.showError("Section name is required");
      return;
    }
    setSaving(true);
    const [success, error]: any = await storeCategoryService.create({
      label: label.trim(),
      description: description.trim(),
      sortOrder: Number(sortOrder) || 0,
      status,
    });
    setSaving(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Could not create section"
      );
      return;
    }
    ToasterService.showSuccess("Section created");
    setLabel("");
    setDescription("");
    setSortOrder(10);
    setStatus("published");
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
    ToasterService.showSuccess("Section deleted");
    await load();
  };

  return (
    <PageShell
      kicker="Store"
      title="Shop sections"
      subtitle="These are the All / Supper Foods / Supplements chips on Store → Products and on the mobile Store home. Add more sections here, then assign products to them."
      actions={
        <Button variant="contained" disabled={saving} onClick={create}>
          {saving ? "Saving…" : "Add section"}
        </Button>
      }
    >
      <section className="store-section">
        <h2>Add a section</h2>
        <p style={{ margin: 0, color: "#667066", fontSize: "0.875rem" }}>
          Example: Bundles, Diet Plans, New Arrivals — then pick it on a product as the shop section.
        </p>
        <div className="store-editor__row">
          <TextField
            label="Section name"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            fullWidth
            placeholder="Bundles"
            helperText="Shown on admin filters and mobile home"
          />
          <TextField
            label="Sort order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            fullWidth
          />
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
          >
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </div>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          helperText="Optional — helps staff know what belongs here"
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
                <div>
                  <strong>{row.label}</strong>
                  <p>{row.description || "—"}</p>
                  <code>
                    key: {row.key}
                    {id ? ` · id: ${id}` : ""}
                  </code>
                </div>
                <div className="store-section-list__actions">
                  <span>{row.status}</span>
                  <span>order {row.sortOrder ?? 0}</span>
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
