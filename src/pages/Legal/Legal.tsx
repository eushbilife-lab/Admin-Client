import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, MenuItem, Skeleton, TextField } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import legalService from "services/legal.service";
import ToasterService from "utils/toaster.util";
import "./Legal.css";

const FALLBACK_KEYS = ["privacy", "terms", "shipping", "refund", "help"] as const;

const KEY_LABEL: Record<string, string> = {
  privacy: "Privacy Policy",
  terms: "Terms & Conditions",
  shipping: "Shipping Policy",
  refund: "Refund Policy",
  help: "Help Center",
};

type LegalPage = {
  _id?: string;
  key: string;
  title: string;
  body: string;
  locale?: string;
  status?: string;
  updatedAt?: string;
  updatedBy?: string;
};

export default function Legal() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [keys, setKeys] = useState<string[]>([...FALLBACK_KEYS]);
  const [activeKey, setActiveKey] = useState<string>("privacy");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("published");
  const [locale, setLocale] = useState("en");

  const load = useCallback(async () => {
    setLoading(true);
    const [success, error]: any = await legalService.getAll({});
    setLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Failed to load legal pages"
      );
      return;
    }
    const list = (success?.data?.data?.pages || []) as LegalPage[];
    const apiKeys = (success?.data?.data?.keys || FALLBACK_KEYS) as string[];
    setPages(list);
    setKeys(apiKeys);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const activeDoc = useMemo(
    () => pages.find((p) => p.key === activeKey),
    [pages, activeKey]
  );

  useEffect(() => {
    if (activeDoc) {
      setTitle(activeDoc.title || KEY_LABEL[activeKey] || activeKey);
      setBody(activeDoc.body || "");
      setStatus(activeDoc.status || "published");
      setLocale(activeDoc.locale || "en");
    } else {
      setTitle(KEY_LABEL[activeKey] || activeKey);
      setBody("");
      setStatus("published");
      setLocale("en");
    }
  }, [activeDoc, activeKey]);

  const save = async () => {
    if (!title.trim() || !body.trim()) {
      ToasterService.showError("Title and body are required");
      return;
    }
    setSaving(true);
    const [success, error]: any = await legalService.upsert({
      key: activeKey,
      title: title.trim(),
      body: body.trim(),
      status,
      locale,
    });
    setSaving(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Could not save page"
      );
      return;
    }
    ToasterService.showSuccess(success?.data?.message || "Legal page saved");
    await load();
  };

  return (
    <PageShell
      title="Legal pages"
      subtitle="Privacy, terms, shipping, refund, and help content shown in the mobile Settings → Legal screens."
    >
      {loading ? (
        <Skeleton variant="rounded" height={360} />
      ) : (
        <div className="legal-layout">
          <aside className="legal-keys">
            {keys.map((key) => {
              const exists = pages.some((p) => p.key === key);
              return (
                <button
                  key={key}
                  type="button"
                  className={`legal-key${activeKey === key ? " is-active" : ""}`}
                  onClick={() => setActiveKey(key)}
                >
                  <div>{KEY_LABEL[key] || key}</div>
                  <StatusChip
                    label={exists ? "Saved" : "Default"}
                    tone={exists ? "ok" : "info"}
                  />
                </button>
              );
            })}
          </aside>

          <section className="legal-editor">
            <p className="legal-hint">
              Mobile reads published pages from{" "}
              <code>GET /api/v1/settings/legal/{activeKey}</code>. Empty DB falls
              back to built-in copy.
            </p>
            {activeDoc?.updatedAt ? (
              <p className="legal-hint">
                Last updated {new Date(activeDoc.updatedAt).toLocaleString()}
                {activeDoc.updatedBy ? ` by ${activeDoc.updatedBy}` : ""}
              </p>
            ) : null}
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              sx={{ mb: 1.5 }}
            />
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
              sx={{ mb: 1.5 }}
            >
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </TextField>
            <TextField
              select
              label="Locale"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              fullWidth
              sx={{ mb: 1.5 }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ur">Urdu</MenuItem>
            </TextField>
            <TextField
              label="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              fullWidth
              multiline
              minRows={12}
            />
            <div className="legal-editor__actions">
              <Button
                variant="contained"
                disabled={saving}
                onClick={() => void save()}
              >
                {saving ? "Saving…" : "Save page"}
              </Button>
              <Button variant="text" disabled={saving} onClick={() => void load()}>
                Reload
              </Button>
            </div>
          </section>
        </div>
      )}
    </PageShell>
  );
}
