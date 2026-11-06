import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, MenuItem, Skeleton, TextField } from "@mui/material";
import DataTable, { type DataTableColumn } from "@core/templates/DataTable";
import StatusChip from "@core/templates/PageShell/StatusChip";
import dietPlanService from "services/dietPlan.service";
import ToasterService from "utils/toaster.util";
import useListQueryParams from "hooks/useListQueryParams";

type DocRow = {
  id: string;
  title: string;
  templateId: string;
  goal: string;
  calorieTarget: number;
  source: string;
  pdfUrl: string;
  createdAt?: string;
  userLabel: string;
  email: string;
};

const GOAL_LABEL: Record<string, string> = {
  weight_loss: "Lose weight",
  maintenance: "Maintain",
  muscle_gain: "Gain / muscle",
};

export default function DietPlanDocuments() {
  const navigate = useNavigate();
  const { page, limit, searchInput, debouncedSearch, setPage, setLimit, setSearch } =
    useListQueryParams({ defaultLimit: 20 });
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<DocRow[]>([]);
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [templateId, setTemplateId] = useState("");
  const [goal, setGoal] = useState("");
  const [source, setSource] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [success, error]: any = await dietPlanService.getDocuments({
      page,
      limit,
      search: debouncedSearch || undefined,
      templateId: templateId || undefined,
      goal: goal || undefined,
      source: source || undefined,
    });
    setLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Failed to load generated plans"
      );
      return;
    }
    const data = success?.data?.data || {};
    const mapped: DocRow[] = (data.documents || []).map((d: any) => {
      const u = d.user || {};
      return {
        id: String(d.id || d._id),
        title: d.title || d.templateId || "Diet plan",
        templateId: d.templateId || "—",
        goal: d.goal || "—",
        calorieTarget: Number(d.calorieTarget) || 0,
        source: d.source || "—",
        pdfUrl: d.pdfUrl || "",
        createdAt: d.createdAt,
        userLabel: [u.firstName, u.lastName].filter(Boolean).join(" ") || "Member",
        email: u.email || "",
      };
    });
    setRows(mapped);
    setCount(Number(data.count) || mapped.length);
    setPages(Number(data.pages) || 1);
  }, [page, limit, debouncedSearch, templateId, goal, source]);

  useEffect(() => {
    void load();
  }, [load]);

  const columns: DataTableColumn<DocRow>[] = useMemo(
    () => [
      {
        id: "member",
        label: "Member",
        render: (row) => (
          <div>
            <strong>{row.userLabel}</strong>
            {row.email ? <div className="diet-muted">{row.email}</div> : null}
          </div>
        ),
      },
      {
        id: "title",
        label: "Plan",
        render: (row) => (
          <div>
            <strong>{row.title}</strong>
            <div className="diet-muted">{row.templateId}</div>
          </div>
        ),
      },
      {
        id: "goal",
        label: "Goal",
        render: (row) => GOAL_LABEL[row.goal] || row.goal,
      },
      {
        id: "kcal",
        label: "kcal",
        render: (row) => (row.calorieTarget ? `~${row.calorieTarget}` : "—"),
      },
      {
        id: "source",
        label: "Source",
        render: (row) => (
          <StatusChip
            label={row.source}
            tone={row.source === "chat" ? "ok" : "info"}
          />
        ),
      },
      {
        id: "date",
        label: "Created",
        render: (row) =>
          row.createdAt ? new Date(row.createdAt).toLocaleString() : "—",
      },
      {
        id: "actions",
        label: "",
        render: (row) => (
          <div className="diet-plan-row__actions">
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate(`/diet-plans/documents/${row.id}`)}
            >
              Open
            </Button>
            {row.pdfUrl ? (
              <Button
                size="small"
                href={row.pdfUrl}
                target="_blank"
                rel="noreferrer"
              >
                PDF
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="diet-tab">
      <p className="diet-tab__intro">
        Personalized day plans generated from chat or <code>/diet-plans/for-me</code>,
        with PDF links stored in Spaces.
      </p>

      <div className="diet-toolbar diet-toolbar--wrap">
        <TextField
          size="small"
          label="Search title / template"
          value={searchInput}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 200 }}
        />
        <TextField
          select
          size="small"
          label="Template"
          value={templateId}
          onChange={(e) => {
            setTemplateId(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All templates</MenuItem>
          <MenuItem value="weight_loss_keto">Keto / loss</MenuItem>
          <MenuItem value="maintenance_balanced">Maintain</MenuItem>
          <MenuItem value="muscle_gain_high_protein">Gain</MenuItem>
          <MenuItem value="pcos_1200">PCOS</MenuItem>
        </TextField>
        <TextField
          select
          size="small"
          label="Goal"
          value={goal}
          onChange={(e) => {
            setGoal(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All goals</MenuItem>
          <MenuItem value="weight_loss">Lose weight</MenuItem>
          <MenuItem value="maintenance">Maintain</MenuItem>
          <MenuItem value="muscle_gain">Gain / muscle</MenuItem>
        </TextField>
        <TextField
          select
          size="small"
          label="Source"
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All sources</MenuItem>
          <MenuItem value="chat">chat</MenuItem>
          <MenuItem value="for_me">for_me</MenuItem>
          <MenuItem value="api">api</MenuItem>
        </TextField>
        <Button size="small" variant="outlined" onClick={() => void load()}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <Skeleton height={280} sx={{ borderRadius: 2 }} />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          emptyMessage="No generated diet plans yet."
          page={page}
          limit={limit}
          total={count}
          onPageChange={setPage}
          onLimitChange={(n) => {
            setLimit(n);
            setPage(1);
          }}
        />
      )}
      {!loading ? (
        <p className="diet-muted" style={{ marginTop: 8 }}>
          Showing page {page} of {pages} · {count} total
        </p>
      ) : null}
    </div>
  );
}
