export type StatusFilter = "all" | "active" | "inactive";
export type NameSort = "az" | "za";

export function normalizeText(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function matchesSearch(haystacks: unknown[], query: string) {
  const q = normalizeText(query);
  if (!q) return true;
  return haystacks.some((h) => normalizeText(h).includes(q));
}

export function statusOf(row: { status?: string }): "active" | "inactive" {
  return row.status === "inactive" ? "inactive" : "active";
}

export function filterByStatus<T extends { status?: string }>(
  rows: T[],
  status: StatusFilter
) {
  if (status === "all") return rows;
  return rows.filter((row) => statusOf(row) === status);
}

export function sortByName<T>(
  rows: T[],
  getName: (row: T) => string,
  sort: NameSort = "az"
) {
  const list = [...rows];
  list.sort((a, b) => {
    const cmp = getName(a).localeCompare(getName(b), undefined, {
      sensitivity: "base",
    });
    return sort === "za" ? -cmp : cmp;
  });
  return list;
}

export function countByStatus<T extends { status?: string }>(rows: T[]) {
  let active = 0;
  let inactive = 0;
  rows.forEach((row) => {
    if (statusOf(row) === "inactive") inactive += 1;
    else active += 1;
  });
  return { active, inactive, total: rows.length };
}
