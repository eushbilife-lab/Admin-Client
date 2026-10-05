import { StyledTableCell, StyledTableCellAction, StyledTableRow, adminTableSx } from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import TableWrapper from "@core/templates/TableWrapper";
import level2Service from "services/level2.service";
import { level2Actions } from "redux/slices/level2";
import { useNavigate } from "react-router-dom";
import Level2Filters from "../Level2/Level2Filters";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
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
import { englishName } from "utils/localizedData.util";

export default function Level2() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { count, levels2, loading, refreshLoader, filters, refresh } =
    useAppSelector((state) => state.level2);

  useEffect(() => {
    level2Service.getAll(filters, dispatch);
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(level2Actions.resetPage());
    };
  }, [dispatch]);

  return (
    <PageShell
      kicker="Catalog"
      title="Level 2"
      subtitle="Second-level categories nested under Level 1 groups."
      actions={
        <Button variant="contained" onClick={() => navigate("/add-level2")}>
          Add Level 2
        </Button>
      }
    >
      <Level2Filters
        count={count}
        level2Actions={level2Actions}
        refreshLoader={refreshLoader}
        filters={filters}
      />
      <TableWrapper>
        <TableContainer>
          <Table aria-label="Level 2 table" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={4}
              loading={loading}
              length={refreshLoader ? 0 : levels2?.length}
              message="No Level 2 data currently available."
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Level 1</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {levels2.map((item) => (
                  <StyledTableRow key={item._id}>
                    <StyledTableCell>{englishName(item)}</StyledTableCell>
                    <StyledTableCell>
                      <StatusChip
                        label={item.status || "inactive"}
                        tone={item.status === "active" ? "ok" : "warn"}
                      />
                    </StyledTableCell>
                    <StyledTableCell>{englishName(item?.mainCategory)}</StyledTableCell>
                    <StyledTableCellAction>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(`/update-Level2/${item._id}`)}
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
          <p>{count > 0 ? `${count} ${count === 1 ? "record" : "records"}` : ""}</p>
          {count > 0 && (
            <Pagination
              variant="outlined"
              color="primary"
              page={filters.page}
              disabled={refreshLoader}
              count={Math.ceil(count / filters.page_size)}
              onChange={(_e, page) => dispatch(level2Actions.setPage(page))}
            />
          )}
        </div>
      </TableWrapper>
    </PageShell>
  );
}
