import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, MenuItem, Skeleton, TextField } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import nutritionistService from "services/nutritionist.service";
import ToasterService from "utils/toaster.util";
import "./NutritionistRequests.css";

type RequestRow = {
  id: string;
  status: string;
  message: string;
  preferredTime?: string;
  adminNote?: string;
  createdAt?: string;
  user?: { id?: string; name?: string; email?: string } | null;
};

const STATUS_TONE: Record<string, "ok" | "warn" | "info" | "danger"> = {
  pending: "warn",
  accepted: "info",
  completed: "ok",
  canceled: "danger",
};

export default function NutritionistRequests() {
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [items, setItems] = useState<RequestRow[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const payload =
      statusFilter === "all" ? {} : { status: statusFilter };
    const [success, error]: any = await nutritionistService.getAll(payload);
    setLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Failed to load requests"
      );
      return;
    }
    const rows = (success?.data?.data?.requests || []) as RequestRow[];
    setItems(rows);
    const nextNotes: Record<string, string> = {};
    for (const row of rows) {
      nextNotes[row.id] = row.adminNote || "";
    }
    setNotes(nextNotes);
  }, [statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    const base = { all: items.length, pending: 0, accepted: 0, completed: 0, canceled: 0 };
    for (const row of items) {
      if (row.status in base) {
        (base as any)[row.status] += 1;
      }
    }
    return base;
  }, [items]);

  const updateStatus = async (id: string, status: string) => {
    setSavingId(id);
    const [, error]: any = await nutritionistService.update(id, {
      status,
      adminNote: notes[id] || "",
    });
    setSavingId(null);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Could not update request"
      );
      return;
    }
    ToasterService.showSuccess(`Marked ${status}`);
    await load();
  };

  return (
    <PageShell
      title="Nutritionist requests"
      subtitle="Members tap Talk to Nutritionist (Premium). Review, accept, and leave an admin note."
      actions={
        <Button variant="outlined" onClick={() => void load()} disabled={loading}>
          Refresh
        </Button>
      }
    >
      <div className="nr-toolbar">
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ minWidth: 160 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="accepted">Accepted</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="canceled">Canceled</MenuItem>
        </TextField>
        <StatusChip label={`${counts.pending} pending`} tone="warn" />
        <StatusChip label={`${items.length} shown`} tone="info" />
      </div>

      {loading ? (
        <Skeleton variant="rounded" height={280} />
      ) : !items.length ? (
        <div className="nr-empty">No nutritionist requests yet.</div>
      ) : (
        items.map((row) => (
          <article key={row.id} className="nr-card">
            <div className="nr-card__top">
              <div>
                <strong>{row.user?.name || "Member"}</strong>
                <div className="nr-card__meta">
                  {row.user?.email || "—"}
                  {row.preferredTime ? ` · preferred ${row.preferredTime}` : ""}
                </div>
              </div>
              <StatusChip
                label={row.status}
                tone={STATUS_TONE[row.status] || "info"}
              />
            </div>
            <p className="nr-card__message">{row.message}</p>
            <div className="nr-card__meta" style={{ marginBottom: 10 }}>
              {row.createdAt
                ? new Date(row.createdAt).toLocaleString()
                : ""}
            </div>
            <div className="nr-card__actions">
              <TextField
                size="small"
                label="Admin note"
                value={notes[row.id] || ""}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, [row.id]: e.target.value }))
                }
                fullWidth
                multiline
                minRows={2}
              />
              <Button
                size="small"
                variant="outlined"
                disabled={savingId === row.id}
                onClick={() => void updateStatus(row.id, "accepted")}
              >
                Accept
              </Button>
              <Button
                size="small"
                variant="contained"
                disabled={savingId === row.id}
                onClick={() => void updateStatus(row.id, "completed")}
              >
                Complete
              </Button>
              <Button
                size="small"
                color="warning"
                disabled={savingId === row.id}
                onClick={() => void updateStatus(row.id, "canceled")}
              >
                Cancel
              </Button>
            </div>
          </article>
        ))
      )}
    </PageShell>
  );
}
