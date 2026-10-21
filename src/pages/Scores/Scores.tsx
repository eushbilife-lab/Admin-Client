import {
  StyledTableCell,
  StyledTableCellAction,
  StyledTableRow,
  adminTableSx,
} from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import TableWrapper from "@core/templates/TableWrapper";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useNavigate } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import scoreCalculationService from "services/score.service";
import { scoreCalculationActions } from "redux/slices/scoreCalculation";
import { englishName } from "utils/localizedData.util";
import CatalogToolbar, {
  CatalogMetaPill,
} from "@core/templates/CatalogToolbar";
import {
  matchesSearch,
  sortByName,
  type NameSort,
} from "@core/templates/CatalogToolbar/catalogList.util";
import "./Scores.css";

type ScoreFilter = "all" | "positive" | "negative" | "both";

export default function Scores() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { count, scoreCalculations, loading, refreshLoader, refresh, filters } =
    useAppSelector((state) => state.scoreCalculations);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<NameSort>("az");
  const [side, setSide] = useState<ScoreFilter>("all");

  useEffect(() => {
    scoreCalculationService.getAll(filters, dispatch);
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(scoreCalculationActions.resetPage());
    };
  }, [dispatch]);

  const scoreMeta = (item: any) => {
    const types = (item?.isPositive || []).map(
      (el: any) => el?.value || el?.label
    );
    const hasPos = types.some((t: string) =>
      String(t).toLowerCase().includes("positive")
    );
    const hasNeg = types.some((t: string) =>
      String(t).toLowerCase().includes("negative")
    );
    return { hasPos, hasNeg };
  };

  const items = useMemo(() => {
    let rows = scoreCalculations || [];
    rows = rows.filter((item: any) => {
      const { hasPos, hasNeg } = scoreMeta(item);
      if (side === "positive" && !hasPos) return false;
      if (side === "negative" && !hasNeg) return false;
      if (side === "both" && !(hasPos && hasNeg)) return false;
      return matchesSearch(
        [
          englishName(item?.HNSSProductCategoryID),
          item?.HNSSProductCategoryID?.code,
          item?.code,
        ],
        search
      );
    });
    return sortByName(
      rows,
      (item: any) => String(englishName(item?.HNSSProductCategoryID) || ""),
      sort
    );
  }, [scoreCalculations, search, sort, side]);

  const sideCounts = useMemo(() => {
    let positive = 0;
    let negative = 0;
    let both = 0;
    (scoreCalculations || []).forEach((item: any) => {
      const { hasPos, hasNeg } = scoreMeta(item);
      if (hasPos) positive += 1;
      if (hasNeg) negative += 1;
      if (hasPos && hasNeg) both += 1;
    });
    return { positive, negative, both };
  }, [scoreCalculations]);

  return (
    <PageShell
      kicker="Science"
      title="Health scores"
      subtitle="HNSS / ENLI rules — positive and negative nutrient bands that grade foods."
    >
      <CatalogToolbar
        hint="Each row is a product category with positive and/or negative scoring tables."
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search category name or code… (⌘K)"
        searchAriaLabel="Search health scores"
        sort={sort}
        onSortChange={(v) => setSort(v as NameSort)}
        sortOptions={[
          { value: "az", label: "Sort A–Z" },
          { value: "za", label: "Sort Z–A" },
        ]}
        meta={
          <>
            <CatalogMetaPill>{count} total</CatalogMetaPill>
            <CatalogMetaPill>{items.length} showing</CatalogMetaPill>
          </>
        }
        chips={[
          { id: "all", label: "All" },
          {
            id: "positive",
            label: "Has positive",
            count: sideCounts.positive,
          },
          {
            id: "negative",
            label: "Has negative",
            count: sideCounts.negative,
          },
          { id: "both", label: "Both sides", count: sideCounts.both },
        ]}
        activeChip={side}
        onChipChange={(id) => setSide(id as ScoreFilter)}
        actions={
          <Button variant="contained" onClick={() => navigate("/add-score")}>
            Add score
          </Button>
        }
      />

      <TableWrapper
        refreshing={refreshLoader}
      >
        <TableContainer>
          <Table aria-label="Health scores" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={4}
              loading={loading}
              length={items?.length}
              message={
                search || side !== "all"
                  ? "No scores match your search or filters."
                  : "No health scores yet. Seed or add a category score."
              }
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Category</StyledTableCell>
                  <StyledTableCell>Code</StyledTableCell>
                  <StyledTableCell>Tables</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {items?.map((item: any) => {
                  const code =
                    item?.HNSSProductCategoryID?.code || item?.code || "—";
                  const types = (item?.isPositive || []).map(
                    (el: any) => el?.value || el?.label
                  );
                  const hasPos = types.some((t: string) =>
                    String(t).toLowerCase().includes("positive")
                  );
                  const hasNeg = types.some((t: string) =>
                    String(t).toLowerCase().includes("negative")
                  );
                  const posCount = item?.positiveRuleCount;
                  const negCount = item?.negativeRuleCount;
                  return (
                    <StyledTableRow key={item._id}>
                      <StyledTableCell>
                        <strong>
                          {englishName(item?.HNSSProductCategoryID) || "—"}
                        </strong>
                        <div className="scores-meta">
                          {hasPos ? (
                            <span className="scores-pill scores-pill--pos">
                              Positive
                              {typeof posCount === "number"
                                ? ` · ${posCount}`
                                : ""}
                            </span>
                          ) : null}
                          {hasNeg ? (
                            <span className="scores-pill scores-pill--neg">
                              Negative
                              {typeof negCount === "number"
                                ? ` · ${negCount}`
                                : ""}
                            </span>
                          ) : null}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell>
                        <span className="scores-code">{code}</span>
                      </StyledTableCell>
                      <StyledTableCell>
                        {(hasPos ? 1 : 0) + (hasNeg ? 1 : 0)} side
                        {(hasPos ? 1 : 0) + (hasNeg ? 1 : 0) === 1 ? "" : "s"}
                      </StyledTableCell>
                      <StyledTableCellAction>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => navigate(`/update-score/${item?._id}`)}
                        >
                          Edit
                        </Button>
                      </StyledTableCellAction>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>
        <div className="pagination-list-bottom">
          <p>
            {count > 0 ? `${items.length} shown · ${count} total` : ""}
          </p>
          {count > 0 && (
            <Pagination
              variant="outlined"
              color="primary"
              page={filters.page}
              disabled={refreshLoader}
              count={Math.ceil(count / filters.page_size)}
              onChange={(_e, page) =>
                dispatch(scoreCalculationActions.setPage(page))
              }
            />
          )}
        </div>
      </TableWrapper>
    </PageShell>
  );
}
