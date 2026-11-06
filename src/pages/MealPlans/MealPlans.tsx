import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Skeleton } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import DataTable, { type DataTableColumn } from "@core/templates/DataTable";
import useListQueryParams from "hooks/useListQueryParams";
import mealPlanService from "services/mealPlan.service";
import ToasterService from "utils/toaster.util";
import RowActions from "@core/api-components/RowActions";

const GOAL_LABEL: Record<string, string> = {
  weight_loss: "Weight loss",
  muscle_gain: "Muscle gain",
  maintenance: "Maintenance",
};

type Plan = {
  id: string;
  _id?: string;
  title: string;
  goal: string;
  weeks: number;
  recipes: number;
  subscribers: number;
  status: string;
  updatedAt?: string;
};

export default function MealPlans() {
  const navigate = useNavigate();
  const { page, limit, searchInput, debouncedSearch, setPage, setLimit, setSearch } =
    useListQueryParams({ defaultLimit: 10 });
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Plan[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const [success, error]: any = await mealPlanService.getAll({});
    setLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Failed to load meal plans"
      );
      return;
    }
    const plans = (success?.data?.data?.plans || []).map((p: any) => ({
      ...p,
      id: String(p.id || p._id),
      recipes: Number(p.recipes ?? p.recipeIds?.length ?? 0),
      subscribers: Number(p.subscribers) || 0,
    }));
    setItems(plans);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return items;
    return items.filter(
      (plan) =>
        plan.title.toLowerCase().includes(q) ||
        (GOAL_LABEL[plan.goal] || plan.goal).toLowerCase().includes(q) ||
        plan.status.toLowerCase().includes(q)
    );
  }, [debouncedSearch, items]);

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
      render: (plan) => GOAL_LABEL[plan.goal] || plan.goal,
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
        <RowActions
          onEdit={() => navigate(`/meal-plans/${plan.id}`)}
          deleteTitle="Delete meal plan"
          deleteMessage={`Delete “${plan.title}”? Published mobile plans will disappear.`}
          onDelete={async () => {
            const [, error]: any = await mealPlanService.remove(plan.id);
            if (error) {
              ToasterService.showError(
                error?.response?.data?.message || "Delete failed"
              );
              return;
            }
            ToasterService.showSuccess("Meal plan deleted");
            await load();
          }}
        />
      ),
    },
  ];

  return (
    <PageShell
      kicker="Content"
      title="Meal plans"
      subtitle="Weekly planners tied to goals and recipes. Published plans appear on the mobile meal-plans API."
      actions={
        <Button variant="contained" onClick={() => navigate("/meal-plans/new")}>
          New plan
        </Button>
      }
    >
      {loading ? (
        <Skeleton variant="rounded" height={280} />
      ) : (
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
          emptyMessage="No meal plans yet — create the first plan."
        />
      )}
    </PageShell>
  );
}
