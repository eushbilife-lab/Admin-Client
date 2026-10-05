import { StyledTableCell, StyledTableCellAction, StyledTableRow, adminTableSx } from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import TableWrapper from "@core/templates/TableWrapper";
import level3Service from "services/level3.service";
import { level3Actions } from "redux/slices/level3";
import { useNavigate } from "react-router-dom";
import Level3Filters from "../Level3/Level3Filters";
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

export default function Level3() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { count, levels3, loading, refreshLoader, filters, refresh } =
    useAppSelector((state) => state.level3);

  useEffect(() => {
    level3Service.getAll(filters, dispatch);
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(level3Actions.resetPage());
    };
  }, [dispatch]);

  return (
    <PageShell
      kicker="Catalog"
      title="Level 3"
      subtitle="Third-level categories nested under Level 2 groups."
      actions={
        <Button variant="contained" onClick={() => navigate("/add-level3")}>
          Add Level 3
        </Button>
      }
    >
      <Level3Filters
        count={count}
        level3Actions={level3Actions}
        refreshLoader={refreshLoader}
        filters={filters}
      />
      <TableWrapper>
        <TableContainer>
          <Table aria-label="Level 3 table" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={4}
              loading={loading}
              length={refreshLoader ? 0 : levels3?.length}
              message="No Level 3 data currently available."
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Level 2</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {levels3?.map((item) => (
                  <StyledTableRow key={item._id}>
                    <StyledTableCell>{englishName(item)}</StyledTableCell>
                    <StyledTableCell>
                      <StatusChip
                        label={item.status || "inactive"}
                        tone={item.status === "active" ? "ok" : "warn"}
                      />
                    </StyledTableCell>
                    <StyledTableCell>{englishName(item?.categoryID)}</StyledTableCell>
                    <StyledTableCellAction>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(`/update-Level3/${item._id}`)}
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
              onChange={(_e, page) => dispatch(level3Actions.setPage(page))}
            />
          )}
        </div>
      </TableWrapper>
    </PageShell>
  );
}
