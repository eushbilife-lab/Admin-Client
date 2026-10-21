import {
  Box,
  IconButton,
  Link,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
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
import CircleLoader from "@core/basic-components/CircleLoader";
import Button from "@core/basic-components/Button";
import Tooltip from "@core/basic-components/Tooltip";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { MODAL, modalActions } from "redux/slices/modal";
import { exerciseActions } from "redux/slices/exercise";
import exerciseService from "services/exercise.service";
import useListQueryParams from "hooks/useListQueryParams";
import { useEffect, useMemo, useState } from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BlockComponent from "@core/api-components/BlockComponent";
import CatalogToolbar, {
  CatalogMetaPill,
} from "@core/templates/CatalogToolbar";
import {
  countByStatus,
  filterByStatus,
  type StatusFilter,
} from "@core/templates/CatalogToolbar/catalogList.util";

export default function Exercises() {
  const dispatch = useAppDispatch();
  const { exercises, loading, refreshLoader, count, refresh } = useAppSelector(
    (state) => state.exercise
  );
  const { filters, searchInput, setSearch, setPage } = useListQueryParams();
  const [status, setStatus] = useState<StatusFilter>("all");

  useEffect(() => {
    exerciseService.getAll(
      { ...filters, name: filters.name || undefined },
      dispatch
    );
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(exerciseActions.resetPage());
    };
  }, [dispatch]);

  const openEditor = (row?: any) => {
    dispatch(
      modalActions.openModal({
        type: MODAL.ADD_EXERCISE,
        data: {
          id: row?._id,
          data: row,
        },
        width: "640px",
      })
    );
  };

  const remove = (row: any) => {
    dispatch(
      modalActions.openModal({
        type: MODAL.CONFIRMATION_FORM,
        data: {
          heading: "Delete",
          message: `Remove “${row.name || "this exercise"}”? Members will no longer see it.`,
          confirmAction: () =>
            exerciseService.remove(row._id, filters, dispatch),
        },
        width: "500px",
      })
    );
  };

  const statusCounts = useMemo(
    () => countByStatus(exercises || []),
    [exercises]
  );

  const visible = useMemo(
    () => filterByStatus(exercises || [], status),
    [exercises, status]
  );

  return (
    <>
      {loading && <CircleLoader />}
      <PageShell
        kicker="Movement"
        title="Exercises"
        subtitle="Workout videos and routines matched to each member’s activity level."
      >
        <section>
          <CatalogToolbar
            hint="Add video workouts and tag the activity levels that should see them in the app."
            search={searchInput}
            onSearchChange={setSearch}
            searchPlaceholder="Search exercises… (⌘K)"
            searchAriaLabel="Search exercises"
            meta={
              <>
                <CatalogMetaPill>{count} total</CatalogMetaPill>
                <CatalogMetaPill>{visible.length} showing</CatalogMetaPill>
              </>
            }
            chips={[
              { id: "all", label: "All" },
              { id: "active", label: "Active", count: statusCounts.active },
              {
                id: "inactive",
                label: "Inactive",
                count: statusCounts.inactive,
              },
            ]}
            activeChip={status}
            onChipChange={(id) => setStatus(id as StatusFilter)}
            actions={
              <Button variant="contained" onClick={() => openEditor()}>
                Add exercise
              </Button>
            }
          />

          <TableWrapper>
            <TableContainer sx={{ maxHeight: "70vh", overflowX: "auto" }}>
              <Table stickyHeader aria-label="exercises" sx={adminTableSx}>
                <TableLoadingWrapper
                  coloumns={7}
                  loading={!!loading}
                  length={refreshLoader ? 0 : visible.length}
                  message={
                    searchInput || status !== "all"
                      ? "No exercises match your search or filters."
                      : "No exercises yet. Add walking, strength, or mobility videos for each activity level."
                  }
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Activity levels</StyledTableCell>
                      <StyledTableCell>Difficulty</StyledTableCell>
                      <StyledTableCell>Duration</StyledTableCell>
                      <StyledTableCell>Video</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCellAction>Action</StyledTableCellAction>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visible.map((row: any) => (
                      <StyledTableRow key={row._id}>
                        <StyledTableCell>
                          <Typography fontWeight={600}>
                            {row.name || "Untitled"}
                          </Typography>
                          {row.description ? (
                            <Typography
                              variant="body2"
                              sx={{ color: "var(--text-secondary)", mt: 0.5 }}
                            >
                              {row.description}
                            </Typography>
                          ) : null}
                        </StyledTableCell>
                        <StyledTableCell>
                          {(row.exerciseLevels || [])
                            .map((level: any) => level.label || level.name)
                            .filter(Boolean)
                            .join(", ") || "All levels"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {String(row.difficulty || "beginner")}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.durationMinutes
                            ? `${row.durationMinutes} min`
                            : "—"}
                        </StyledTableCell>
                        <StyledTableCell>
                          {row.videoUrl ? (
                            <Link
                              href={row.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open
                            </Link>
                          ) : (
                            "—"
                          )}
                        </StyledTableCell>
                        <StyledTableCell>
                          <StatusChip
                            label={row.status || "inactive"}
                            tone={row.status === "inactive" ? "warn" : "ok"}
                          />
                        </StyledTableCell>
                        <StyledTableCellAction>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => openEditor(row)}
                              >
                                <EditNoteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <BlockComponent allowedRoles={["admin"]}>
                              <Tooltip title="Remove">
                                <IconButton
                                  size="small"
                                  onClick={() => remove(row)}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </BlockComponent>
                          </Box>
                        </StyledTableCellAction>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </TableLoadingWrapper>
              </Table>
            </TableContainer>
          </TableWrapper>

          {count > (filters.page_size || 10) ? (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Pagination
                page={filters.page || 1}
                count={Math.ceil(count / (filters.page_size || 10))}
                onChange={(_e, page) => setPage(page)}
                color="primary"
              />
            </Box>
          ) : null}
        </section>
      </PageShell>
    </>
  );
}
