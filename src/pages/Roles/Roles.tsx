import { StyledTableCell, StyledTableCellAction, StyledTableRow, adminTableSx } from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import TableWrapper from "@core/templates/TableWrapper";
import { roleActions } from "redux/slices/role";
import roleService from "services/role.service";
import { useNavigate } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect } from "react";
import { config } from "config";
import CircleLoader from "@core/basic-components/CircleLoader";

export default function Roles() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { count, Roles, loading, refreshLoader, filters, refresh } =
    useAppSelector((state) => state.role);

  useEffect(() => {
    roleService.getAllRoles(filters, dispatch);
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(roleActions.resetPage());
    };
  }, [dispatch]);

  return (
    <PageShell
      kicker="Admin"
      title="Staff"
      subtitle="Accounts that can enter, review, and publish catalog data."
      actions={
        <Button variant="contained" onClick={() => navigate("/add-role")}>
          Add staff
        </Button>
      }
    >
      {loading && <CircleLoader />}
      <TableWrapper>
        <TableContainer>
          <Table aria-label="Staff table" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={5}
              loading={loading}
              length={refreshLoader ? 0 : Roles.length}
              message="There are no staff accounts currently available."
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Role</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {Roles?.map((item) => (
                  <StyledTableRow key={item._id}>
                    <StyledTableCell>{item.fullName}</StyledTableCell>
                    <StyledTableCell>{item.email}</StyledTableCell>
                    <StyledTableCell>
                      <StatusChip
                        label={item?.currentStatus || "inactive"}
                        tone={item?.currentStatus === "active" ? "ok" : "warn"}
                      />
                    </StyledTableCell>
                    <StyledTableCell>{item?.role}</StyledTableCell>
                    <StyledTableCellAction>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(`/update-role/${item._id}`)}
                        disabled={item.email === config.SUPER_ADMIN_EMAIL}
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
          <p>{count > 0 ? `${count} ${count === 1 ? "account" : "accounts"}` : ""}</p>
          {count > 0 && (
            <Pagination
              variant="outlined"
              color="primary"
              page={filters.page}
              disabled={refreshLoader}
              count={Math.ceil(count / filters.page_size)}
              onChange={(_e, page) => dispatch(roleActions.setPage(page))}
            />
          )}
        </div>
      </TableWrapper>
    </PageShell>
  );
}
