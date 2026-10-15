import { useMemo } from "react";
import { Button } from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import DataTable, { type DataTableColumn } from "@core/templates/DataTable";
import useListQueryParams from "hooks/useListQueryParams";
import { MOCK_DIETITIANS } from "mocks/nutritionProduct.mock";

type Dietitian = (typeof MOCK_DIETITIANS)[number];

export default function Dietitians() {
  const { page, limit, searchInput, debouncedSearch, setPage, setLimit, setSearch } =
    useListQueryParams({ defaultLimit: 10 });

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return MOCK_DIETITIANS;
    return MOCK_DIETITIANS.filter(
      (rd) =>
        rd.name.toLowerCase().includes(q) ||
        rd.email.toLowerCase().includes(q) ||
        rd.credentials.toLowerCase().includes(q) ||
        rd.status.toLowerCase().includes(q)
    );
  }, [debouncedSearch]);

  const rows = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

  const columns: DataTableColumn<Dietitian>[] = [
    {
      id: "name",
      label: "Dietitian",
      render: (rd) => (
        <div>
          <strong>{rd.name}</strong>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{rd.email}</div>
        </div>
      ),
    },
    {
      id: "credentials",
      label: "Credentials",
      render: (rd) => `${rd.credentials}${rd.verified ? " · verified" : " · needs review"}`,
    },
    { id: "clients", label: "Clients", render: (rd) => rd.clients },
    {
      id: "rating",
      label: "Rating",
      render: (rd) => (rd.rating ? `${rd.rating.toFixed(1)} / 5` : "—"),
    },
    {
      id: "status",
      label: "Status",
      render: (rd) => (
        <StatusChip
          label={rd.status}
          tone={
            rd.status === "active" ? "ok" : rd.status === "pending" ? "warn" : "danger"
          }
        />
      ),
    },
    {
      id: "actions",
      label: "Action",
      action: true,
      render: () => (
        <Button size="small" variant="text" disabled>
          View
        </Button>
      ),
    },
  ];

  return (
    <PageShell
      kicker="People"
      title="Dietitians"
      subtitle="Onboarding, credential checks, caseload, and ratings."
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
        searchPlaceholder="Search dietitians…"
        emptyMessage="No dietitians match your search."
      />
    </PageShell>
  );
}
