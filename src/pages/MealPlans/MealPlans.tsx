import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import DataTable, { type DataTableColumn } from "@core/templates/DataTable";
import useListQueryParams from "hooks/useListQueryParams";
import { MOCK_MEAL_PLANS } from "mocks/nutritionProduct.mock";

const GOAL_LABEL = {
  weight_loss: "Weight loss",
  muscle_gain: "Muscle gain",
  maintenance: "Maintenance",
} as const;

type Plan = (typeof MOCK_MEAL_PLANS)[number];

export default function MealPlans() {
  const navigate = useNavigate();
  const { page, limit, searchInput, debouncedSearch, setPage, setLimit, setSearch } =
    useListQueryParams({ defaultLimit: 10 });

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return MOCK_MEAL_PLANS;
    return MOCK_MEAL_PLANS.filter(
      (plan) =>
        plan.title.toLowerCase().includes(q) ||
        GOAL_LABEL[plan.goal].toLowerCase().includes(q) ||
        plan.status.toLowerCase().includes(q)
    );
  }, [debouncedSearch]);

  const rows = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  const columns: DataTableColumn<Plan>[] = [
    {
      id: "title",
      label: "Plan",
      render: (plan) => <strong>{plan.title}</strong>,
    },
    {
      id: "goal",
      label: "Goal",
      render: (plan) => GOAL_LABEL[plan.goal],
    },
    { id: "weeks", label: "Weeks", render: (plan) => plan.weeks },
    { id: "recipes", label: "Recipes", render: (plan) => plan.recipes },
    {
      id: "subscribers",
      label: "Subscribers",
      render: (plan) => plan.subscribers.toLocaleString(),
    },
    {
      id: "status",
      label: "Status",
      render: (plan) => (
        <StatusChip
          label={plan.status}
          tone={
            plan.status === "published"
              ? "ok"
              : plan.status === "draft"
                ? "warn"
                : "info"
          }
        />
      ),
    },
    {
      id: "actions",
      label: "Action",
      action: true,
      render: (plan) => (
        <Button size="small" variant="text" onClick={() => navigate(`/meal-plans/${plan.id}`)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <PageShell
      kicker="Content"
      title="Meal plans"
      subtitle="Weekly planners with publish / draft / schedule. Drag-and-drop builder ships next."
      actions={
        <Button variant="contained" onClick={() => navigate("/meal-plans/new")}>
          New plan
        </Button>
      }
    >
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        total={filtered.length}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        searchValue={searchInput}
        onSearchChange={setSearch}
        searchPlaceholder="Search meal plans…"
        emptyMessage="No meal plans match your search."
      />
    </PageShell>
  );
}
