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
import "./Scores.css";

export default function Scores() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { count, scoreCalculations, loading, refreshLoader, refresh, filters } =
    useAppSelector((state) => state.scoreCalculations);
  const [search, setSearch] = useState("");

  useEffect(() => {
    scoreCalculationService.getAll(filters, dispatch);
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(scoreCalculationActions.resetPage());
    };
  }, [dispatch]);

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = scoreCalculations || [];
    if (!q) return rows;
    return rows.filter((item: any) => {
      const name = String(
        englishName(item?.HNSSProductCategoryID) || ""
      ).toLowerCase();
      const code = String(
        item?.HNSSProductCategoryID?.code || item?.code || ""
      ).toLowerCase();
      return name.includes(q) || code.includes(q);
    });
  }, [scoreCalculations, search]);

  return (
    <PageShell
      kicker="Science"
      title="Health scores"
      subtitle="HNSS / ENLI rules — positive and negative nutrient bands that grade foods."
      actions={
        <Button variant="contained" onClick={() => navigate("/add-score")}>
          Add score
        </Button>
      }
    >
      <div className="scores-toolbar">
        <input
          className="scores-search"
          placeholder="Search category name or code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search health scores"
        />
      </div>

      <TableWrapper>
        <TableContainer>
          <Table aria-label="Health scores" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={4}
              loading={loading}
              length={refreshLoader ? 0 : items?.length}
              message="No health scores yet. Seed or add a category score."
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
