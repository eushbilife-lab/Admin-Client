import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect, memo, useCallback } from "react";
import moment from "moment";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import UserService from "services/user.service";
import { userActions } from "redux/slices/user";
import UsersFilters from "./UsersFilters";
import { useNavigate } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import TableWrapper from "@core/templates/TableWrapper";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import {
  StyledTableCell,
  StyledTableCellAction,
  StyledTableRow,
  adminTableSx,
} from "@core/templates/Tables";
import RowActions from "@core/api-components/RowActions";
import ToasterService from "utils/toaster.util";
import "./Users.css";

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
      kicker="Users"
      title="Users"
      subtitle="App accounts, household profiles, BMI and diet targets from the live product."
      actions={
        <div className="users-section-nav">
          <Button variant="contained" disabled>
            Users
          </Button>
          <Button variant="outlined" onClick={() => navigate("/profiles")}>
            Profiles
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/nutritionist-requests")}
          >
            Consults
          </Button>
          <Button variant="outlined" onClick={() => navigate("/dietitians")}>
            Dietitians
          </Button>
        </div>
      }
    >
      <UsersFilters
        count={count}
        userActions={userActions}
        refreshLoader={refreshLoader}
        filters={filters}
      />
      <TableWrapper refreshing={refreshLoader}>
        <TableContainer>
          <Table aria-label="Users table" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={8}
              loading={loading}
              length={users?.length}
              message="No users currently available."
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
                  <UserRow
                    key={user._id}
                    user={user}
                    onOpen={openMember}
                    onDeleted={() => dispatch(userActions.refresh())}
                  />
                ))}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>
        {count > 0 && (
          <div className="pagination-list-bottom">
            <p>
              {count} {count === 1 ? "user" : "users"}
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

const UserRow = memo(
  ({
    user,
    onOpen,
    onDeleted,
  }: {
    user: any;
    onOpen: (id: string) => void;
    onDeleted: () => void;
  }) => {
    const navigate = useNavigate();
    const nutrition = user.nutrition || user.profiles?.[0];
    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;
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
        <StyledTableCell>
          {moment(user.createdAt).format("MMM D, YYYY")}
        </StyledTableCell>
        <StyledTableCellAction>
          <RowActions
            onOpen={() => onOpen(user._id)}
            onEdit={() => navigate(`/update-users/${user._id}`)}
            deleteTitle="Delete user"
            deleteMessage={`Permanently delete “${name}” (GDPR anonymize)? This cannot be undone.`}
            onDelete={async () => {
              const [, error]: any = await UserService.removeUser(user._id);
              if (error) {
                ToasterService.showError(
                  error?.response?.data?.message || "Delete failed"
                );
                return;
              }
              ToasterService.showSuccess("User deleted");
              onDeleted();
            }}
          />
        </StyledTableCellAction>
      </StyledTableRow>
    );
  }
);
