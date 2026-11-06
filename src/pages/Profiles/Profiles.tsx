import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
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
import UserService from "services/user.service";
import { useAppDispatch } from "redux/hooks";
import ToasterService from "utils/toaster.util";
import "../Users/Users.css";

type ProfileRow = {
  profileId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userStatus: string;
  name: string;
  gender?: string;
  age?: number;
  diet?: string;
  target?: string;
  bmi?: number | null;
  calories?: string;
};

export default function Profiles() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const pageSize = 20;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [success, error]: any = await UserService.getAllUsers(
        { page: 1, page_size: 50 },
        dispatch
      );
      if (cancelled) return;
      setLoading(false);
      if (error) {
        ToasterService.showError(
          error?.response?.data?.message || "Failed to load profiles"
        );
        return;
      }
      const users = success?.data?.data?.users || [];
      const flat: ProfileRow[] = [];
      for (const user of users) {
        const userName =
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.email ||
          "User";
        const profiles = user.profiles?.length
          ? user.profiles
          : user.nutrition
            ? [user.nutrition]
            : [];
        for (const profile of profiles) {
          flat.push({
            profileId: profile._id || `${user._id}-primary`,
            userId: user._id,
            userName,
            userEmail: user.email,
            userStatus: user.currentStatus || "active",
            name:
              `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
              userName,
            gender: profile.gender,
            age: profile.age,
            diet: profile.diet,
            target: profile.target,
            bmi: profile.bmi?.value ?? null,
            calories: profile.dailyCalories?.max
              ? `${profile.dailyCalories.min}–${profile.dailyCalories.max}`
              : "—",
          });
        }
      }
      setRows(flat);
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.userEmail?.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        (r.diet || "").toLowerCase().includes(q)
    );
  }, [rows, search]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <PageShell
      kicker="Users"
      title="Profiles"
      subtitle="Household nutrition profiles linked to each app user — body metrics, diet, and calorie targets."
      actions={
        <div className="users-section-nav">
          <Button variant="outlined" onClick={() => navigate("/users")}>
            Users
          </Button>
          <Button variant="contained" disabled>
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
      <div className="users-section-nav" style={{ marginBottom: 16 }}>
        <TextField
          size="small"
          label="Search profiles"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 260 }}
        />
      </div>
      <TableWrapper>
        <TableContainer>
          <Table aria-label="Profiles table" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={8}
              loading={loading}
              length={pageRows.length}
              message="No profiles found."
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Profile</StyledTableCell>
                  <StyledTableCell>Account</StyledTableCell>
                  <StyledTableCell>Diet / goal</StyledTableCell>
                  <StyledTableCell>BMI</StyledTableCell>
                  <StyledTableCell>Calories</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {pageRows.map((row) => (
                  <StyledTableRow key={row.profileId}>
                    <StyledTableCell>
                      <strong>{row.name}</strong>
                      <div className="profile-row-meta">
                        {row.gender ? (
                          <StatusChip label={row.gender} tone="info" />
                        ) : null}
                        {row.age ? (
                          <StatusChip label={`Age ${row.age}`} tone="info" />
                        ) : null}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.userName}
                      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                        {row.userEmail}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.diet || "—"}
                      {row.target ? ` · ${row.target}` : ""}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.bmi != null ? Number(row.bmi).toFixed(1) : "—"}
                    </StyledTableCell>
                    <StyledTableCell>{row.calories}</StyledTableCell>
                    <StyledTableCell>
                      <StatusChip
                        label={row.userStatus}
                        tone={row.userStatus === "inactive" ? "warn" : "ok"}
                      />
                    </StyledTableCell>
                    <StyledTableCellAction>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => navigate(`/members/${row.userId}`)}
                      >
                        Open user
                      </Button>
                    </StyledTableCellAction>
                  </StyledTableRow>
                ))}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>
        {filtered.length > 0 && (
          <div className="pagination-list-bottom">
            <p>
              {filtered.length} {filtered.length === 1 ? "profile" : "profiles"}
            </p>
            <Pagination
              variant="outlined"
              color="primary"
              page={page}
              count={pageCount}
              onChange={(_, next) => setPage(next)}
            />
          </div>
        )}
      </TableWrapper>
    </PageShell>
  );
}
