import { useEffect, useRef, useState, type FormEvent } from "react";
import PageShell from "@core/templates/PageShell";
import NotificationService from "services/notification.service";
import http from "services/http.service";
import Promisable from "services/promisable.service";
import ToasterService from "utils/toaster.util";
import "./Notifications.css";

type Channel = "inbox" | "push" | "both";
type Audience = "all" | "recent" | "newsletter" | "user";
type Priority = "update" | "deal" | "urgent";
type Devices = "all" | "web" | "android" | "ios";

type SentRow = {
  id: string;
  title: string;
  body: string;
  link: string;
  image: string;
  channel: Channel;
  priority: Priority;
  audience: Audience;
  devices: Devices;
  email: string;
  promoCode: string;
  recipientCount: number;
  pushSent: number;
  createdAt: string;
};

const CHANNELS: { id: Channel; label: string; detail: string }[] = [
  { id: "inbox", label: "In-app", detail: "Saved in the bell. No phone popup." },
  { id: "push", label: "Push", detail: "Popup on the phone. Not saved in the bell." },
  { id: "both", label: "Both", detail: "Popup, and a copy stays in the bell." },
];

const HISTORY_FILTERS: { id: "" | Channel; label: string }[] = [
  { id: "", label: "All" },
  { id: "inbox", label: "In-app" },
  { id: "push", label: "Push" },
  { id: "both", label: "Both" },
];

const AUDIENCES: { id: Audience; label: string; detail: string }[] = [
  { id: "all", label: "Everyone", detail: "Every active account" },
  { id: "recent", label: "New members", detail: "Joined in the last 30 days" },
  { id: "newsletter", label: "Newsletter", detail: "Accounts that opted in" },
  { id: "user", label: "One email", detail: "A single account" },
];

const DEVICES: { id: Devices; label: string }[] = [
  { id: "all", label: "All devices" },
  { id: "android", label: "Android" },
  { id: "ios", label: "iPhone" },
  { id: "web", label: "Website" },
];

const PRIORITIES: { id: Priority; label: string }[] = [
  { id: "update", label: "Update" },
  { id: "deal", label: "Deal" },
  { id: "urgent", label: "Urgent" },
];

const QUICK_LINKS = [
  { label: "Home", path: "/dashBoard" },
  { label: "Diet plan", path: "/chat/plan" },
  { label: "Store", path: "/store" },
  { label: "Inbox", path: "/notifications" },
];

const TEMPLATES: {
  id: string;
  label: string;
  title: string;
  body: string;
  link: string;
  channel: Channel;
  priority: Priority;
}[] = [
  {
    id: "welcome",
    label: "Welcome",
    title: "Welcome to Eushbi Life",
    body: "Your profile is ready. Log a meal whenever you eat and your day plan stays with you.",
    link: "/dashBoard",
    channel: "both",
    priority: "update",
  },
  {
    id: "plan",
    label: "Day plan",
    title: "Your day plan is ready",
    body: "Your meals and PDF are saved. Open them any time from your plan.",
    link: "/chat/plan",
    channel: "both",
    priority: "update",
  },
  {
    id: "meal",
    label: "Meal",
    title: "Time for your meal",
    body: "Log what you eat so today's rings stay right.",
    link: "/dashBoard",
    channel: "both",
    priority: "update",
  },
  {
    id: "deal",
    label: "Offer",
    title: "A short offer from Eushbi",
    body: "Use your promo code at checkout and save on your next order.",
    link: "/store",
    channel: "both",
    priority: "deal",
  },
];

const DRAFT_KEY = "eushbi_admin_notif_draft";
const PAGE_SIZE = 8;

function readDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function asChannel(value: unknown): Channel {
  return value === "inbox" || value === "push" || value === "both" ? value : "both";
}

function asAudience(value: unknown): Audience {
  return value === "user" || value === "recent" || value === "newsletter" ? value : "all";
}

function asDevices(value: unknown): Devices {
  return value === "web" || value === "android" || value === "ios" ? value : "all";
}

function asPriority(value: unknown): Priority {
  return value === "deal" || value === "urgent" ? value : "update";
}

function mapRow(raw: any): SentRow {
  return {
    id: String(raw.id || raw._id || ""),
    title: String(raw.title || ""),
    body: String(raw.body || ""),
    link: String(raw.link || ""),
    image: String(raw.image || "").startsWith("https://") ? String(raw.image) : "",
    channel: asChannel(raw.channel),
    priority: asPriority(raw.priority),
    audience: asAudience(raw.audience),
    devices: asDevices(raw.devices),
    email: String(raw.email || ""),
    promoCode: String(raw.promoCode || ""),
    recipientCount: Number(raw.recipientCount) || 0,
    pushSent: Number(raw.pushSent) || 0,
    createdAt: String(raw.createdAt || ""),
  };
}

function deviceLabel(devices: Devices) {
  return DEVICES.find((item) => item.id === devices)?.label ?? "All devices";
}

function channelLabel(channel: Channel) {
  return CHANNELS.find((item) => item.id === channel)?.label ?? "Both";
}

function audienceLabel(audience: Audience, email = "") {
  if (audience === "user") return email || "One email";
  return AUDIENCES.find((item) => item.id === audience)?.label ?? "Everyone";
}

function when(iso: string) {
  const date = new Date(iso);
  return Number.isFinite(date.getTime()) ? date.toLocaleString() : "";
}

function SentOptions({
  onReuse,
  onDelete,
}: {
  onReuse: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className="notif-admin__more" ref={menuRef}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        More
      </button>
      {open ? (
        <div className="notif-admin__menu" role="menu">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onReuse();
            }}
          >
            Use again
          </button>
          <button
            type="button"
            className="is-danger"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function Notifications() {
  const draft = useRef(readDraft());
  const fileRef = useRef<HTMLInputElement>(null);
  const [pushOn, setPushOn] = useState<boolean | null>(null);
  const [title, setTitle] = useState(draft.current.title ?? "");
  const [body, setBody] = useState(draft.current.body ?? "");
  const [link, setLink] = useState(draft.current.link ?? "");
  const [image, setImage] = useState(
    String(draft.current.image || "").startsWith("https://") ? draft.current.image : ""
  );
  const [channel, setChannel] = useState<Channel>(asChannel(draft.current.channel));
  const [priority, setPriority] = useState<Priority>(asPriority(draft.current.priority));
  const [audience, setAudience] = useState<Audience>(asAudience(draft.current.audience));
  const [devices, setDevices] = useState<Devices>(asDevices(draft.current.devices));
  const [email, setEmail] = useState(draft.current.email ?? "");
  const [promoCode, setPromoCode] = useState(draft.current.promoCode ?? "");
  const [audienceCount, setAudienceCount] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [historySearch, setHistorySearch] = useState("");
  const [historyQuery, setHistoryQuery] = useState("");
  const [historyChannel, setHistoryChannel] = useState<"" | Channel>("");
  const [rows, setRows] = useState<SentRow[]>([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const emailReady = audience === "user" && email.includes("@");
  const countReady = audience !== "user" || emailReady;
  const showPush = channel !== "inbox";
  const showInbox = channel !== "push";

  const loadHistory = async (nextPage = page, query = historyQuery, filter = historyChannel) => {
    setLoading(true);
    const [success]: any = await NotificationService.getAllNotifications({
      page: nextPage,
      page_size: PAGE_SIZE,
      search: query,
      channel: filter,
    });
    setLoading(false);
    const data = success?.data?.data || {};
    const list = (data.notifications || data.broadcasts || []).map(mapRow).filter((row: SentRow) => row.id);
    const total = Number(data.count || data.totalCount || 0);
    setRows(list);
    setPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));
  };

  useEffect(() => {
    void NotificationService.getStatus().then(([success]: any) => {
      setPushOn(Boolean(success?.data?.data?.pushConfigured));
    });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHistoryQuery(historySearch.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [historySearch]);

  useEffect(() => {
    void loadHistory(page, historyQuery, historyChannel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, historyQuery, historyChannel]);

  useEffect(() => {
    if (!countReady) {
      setAudienceCount(null);
      return;
    }
    const timer = window.setTimeout(() => {
      void NotificationService.getAudience(audience, emailReady ? email.trim() : "").then(
        ([success]: any) => {
          const count = success?.data?.data?.count;
          setAudienceCount(typeof count === "number" ? count : null);
        }
      );
    }, 250);
    return () => window.clearTimeout(timer);
  }, [audience, email, countReady, emailReady]);

  useEffect(() => {
    sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ title, body, link, image, channel, priority, audience, devices, email, promoCode })
    );
  }, [title, body, link, image, channel, priority, audience, devices, email, promoCode]);

  const onPickImage = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      ToasterService.showError("Choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      ToasterService.showError("Use an image under 5 MB.");
      return;
    }
    setUploading(true);
    http.setJWT();
    const formData = new FormData();
    formData.append("file", file);
    const [success]: any = await Promisable.asPromise(
      http.post("/uploads/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
    setUploading(false);
    const url = String(success?.data?.data?.url?.[0]?.path || "");
    if (!url.startsWith("https://")) {
      ToasterService.showError("The image link was not saved.");
      return;
    }
    setImage(url);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextTitle = title.trim();
    const nextBody = body.trim();
    const nextLink = link.trim();
    if (nextTitle.length < 2 || nextBody.length < 2) {
      ToasterService.showError("Add a title and a message.");
      return;
    }
    if (
      nextLink &&
      !nextLink.startsWith("/") &&
      !nextLink.startsWith("https://") &&
      !nextLink.startsWith("eushbi://")
    ) {
      ToasterService.showError("The link must start with /, https://, or eushbi://");
      return;
    }
    if (audience === "user" && !email.trim()) {
      ToasterService.showError("Enter the user email.");
      return;
    }
    if (channel !== "inbox" && pushOn === false) {
      ToasterService.showError("Push is not connected. Send as in-app, or add the Firebase key.");
      return;
    }
    if (audience !== "user") {
      const where =
        channel === "inbox"
          ? "It goes in the bell. No phone popup."
          : channel === "push"
            ? `A popup goes to ${deviceLabel(devices).toLowerCase()}. It is not saved in the bell.`
            : `It goes in the bell, and a popup goes to ${deviceLabel(devices).toLowerCase()}.`;
      const ok = window.confirm(
        `Send "${nextTitle}" to ${audienceCount ?? 0} accounts?\n${where}`
      );
      if (!ok) return;
    }
    setSending(true);
    const [success, error]: any = await NotificationService.send({
      title: nextTitle,
      body: nextBody,
      link: nextLink,
      image,
      channel,
      priority,
      audience,
      devices: channel === "inbox" ? "all" : devices,
      email: audience === "user" ? email.trim() : "",
      promoCode: promoCode.trim(),
    });
    setSending(false);
    if (error || !success) {
      ToasterService.showError(error?.response?.data?.message || "Could not send the notification");
      return;
    }
    const result = success?.data?.data?.broadcast || {};
    setTitle("");
    setBody("");
    setLink("");
    setImage("");
    setEmail("");
    setPromoCode("");
    setPriority("update");
    sessionStorage.removeItem(DRAFT_KEY);
    setPage(1);
    void loadHistory(1, historyQuery, historyChannel);
    const people = Number(result.recipientCount) || audienceCount || 0;
    if (channel === "inbox") {
      ToasterService.showSuccess(`In-app alert sent to ${people}.`);
    } else if (Number(result.pushSent) > 0) {
      ToasterService.showSuccess(`Push went to ${result.pushSent} device${result.pushSent === 1 ? "" : "s"}.`);
    } else {
      ToasterService.showSuccess(`Sent to ${people}. No device accepted the popup.`);
    }
  };

  const applySent = (row: SentRow) => {
    setTitle(row.title);
    setBody(row.body);
    setLink(row.link);
    setImage(row.image);
    setChannel(row.channel);
    setPriority(row.priority);
    setAudience(row.audience);
    setDevices(row.devices);
    setEmail(row.audience === "user" ? row.email : "");
    setPromoCode(row.promoCode);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteSent = async (row: SentRow) => {
    if (!window.confirm(`Delete “${row.title}”? This removes it from the sent list.`)) return;
    const [, error]: any = await NotificationService.remove(row.id);
    if (error) {
      ToasterService.showError("Could not delete the notification");
      return;
    }
    ToasterService.showSuccess("Notification deleted");
    void loadHistory();
  };

  const previewTitle = title.trim() || "Your title";
  const previewBody = body.trim() || "The message people will read.";

  return (
    <PageShell
      kicker="Operations"
      title="Notifications"
      subtitle="Send an in-app alert, a phone popup, or both. Add an image when the message needs one."
    >
      <div className="notif-admin">
        <div className="notif-admin__stats">
          <article>
            <span>In-app</span>
            <strong>Ready</strong>
            <small>Always saved in the bell</small>
          </article>
          <article className={pushOn ? "is-on" : ""}>
            <span>Push</span>
            <strong>{pushOn ? "Connected" : "Off"}</strong>
            <small>{pushOn ? "Android, iPhone, and website" : "Add the Firebase key on this server"}</small>
          </article>
          <article>
            <span>Audience</span>
            <strong>{countReady ? audienceCount ?? "—" : "—"}</strong>
            <small>{audienceLabel(audience)}</small>
          </article>
        </div>

        <div className="notif-admin__layout">
          <form className="notif-admin__form" onSubmit={onSubmit}>
            <section>
              <h2>Delivery</h2>
              <div className="notif-admin__channels">
                {CHANNELS.map((item) => (
                  <label key={item.id} className={channel === item.id ? "is-on" : ""}>
                    <input
                      type="radio"
                      name="channel"
                      checked={channel === item.id}
                      onChange={() => setChannel(item.id)}
                    />
                    <strong>{item.label}</strong>
                    <span>{item.detail}</span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h2>Start from</h2>
              <div className="notif-admin__pills">
                {TEMPLATES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTitle(item.title);
                      setBody(item.body);
                      setLink(item.link);
                      setChannel(item.channel);
                      setPriority(item.priority);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2>Message</h2>
              <label className="notif-admin__field">
                <span>
                  Title <em>{title.length}/120</em>
                </span>
                <input value={title} maxLength={120} onChange={(event) => setTitle(event.target.value)} required />
              </label>
              <label className="notif-admin__field">
                <span>
                  Message <em>{body.length}/500</em>
                </span>
                <textarea
                  value={body}
                  maxLength={500}
                  rows={4}
                  onChange={(event) => setBody(event.target.value)}
                  required
                />
              </label>
              {showPush && (title.length > 50 || body.length > 140) ? (
                <p className="notif-admin__hint">
                  Phone popups show about 50 characters of the title and 140 of the message. The bell keeps the full text.
                </p>
              ) : null}
              <div className="notif-admin__pills">
                {PRIORITIES.map((item) => (
                  <label key={item.id} className={priority === item.id ? "is-on" : ""}>
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === item.id}
                      onChange={() => setPriority(item.id)}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h2>Image</h2>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={(event) => {
                  void onPickImage(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              {image ? (
                <div className="notif-admin__shot">
                  <img src={image} alt="" />
                  <button type="button" onClick={() => setImage("")}>
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="notif-admin__drop"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  {uploading ? "Uploading…" : "Add an image"}
                  <small>JPG, PNG, or WebP. Up to 5 MB. Shown in the popup and the bell.</small>
                </button>
              )}
            </section>

            <section>
              <h2>Opens</h2>
              <div className="notif-admin__links">
                {QUICK_LINKS.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    className={link === item.path ? "is-on" : ""}
                    onClick={() => setLink(item.path)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <label className="notif-admin__field">
                Page path
                <input
                  value={link}
                  maxLength={200}
                  placeholder="/dashBoard"
                  onChange={(event) => setLink(event.target.value)}
                />
              </label>
            </section>

            {showPush ? (
              <section>
                <h2>Popup devices</h2>
                <div className="notif-admin__pills">
                  {DEVICES.map((item) => (
                    <label key={item.id} className={devices === item.id ? "is-on" : ""}>
                      <input
                        type="radio"
                        name="devices"
                        checked={devices === item.id}
                        onChange={() => setDevices(item.id)}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <h2>Audience</h2>
              <div className="notif-admin__pills">
                {AUDIENCES.map((item) => (
                  <label key={item.id} className={audience === item.id ? "is-on" : ""}>
                    <input
                      type="radio"
                      name="audience"
                      checked={audience === item.id}
                      onChange={() => setAudience(item.id)}
                    />
                    {item.label}
                    {audience === item.id && audienceCount != null && item.id !== "user"
                      ? ` · ${audienceCount}`
                      : ""}
                  </label>
                ))}
              </div>
              {audience === "user" ? (
                <label className="notif-admin__field">
                  User email
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                  {emailReady ? (
                    <small>
                      {audienceCount ? "This account will receive it." : "No active account uses that email."}
                    </small>
                  ) : null}
                </label>
              ) : (
                <p className="notif-admin__hint">{AUDIENCES.find((item) => item.id === audience)?.detail}</p>
              )}
              <label className="notif-admin__field">
                Promo code
                <input
                  value={promoCode}
                  maxLength={40}
                  placeholder="Optional store code"
                  onChange={(event) => setPromoCode(event.target.value)}
                />
              </label>
            </section>

            <button
              type="submit"
              className="notif-admin__send"
              disabled={sending || uploading || !countReady || audienceCount === 0}
            >
              {sending
                ? "Sending…"
                : `Send ${channelLabel(channel).toLowerCase()} to ${audienceCount ?? 0}`}
            </button>
          </form>

          <aside className="notif-admin__preview" aria-label="Preview">
            <p>What people see</p>
            <ul className="notif-admin__check">
              <li>{channelLabel(channel)}</li>
              <li>{PRIORITIES.find((item) => item.id === priority)?.label}</li>
              <li>
                {audienceLabel(audience, email)} · {countReady ? audienceCount ?? "—" : "—"}
              </li>
              <li>{image ? "Image attached" : "No image"}</li>
              <li>{link.trim() || "No page link"}</li>
            </ul>
            {showPush ? (
              <div className="notif-admin__lock">
                <span className="notif-admin__tag">Push</span>
                <article>
                  {image ? <img src={image} alt="" /> : null}
                  <div>
                    <em>Eushbi · now</em>
                    <strong>{previewTitle}</strong>
                    <span>{previewBody}</span>
                  </div>
                </article>
              </div>
            ) : null}
            {showInbox ? (
              <div className="notif-admin__bell">
                <span className="notif-admin__tag">In-app</span>
                <article>
                  <strong>{previewTitle}</strong>
                  <em>Just now</em>
                  <span>{previewBody}</span>
                  {image ? <img src={image} alt="" /> : null}
                  <small>{link.trim() ? `Opens ${link.trim()}` : "Stays in the bell"}</small>
                </article>
              </div>
            ) : null}
          </aside>
        </div>

        <div className="notif-admin__history-head">
          <h2>Sent</h2>
          <div className="notif-admin__pills">
            {HISTORY_FILTERS.map((item) => (
              <button
                key={item.id || "all"}
                type="button"
                className={historyChannel === item.id ? "is-on" : ""}
                onClick={() => {
                  setHistoryChannel(item.id);
                  setPage(1);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <input
            value={historySearch}
            placeholder="Search sent messages"
            onChange={(event) => setHistorySearch(event.target.value)}
          />
        </div>

        {loading ? (
          <p className="notif-admin__empty">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="notif-admin__empty">
            {historyQuery || historyChannel ? "Nothing matches." : "Nothing has been sent yet."}
          </p>
        ) : (
          <ul className="notif-admin__cards">
            {rows.map((row) => (
              <li key={row.id}>
                {row.image ? <img src={row.image} alt="" /> : <span className="notif-admin__blank" />}
                <div>
                  <div className="notif-admin__badges">
                    {row.channel !== "push" ? <span className="is-inbox">In-app</span> : null}
                    {row.channel !== "inbox" ? <span className="is-push">Push</span> : null}
                    {row.priority !== "update" ? (
                      <span className={`is-${row.priority}`}>
                        {PRIORITIES.find((item) => item.id === row.priority)?.label}
                      </span>
                    ) : null}
                  </div>
                  <strong>{row.title}</strong>
                  <p>{row.body}</p>
                  <small>
                    {when(row.createdAt)}
                    {row.link ? ` · ${row.link}` : ""}
                  </small>
                </div>
                <div className="notif-admin__meta">
                  <SentOptions onReuse={() => applySent(row)} onDelete={() => void deleteSent(row)} />
                  <span>{audienceLabel(row.audience, row.email)}</span>
                  {row.channel !== "inbox" ? <span>{deviceLabel(row.devices)}</span> : null}
                  <span>{row.recipientCount} people</span>
                  {row.channel !== "inbox" ? (
                    <span>{row.pushSent > 0 ? `${row.pushSent} delivered` : "Popup not delivered"}</span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}

        {pages > 1 ? (
          <div className="notif-admin__pager">
            <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
              Previous
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button type="button" disabled={page >= pages} onClick={() => setPage((current) => current + 1)}>
              Next
            </button>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
