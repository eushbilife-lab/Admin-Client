import {
  StyledTableCell,
  StyledTableCellAction,
  StyledTableRow,
  adminTableSx,
} from "@core/templates/Tables";
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
import { useEffect, useMemo, useState } from "react";
import { config } from "config";
import CatalogToolbar, {
  CatalogMetaPill,
} from "@core/templates/CatalogToolbar";
import {
  matchesSearch,
  sortByName,
  type NameSort,
} from "@core/templates/CatalogToolbar/catalogList.util";

type StaffStatus = "all" | "active" | "inactive";

export default function Roles() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { count, Roles, loading, refreshLoader, filters, refresh } =
    useAppSelector((state) => state.role);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<NameSort>("az");
  const [status, setStatus] = useState<StaffStatus>("all");

  useEffect(() => {
    roleService.getAllRoles(filters, dispatch);
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(roleActions.resetPage());
    };
  }, [dispatch]);

  const statusCounts = useMemo(() => {
    let active = 0;
    let inactive = 0;
    (Roles || []).forEach((item: any) => {
      if (item?.currentStatus === "active") active += 1;
      else inactive += 1;
    });
    return { active, inactive };
  }, [Roles]);

  const visible = useMemo(() => {
    let list = (Roles || []).filter((item: any) => {
      if (status === "active" && item?.currentStatus !== "active") return false;
      if (status === "inactive" && item?.currentStatus === "active") return false;
      return matchesSearch(
        [item.fullName, item.email, item.role],
        search
      );
    });
    return sortByName(list, (item: any) => String(item.fullName || ""), sort);
  }, [Roles, search, sort, status]);

  return (
    <PageShell
      kicker="Admin"
      title="Staff"
      subtitle="Accounts that can enter, review, and publish catalog data."
    >

      <CatalogToolbar
        hint="Search staff by name, email, or role."
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search staff… (⌘K)"
        searchAriaLabel="Search staff"
        sort={sort}
        onSortChange={(v) => setSort(v as NameSort)}
        sortOptions={[
          { value: "az", label: "Sort A–Z" },
          { value: "za", label: "Sort Z–A" },
        ]}
        meta={
          <>
            <CatalogMetaPill>{count} total</CatalogMetaPill>
            <CatalogMetaPill>{visible.length} showing</CatalogMetaPill>
          </>
        }
        chips={[
          { id: "all", label: "All" },
          { id: "active", label: "Active", count: statusCounts.active },
          { id: "inactive", label: "Inactive", count: statusCounts.inactive },
        ]}
        activeChip={status}
        onChipChange={(id) => setStatus(id as StaffStatus)}
        actions={
          <Button variant="contained" onClick={() => navigate("/add-role")}>
            Add staff
          </Button>
        }
      />

      <TableWrapper
        refreshing={refreshLoader}
      >
        <TableContainer>
          <Table aria-label="Staff table" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={5}
              loading={loading}
              length={visible.length}
              message={
                search || status !== "all"
                  ? "No staff match your search or filters."
                  : "There are no staff accounts currently available."
              }
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
                {visible.map((item: any) => (
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
        {count > 0 && (
          <div className="pagination-list-bottom">
            <p>
              {count} {count === 1 ? "account" : "accounts"}
            </p>
            <Pagination
              variant="outlined"
              color="primary"
              page={filters.page}
              disabled={refreshLoader}
              count={Math.ceil(count / filters.page_size) || 1}
              onChange={(_e, page) => dispatch(roleActions.setPage(page))}
            />
          </div>
        )}
      </TableWrapper>
    </PageShell>
  );
}
