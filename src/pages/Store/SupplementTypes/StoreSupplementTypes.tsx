import { useState } from "react";
import { Button, IconButton, MenuItem, Skeleton, TextField } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PageShell from "@core/templates/PageShell";
import ConfirmDeleteButton from "@core/api-components/ConfirmDeleteButton";
import ToasterService from "utils/toaster.util";
import {
  useCreateStoreSupplementTypeMutation,
  useGetAllStoreSupplementTypesQuery,
  useRemoveStoreSupplementTypeMutation,
  useUpdateStoreSupplementTypeMutation,
} from "redux/api/storeSupplementType/storeSupplementTypeApi";
import "../Store.css";

type TypeRow = {
  _id?: string;
  id?: string;
  key: string;
  label: string;
  description?: string;
  sortOrder?: number;
  status?: string;
};

const emptyForm = {
  label: "",
  description: "",
  sortOrder: 0,
  status: "published",
};

export default function StoreSupplementTypes() {
  const { data, isLoading, isFetching, refetch } =
    useGetAllStoreSupplementTypesQuery({});
  const [createType] = useCreateStoreSupplementTypeMutation();
  const [updateType] = useUpdateStoreSupplementTypeMutation();
  const [removeType] = useRemoveStoreSupplementTypeMutation();
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const items: TypeRow[] = data?.supplementTypes || [];

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const startEdit = (row: TypeRow) => {
    const id = row._id || row.id || "";
    if (!id) return;
    setEditingId(id);
    setForm({
      label: row.label || "",
      description: row.description || "",
      sortOrder: Number(row.sortOrder) || 0,
      status: row.status || "published",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    if (!form.label.trim()) {
      ToasterService.showError("Supplement type name is required");
      return;
    }
    setSaving(true);
    const payload = {
      label: form.label.trim(),
      description: form.description.trim(),
      sortOrder: Number(form.sortOrder) || 0,
      status: form.status,
    };
    try {
      if (editingId) {
        await updateType({ id: editingId, data: payload }).unwrap();
        ToasterService.showSuccess("Supplement type updated");
      } else {
        await createType(payload).unwrap();
        ToasterService.showSuccess("Supplement type created");
      }
      resetForm();
      void refetch();
    } catch (error: any) {
      ToasterService.showError(
        error?.response?.data?.message ||
          error?.data?.message ||
          (editingId ? "Could not update type" : "Could not create type")
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: TypeRow) => {
    const id = row._id || row.id;
    if (!id) return;
    try {
      await removeType(id).unwrap();
      if (editingId === id) resetForm();
      ToasterService.showSuccess("Supplement type deleted");
      void refetch();
    } catch (error: any) {
      ToasterService.showError(
        error?.response?.data?.message ||
          error?.data?.message ||
          "Delete failed"
      );
    }
  };

  return (
    <PageShell
      kicker="Store"
      title="Supplement types"
      subtitle="Add types such as Vitamin, Mineral, or Protein. They appear on the supplement form and on the product detail API."
      actions={
        <div style={{ display: "flex", gap: 8 }}>
          {editingId ? (
            <Button variant="outlined" disabled={saving} onClick={resetForm}>
              Cancel edit
            </Button>
          ) : null}
          <Button variant="contained" disabled={saving} onClick={() => void save()}>
            {saving ? "Saving…" : editingId ? "Update type" : "Add type"}
          </Button>
        </div>
      }
    >
      <section className="store-section">
        <h2>{editingId ? "Edit type" : "Add a type"}</h2>
        <div className="store-editor__row">
          <TextField
            label="Type name"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            fullWidth
            placeholder="Vitamin"
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
        />
      </section>

      <section className="store-section" style={{ marginTop: 20 }}>
        <h2>Current types</h2>
        <div className="store-section-list">
          {(isLoading || isFetching) && items.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <article key={`sk-${i}`} className="store-section-list__row">
                  <div style={{ flex: 1 }}>
                    <Skeleton animation="wave" height={22} width="40%" />
                    <Skeleton animation="wave" height={16} width="60%" />
                  </div>
                </article>
              ))
            : null}
          {!isLoading && items.length === 0 ? (
            <p style={{ margin: 0, color: "#667066" }}>
              No supplement types yet. Add one above, then pick it when you create a supplement.
            </p>
          ) : null}
          {items.map((row) => {
            const id = row._id || row.id || "";
            return (
              <article key={id || row.key} className="store-section-list__row">
                <div className="store-section-list__main">
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
                    aria-label="Edit type"
                    onClick={() => startEdit(row)}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <ConfirmDeleteButton
                    title="Delete type"
                    message={`Delete “${row.label}”? Products that used it will no longer show this type.`}
                    onConfirm={() => remove(row)}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
