import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect, memo, useCallback } from "react";
import moment from "moment";
import { Button, Pagination, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import UserService from "services/user.service";
import { userActions } from "redux/slices/user";
import UsersFilters from "./UsersFilters";
import { useNavigate } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import TableWrapper from "@core/templates/TableWrapper";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import { StyledTableCell, StyledTableCellAction, StyledTableRow, adminTableSx } from "@core/templates/Tables";

export default function Users() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { count, users, loading, refreshLoader, filters, refresh } =
    useAppSelector((state) => state.user);

  useEffect(() => {
    UserService.getAllUsers(filters, dispatch);
  }, [filters, refresh, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(userActions.resetPage());
    };
  }, [dispatch]);

  const openMember = useCallback(
    (id: string) => navigate(`/members/${id}`),
    [navigate]
  );

  return (
    <PageShell
      kicker="People"
      title="Households"
      subtitle="BMI, calorie targets, diets, and allergen profiles from the live app."
    >
      {loading && <CircleLoader />}
      <UsersFilters
        count={count}
        userActions={userActions}
        refreshLoader={refreshLoader}
        filters={filters}
      />
      <TableWrapper>
        <TableContainer>
          <Table aria-label="Members table" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={8}
              loading={loading}
              length={refreshLoader ? 0 : users?.length}
              message="No members currently available."
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Diet</StyledTableCell>
                  <StyledTableCell>BMI</StyledTableCell>
                  <StyledTableCell>Profiles</StyledTableCell>
                  <StyledTableCell>Joined</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user: any) => (
                  <MemberRow key={user._id} user={user} onOpen={openMember} />
                ))}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>
        {count > 0 && (
          <div className="pagination-list-bottom">
            <p>
              {count} {count === 1 ? "member" : "members"}
            </p>
            <Pagination
              variant="outlined"
              color="primary"
              page={filters.page}
              disabled={refreshLoader}
              count={Math.ceil(count / filters.page_size)}
              onChange={(_, page) => dispatch(userActions.setPage(page))}
            />
          </div>
        )}
      </TableWrapper>
    </PageShell>
  );
}

const MemberRow = memo(({ user, onOpen }: { user: any; onOpen: (id: string) => void }) => {
  const nutrition = user.nutrition || user.profiles?.[0];
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;
  const bmi = nutrition?.bmi?.value;
  return (
    <StyledTableRow>
      <StyledTableCell>{name}</StyledTableCell>
      <StyledTableCell>{user.email}</StyledTableCell>
      <StyledTableCell>
        <StatusChip
          label={user.currentStatus || "active"}
          tone={user.currentStatus === "inactive" ? "warn" : "ok"}
        />
      </StyledTableCell>
      <StyledTableCell>{nutrition?.diet || "—"}</StyledTableCell>
      <StyledTableCell>{bmi ? Number(bmi).toFixed(1) : "—"}</StyledTableCell>
      <StyledTableCell>{user.totalProfiles || 0}</StyledTableCell>
      <StyledTableCell>{moment(user.createdAt).format("MMM D, YYYY")}</StyledTableCell>
      <StyledTableCellAction>
        <Button variant="text" size="small" onClick={() => onOpen(user._id)}>
          Open
        </Button>
      </StyledTableCellAction>
    </StyledTableRow>
  );
});
