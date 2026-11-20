import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, MenuItem, TextField } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import { useAppSelector } from "redux/hooks";
import {
  useGetInboxQuery,
  useMarkAllInboxReadMutation,
  useMarkInboxReadMutation,
  useRemoveInboxItemMutation,
  type InboxItem,
} from "redux/api/inbox/inboxApi";
import "./Inbox.css";

const TYPES = [
  { value: "", label: "All types" },
  { value: "user.signup", label: "New members" },
  { value: "user.support", label: "Support" },
  { value: "user.order", label: "Orders" },
  { value: "user.review", label: "Reviews" },
  { value: "user.nutritionist", label: "Nutritionist" },
  { value: "user.profile", label: "Profiles" },
  { value: "user.premium", label: "Plans" },
  { value: "user.account", label: "Accounts" },
  { value: "user.health", label: "Health logs" },
  { value: "admin.action", label: "Staff actions" },
  { value: "admin.session", label: "Sign-ins" },
];

function when(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function canOpen(role: string | undefined, link: string) {
  if (!link) return false;
  if (role === "admin") return true;
  return ["/inbox", "/dashboard", "/products", "/add-product"].includes(link)
    || link.startsWith("/update-product");
}

export default function Inbox() {
  const navigate = useNavigate();
  const role = useAppSelector((state) => state.auth.user?.role);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"all" | "unread" | "read">("all");
  const [type, setType] = useState("");
  const [source, setSource] = useState<"" | "app" | "admin">("");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const query = useMemo(
    () => ({ page, pageSize: 20, status, type, source, q: q.trim(), from, to }),
    [page, status, type, source, q, from, to]
  );
  const { data, isLoading, isFetching } = useGetInboxQuery(query, { pollingInterval: 20000 });
  const [markRead] = useMarkInboxReadMutation();
  const [markAll] = useMarkAllInboxReadMutation();
  const [removeItem] = useRemoveInboxItemMutation();

  const rows = data?.activities || [];
  const pages = Math.max(1, Math.ceil((data?.count || 0) / (data?.pageSize || 20)));

  const open = (item: InboxItem) => {
    if (!item.isRead) void markRead(item.id);
    if (canOpen(role, item.link)) navigate(item.link);
  };

  return (
    <PageShell
      kicker="Ops"
      title="Activity"
      subtitle="Member actions from the app, and each change made in this panel."
      actions={
        <Button variant="outlined" onClick={() => markAll()} disabled={!data?.unreadCount}>
          Mark all read
        </Button>
      }
    >
      <div className="inbox-filters">
        <TextField
          label="Search"
          value={q}
          onChange={(event) => {
            setPage(1);
            setQ(event.target.value);
          }}
          size="small"
          placeholder="Name, title, or message"
        />
        <TextField
          select
          label="Status"
          value={status}
          size="small"
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value as "all" | "unread" | "read");
          }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="unread">Unread</MenuItem>
          <MenuItem value="read">Read</MenuItem>
        </TextField>
        <TextField
          select
          label="From"
          value={source}
          size="small"
          onChange={(event) => {
            setPage(1);
            setSource(event.target.value as "" | "app" | "admin");
          }}
        >
          <MenuItem value="">App and admin</MenuItem>
          <MenuItem value="app">App</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        <TextField
          select
          label="Type"
          value={type}
          size="small"
          onChange={(event) => {
            setPage(1);
            setType(event.target.value);
          }}
        >
          {TYPES.map((item) => (
            <MenuItem key={item.value || "all"} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="From date"
          type="date"
          value={from}
          size="small"
          InputLabelProps={{ shrink: true }}
          onChange={(event) => {
            setPage(1);
            setFrom(event.target.value);
          }}
        />
        <TextField
          label="To date"
          type="date"
          value={to}
          size="small"
          InputLabelProps={{ shrink: true }}
          onChange={(event) => {
            setPage(1);
            setTo(event.target.value);
          }}
        />
      </div>

      <div className="inbox-list">
        {isLoading ? <p className="inbox-empty">Loading activity…</p> : null}
        {!isLoading && rows.length === 0 ? (
          <p className="inbox-empty">No activity matches these filters.</p>
        ) : null}
        {rows.map((item) => (
          <article key={item.id} className={`inbox-row${item.isRead ? "" : " is-unread"}`}>
            <button type="button" className="inbox-row__main" onClick={() => open(item)}>
              <span className="inbox-row__kicker">
                {item.source === "app" ? "App" : "Admin"} · {when(item.createdAt)}
              </span>
              <strong>{item.title}</strong>
              <span>{item.message}</span>
            </button>
            <button
              type="button"
              className="inbox-row__delete"
              onClick={() => removeItem(item.id)}
            >
              Delete
            </button>
          </article>
        ))}
      </div>

      <div className="inbox-pager">
        <span>
          {data?.count || 0} notifications{isFetching && !isLoading ? " · updating" : ""}
          {data?.unreadCount ? ` · ${data.unreadCount} unread` : ""}
        </span>
        <div>
          <Button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
            Previous
          </Button>
          <Button disabled={page >= pages} onClick={() => setPage((value) => value + 1)}>
            Next
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
