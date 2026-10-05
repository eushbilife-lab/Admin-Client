import { StyledTableCell, StyledTableCellAction, StyledTableRow, adminTableSx } from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import TableWrapper from "@core/templates/TableWrapper";
import level4Service from "services/level4.service";
import { level4Actions } from "redux/slices/level4";
import { useNavigate } from "react-router-dom";
import Level4Filters from "../Level4/Level4Filters";
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

export default function Level4() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { count, levels4, loading, refreshLoader, filters, refresh } =
    useAppSelector((state) => state.level4);

  useEffect(() => {
    level4Service.getAll(filters, dispatch);
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(level4Actions.resetPage());
    };
  }, [dispatch]);

  return (
    <PageShell
      kicker="Catalog"
      title="Level 4"
      subtitle="Leaf categories and HNSS scoring groups for labeled foods."
      actions={
        <Button variant="contained" onClick={() => navigate("/add-level4")}>
          Add Level 4
        </Button>
      }
    >
      <Level4Filters
        count={count}
        level4Actions={level4Actions}
        refreshLoader={refreshLoader}
        filters={filters}
      />
      <TableWrapper>
        <TableContainer>
          <Table aria-label="Level 4 table" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={5}
              loading={loading}
              length={refreshLoader ? 0 : levels4?.length}
              message="No Level 4 data currently available."
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>HNSS category</StyledTableCell>
                  <StyledTableCell>Level 3</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {levels4?.map((item) => (
                  <StyledTableRow key={item._id}>
                    <StyledTableCell>{englishName(item)}</StyledTableCell>
                    <StyledTableCell>
                      <StatusChip
                        label={item.status || "inactive"}
                        tone={item.status === "active" ? "ok" : "warn"}
                      />
                    </StyledTableCell>
                    <StyledTableCell>{englishName(item?.HNSSProductCategoryID)}</StyledTableCell>
                    <StyledTableCell>{englishName(item?.subCategoryID)}</StyledTableCell>
                    <StyledTableCellAction>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(`/update-Level4/${item._id}`)}
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
              onChange={(_e, page) => dispatch(level4Actions.setPage(page))}
            />
          )}
        </div>
      </TableWrapper>
    </PageShell>
  );
}
