import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import NotificationService from "services/notification.service";
import storePromoService from "services/storePromo.service";
import ToasterService from "utils/toaster.util";
import "./Notifications.css";

type Audience = "all" | "user" | "recent" | "newsletter";
type Channel = "inbox" | "push" | "both";
type Priority = "update" | "deal" | "urgent";
type Devices = "all" | "web" | "android" | "ios";

type PromoOpt = { id: string; code: string; title?: string };

const emptyForm = {
  title: "",
  body: "",
  link: "",
  audience: "all" as Audience,
  email: "",
  priority: "update" as Priority,
  channel: "both" as Channel,
  devices: "all" as Devices,
  promoId: "",
  promoCode: "",
};

const TEMPLATES: Array<{
  id: string;
  label: string;
  title: string;
  body: string;
  priority: Priority;
}> = [
  {
    id: "deal",
    label: "Promo deal",
    title: "Limited-time store offer",
    body: "Use your promo code at checkout and save on your next Eushbi order.",
    priority: "deal",
  },
  {
    id: "welcome",
    label: "Welcome",
    title: "Welcome to Eushbi Life",
    body: "Your nutrition space is ready — log meals, scan packs, and track macros.",
    priority: "update",
  },
  {
    id: "urgent",
    label: "Urgent",
    title: "Important update",
    body: "Please open the app for an important account notice.",
    priority: "urgent",
  },
];

export default function Notifications() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(emptyForm);
  const [audienceCount, setAudienceCount] = useState<number | null>(null);
  const [pushConfigured, setPushConfigured] = useState<boolean | null>(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [promos, setPromos] = useState<PromoOpt[]>([]);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    const [success]: any = await NotificationService.getAllNotifications({
      page: 1,
      page_size: 30,
    });
    setLoading(false);
    const rows =
      success?.data?.data?.broadcasts ||
      success?.data?.data?.notifications ||
      [];
    setHistory(rows);
  }, []);

  const loadMeta = useCallback(async () => {
    const [[statusOk], [promoOk]]: any = await Promise.all([
      NotificationService.getStatus(),
      storePromoService.getAll({}),
    ]);
    setPushConfigured(
      Boolean(statusOk?.data?.data?.pushConfigured)
    );
    const list = promoOk?.data?.data?.promos || [];
    setPromos(
      list
        .filter((p: any) => ["published", "active"].includes(p.status))
        .map((p: any) => ({
          id: String(p._id || p.id),
          code: p.code,
          title: p.title,
        }))
    );
  }, []);

  const refreshAudience = useCallback(async () => {
    const [success]: any = await NotificationService.getAudience(
      form.audience,
      form.email
    );
    setAudienceCount(
      typeof success?.data?.data?.count === "number"
        ? success.data.data.count
        : null
    );
  }, [form.audience, form.email]);

  useEffect(() => {
    void loadHistory();
    void loadMeta();
  }, [loadHistory, loadMeta]);

  useEffect(() => {
    void refreshAudience();
  }, [refreshAudience]);

  // Deep-link from Store Promos → /notifications?promo=CODE&promoId=…
  useEffect(() => {
    const code = (searchParams.get("promo") || "").toUpperCase();
    const promoId = searchParams.get("promoId") || "";
    if (!code && !promoId) return;
    setForm((f) => ({
      ...f,
      promoCode: code || f.promoCode,
      promoId: promoId || f.promoId,
      priority: "deal",
      title: code ? `Promo ${code} is live` : f.title,
      body: code
        ? `Use code ${code} at checkout to unlock your Eushbi store discount.`
        : f.body,
      link: code ? `/store?promo=${encodeURIComponent(code)}` : f.link,
      channel: "both",
    }));
  }, [searchParams]);

  const selectedPromo = useMemo(
    () => promos.find((p) => p.id === form.promoId || p.code === form.promoCode),
    [form.promoCode, form.promoId, promos]
  );

  const applyTemplate = (id: string) => {
    const t = TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    setForm((f) => ({
      ...f,
      title: t.title,
      body: t.body,
      priority: t.priority,
    }));
  };

  const onPromoPick = (promoId: string) => {
    const promo = promos.find((p) => p.id === promoId);
    if (!promo) {
      setForm((f) => ({ ...f, promoId: "", promoCode: "" }));
      return;
    }
    setForm((f) => ({
      ...f,
      promoId: promo.id,
      promoCode: promo.code,
      priority: "deal",
      title: f.title || `Promo ${promo.code} is live`,
      body:
        f.body ||
        `Use code ${promo.code} at checkout${
          promo.title ? ` — ${promo.title}` : ""
        }.`,
      link: `/store?promo=${encodeURIComponent(promo.code)}`,
    }));
  };

  const send = async () => {
    if (form.title.trim().length < 2 || form.body.trim().length < 2) {
      ToasterService.showError("Title and message are required");
      return;
    }
    if (form.audience === "user" && !form.email.trim()) {
      ToasterService.showError("Enter the member email");
      return;
    }
    setSending(true);
    const [success, error]: any = await NotificationService.send({
      title: form.title.trim(),
      body: form.body.trim(),
      link: form.link.trim(),
      audience: form.audience,
      email: form.email.trim(),
      priority: form.priority,
      channel: form.channel,
      devices: form.devices,
      promoId: form.promoId || undefined,
      promoCode: form.promoCode || undefined,
    });
    setSending(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Failed to send notification"
      );
      return;
    }
    const data = success?.data?.data || {};
    ToasterService.showSuccess(
      `Sent to ${data.recipientCount ?? "members"} · push ${data.pushSent ?? 0} ok / ${data.pushFailed ?? 0} failed`
    );
    setForm((f) => ({
      ...emptyForm,
      audience: f.audience,
      channel: f.channel,
    }));
    await loadHistory();
  };

  const remove = async (row: any) => {
    const id = row._id || row.id;
    if (!id) return;
    if (!window.confirm("Delete this broadcast and its inbox copies?")) return;
    const [, error]: any = await NotificationService.remove(id);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Delete failed"
      );
      return;
    }
    ToasterService.showSuccess("Broadcast deleted");
    await loadHistory();
  };

  const reuse = (row: any) => {
    setForm({
      title: row.title || "",
      body: row.body || row.content || "",
      link: row.link || row.url || "",
      audience: (row.audience as Audience) || "all",
      email: row.email || "",
      priority: (row.priority as Priority) || "update",
      channel: (row.channel as Channel) || "both",
      devices: (row.devices as Devices) || "all",
      promoId: row.promoId ? String(row.promoId) : "",
      promoCode: row.promoCode || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageShell
      kicker="Operations"
      title="Notifications"
      subtitle="Compose inbox + Firebase push to members. Attach a store promo to deep-link checkout."
      actions={
        <Tooltip title="Refresh history">
          <IconButton onClick={() => void loadHistory()} aria-label="Refresh">
            <RefreshRoundedIcon />
          </IconButton>
        </Tooltip>
      }
    >
      <div className="notif-layout">
        <section className="notif-composer">
          <header className="notif-composer__head">
            <div>
              <h3>Compose</h3>
              <p>
                Push{" "}
                {pushConfigured == null
                  ? "…"
                  : pushConfigured
                    ? "configured"
                    : "not configured — set FIREBASE_* on Admin Server"}
                {audienceCount != null ? ` · ~${audienceCount} recipients` : ""}
              </p>
            </div>
            <div className="notif-templates">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="notif-chip"
                  onClick={() => applyTemplate(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </header>

          <div className="notif-form">
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              fullWidth
              size="small"
            />
            <TextField
              label="Message"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              fullWidth
              size="small"
              multiline
              minRows={3}
            />
            <div className="notif-form__row">
              <TextField
                select
                label="Audience"
                value={form.audience}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    audience: e.target.value as Audience,
                  }))
                }
                size="small"
              >
                <MenuItem value="all">All active members</MenuItem>
                <MenuItem value="recent">Joined last 30 days</MenuItem>
                <MenuItem value="newsletter">Newsletter opted-in</MenuItem>
                <MenuItem value="user">One member (email)</MenuItem>
              </TextField>
              <TextField
                select
                label="Channel"
                value={form.channel}
                onChange={(e) =>
                  setForm((f) => ({ ...f, channel: e.target.value as Channel }))
                }
                size="small"
              >
                <MenuItem value="both">Inbox + Push</MenuItem>
                <MenuItem value="inbox">Inbox only</MenuItem>
                <MenuItem value="push">Push only</MenuItem>
              </TextField>
              <TextField
                select
                label="Devices"
                value={form.devices}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    devices: e.target.value as Devices,
                  }))
                }
                size="small"
                disabled={form.channel === "inbox"}
              >
                <MenuItem value="all">All devices</MenuItem>
                <MenuItem value="android">Android</MenuItem>
                <MenuItem value="ios">iOS</MenuItem>
                <MenuItem value="web">Web</MenuItem>
              </TextField>
              <TextField
                select
                label="Priority"
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    priority: e.target.value as Priority,
                  }))
                }
                size="small"
              >
                <MenuItem value="update">Update</MenuItem>
                <MenuItem value="deal">Deal / promo</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </TextField>
            </div>

            {form.audience === "user" ? (
              <TextField
                label="Member email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                fullWidth
                size="small"
              />
            ) : null}

            <div className="notif-form__row">
              <TextField
                select
                label="Attach promo"
                value={form.promoId || ""}
                onChange={(e) => onPromoPick(e.target.value)}
                size="small"
                fullWidth
                helperText={
                  selectedPromo
                    ? `Deep link → /store?promo=${selectedPromo.code}`
                    : "Optional — wires checkout promo code into the push"
                }
              >
                <MenuItem value="">No promo</MenuItem>
                {promos.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.code}
                    {p.title ? ` — ${p.title}` : ""}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Deep link"
                value={form.link}
                onChange={(e) =>
                  setForm((f) => ({ ...f, link: e.target.value }))
                }
                size="small"
                fullWidth
                placeholder="/store?promo=WELCOME10"
              />
            </div>

            <div className="notif-composer__actions">
              <Button
                variant="contained"
                disabled={sending}
                onClick={() => void send()}
              >
                {sending ? "Sending…" : "Send notification"}
              </Button>
            </div>
          </div>
        </section>

        <section className="notif-history">
          <header className="notif-composer__head">
            <div>
              <h3>Sent history</h3>
              <p>Reuse or delete past broadcasts.</p>
            </div>
          </header>
          {loading ? (
            <p className="notif-empty">Loading…</p>
          ) : history.length === 0 ? (
            <p className="notif-empty">No broadcasts yet.</p>
          ) : (
            <ul className="notif-history__list">
              {history.map((row) => (
                <li key={row._id || row.id} className="notif-history__item">
                  <div>
                    <strong>{row.title}</strong>
                    <p>{row.body || row.content}</p>
                    <div className="notif-history__meta">
                      <StatusChip
                        label={row.channel || "both"}
                        tone="info"
                      />
                      {row.priority && row.priority !== "update" ? (
                        <StatusChip
                          label={row.priority}
                          tone={row.priority === "urgent" ? "danger" : "warn"}
                        />
                      ) : null}
                      {row.promoCode ? (
                        <StatusChip label={row.promoCode} tone="ok" />
                      ) : null}
                      <span>
                        {row.recipientCount ?? "—"} people · push{" "}
                        {row.pushSent ?? 0}/{row.pushFailed ?? 0}
                      </span>
                    </div>
                  </div>
                  <div className="notif-history__actions">
                    <Button size="small" variant="outlined" onClick={() => reuse(row)}>
                      Reuse
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      aria-label="Delete"
                      onClick={() => void remove(row)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageShell>
  );
}
