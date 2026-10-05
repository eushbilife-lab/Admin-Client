import { StyledTableCell, StyledTableCellAction, StyledTableRow, adminTableSx } from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import TableWrapper from "@core/templates/TableWrapper";
import level1Service from "services/level1.service";
import { level1Actions } from "redux/slices/level1";
import Level1Filters from "../Level1/Level1Filters";
import { useNavigate } from "react-router-dom";
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

export default function Level1() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { count, levels1, loading, refreshLoader, filters, refresh } =
    useAppSelector((state) => state.level1);

  useEffect(() => {
    level1Service.getAll(filters, dispatch);
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(level1Actions.resetPage());
    };
  }, [dispatch]);

  return (
    <PageShell
      kicker="Catalog"
      title="Level 1"
      subtitle="Top-level food groups used to organize the catalog."
      actions={
        <Button variant="contained" onClick={() => navigate("/add-level1")}>
          Add Level 1
        </Button>
      }
    >
      <Level1Filters
        count={count}
        level1Actions={level1Actions}
        refreshLoader={refreshLoader}
        filters={filters}
      />
      <TableWrapper>
        <TableContainer>
          <Table aria-label="Level 1 table" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={3}
              loading={loading}
              length={refreshLoader ? 0 : levels1.length}
              message="No Level 1 data currently available."
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {levels1?.map((item) => (
                  <StyledTableRow key={item._id}>
                    <StyledTableCell>{englishName(item)}</StyledTableCell>
                    <StyledTableCell>
                      <StatusChip
                        label={item.status || "inactive"}
                        tone={item.status === "active" ? "ok" : "warn"}
                      />
                    </StyledTableCell>
                    <StyledTableCellAction>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(`/update-Level1/${item._id}`)}
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
              onChange={(_e, page) => dispatch(level1Actions.setPage(page))}
            />
          )}
        </div>
      </TableWrapper>
    </PageShell>
  );
}
