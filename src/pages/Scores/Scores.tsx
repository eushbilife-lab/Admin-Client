import { StyledTableCell, StyledTableCellAction, StyledTableRow, adminTableSx } from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import TableWrapper from "@core/templates/TableWrapper";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useNavigate } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import { useEffect } from "react";
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

export default function Scores() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { count, scoreCalculations, loading, refreshLoader, refresh, filters } =
    useAppSelector((state) => state.scoreCalculations);

  useEffect(() => {
    scoreCalculationService.getAll(filters, dispatch);
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(scoreCalculationActions.resetPage());
    };
  }, [dispatch]);

  return (
    <PageShell
      kicker="Science"
      title="Health scores"
      subtitle="Positive and negative nutrient rules that produce a food’s HNSS score."
      actions={
        <Button variant="contained" onClick={() => navigate("/add-score")}>
          Add score
        </Button>
      }
    >
      <TableWrapper>
        <TableContainer>
          <Table aria-label="Scores table" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={3}
              loading={loading}
              length={refreshLoader ? 0 : scoreCalculations?.length}
              message="No scores currently available."
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Product category</StyledTableCell>
                  <StyledTableCell>Type</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {scoreCalculations?.map((item) => (
                  <StyledTableRow key={item._id}>
                    <StyledTableCell>
                      {englishName(item?.HNSSProductCategoryID)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item?.isPositive?.map((el: any) => el?.label).join(", ")}
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
                ))}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>
        <div className="pagination-list-bottom">
          <p>{count > 0 ? `${count} ${count === 1 ? "score" : "scores"}` : ""}</p>
          {count > 0 && (
            <Pagination
              variant="outlined"
              color="primary"
              page={filters.page}
              disabled={refreshLoader}
              count={Math.ceil(count / filters.page_size)}
              onChange={(_e, page) => dispatch(scoreCalculationActions.setPage(page))}
            />
          )}
        </div>
      </TableWrapper>
    </PageShell>
  );
}
