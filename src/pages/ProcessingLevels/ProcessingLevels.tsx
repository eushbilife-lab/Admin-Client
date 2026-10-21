import { useEffect, useMemo, useState } from "react";
import {
  Button,
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
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
import CatalogToolbar, {
  CatalogMetaPill,
} from "@core/templates/CatalogToolbar";
import {
  countByStatus,
  sortByName,
  type NameSort,
  type StatusFilter,
} from "@core/templates/CatalogToolbar/catalogList.util";
import Tooltip from "@core/basic-components/Tooltip";
import BlockComponent from "@core/api-components/BlockComponent";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { MODAL, modalActions } from "redux/slices/modal";
import { processingLevelActions } from "redux/slices/processingLevel";
import processingLevelService from "services/processingLevel.service";
import useListQueryParams from "hooks/useListQueryParams";

export default function ProcessingLevels() {
  const dispatch = useAppDispatch();
  const { items, loading, refreshLoader, count, refresh } = useAppSelector(
    (state) => state.processingLevel
  );

  const listQuery = useListQueryParams();
  const [sort, setSort] = useState<NameSort>("az");

  useEffect(() => {
    processingLevelService.getAll(listQuery.filters, dispatch);
  }, [dispatch, refresh, listQuery.filters]);

  useEffect(() => {
    return () => {
      dispatch(processingLevelActions.resetPage());
    };
  }, [dispatch]);

  const openEditor = (row?: any) => {
    dispatch(
      modalActions.openModal({
        type: MODAL.ADD_PROCESSING_LEVEL,
        data: { id: row?._id, data: row },
        width: "520px",
      })
    );
  };

  const statusCounts = useMemo(() => countByStatus(items || []), [items]);

  const visible = useMemo(
    () =>
      sortByName(items || [], (row: any) => String(row.name || ""), sort),
    [items, sort]
  );

  return (
    <PageShell
      kicker="Labels"
      title="Processing levels"
      subtitle="NOVA-style processing classes used on Add Food and health scoring."
    >

      <CatalogToolbar
        hint="Create, edit, or remove levels. The numeric value is what scoring rules match on."
        search={listQuery.searchInput}
        onSearchChange={listQuery.setSearch}
        searchPlaceholder="Search by name or level… (⌘K)"
        searchAriaLabel="Search processing levels"
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
        activeChip={(listQuery.status as StatusFilter) || "all"}
        onChipChange={(id) => listQuery.setStatus(id)}
        actions={
          <Button variant="contained" onClick={() => openEditor()}>
            Add processing level
          </Button>
        }
      />

      <TableWrapper
        refreshing={refreshLoader || (!!loading && (items?.length ?? 0) > 0)}
      >
        <TableContainer>
          <Table aria-label="Processing levels" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={5}
              loading={!!loading}
              length={visible.length}
              message={
                listQuery.debouncedSearch || listQuery.status !== "all"
                  ? "No levels match your search or filters."
                  : "No processing levels yet."
              }
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Level value</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((row: any) => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {row.name}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <span className="catalog-key">{row.levelValue}</span>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: row.description
                            ? "var(--text-secondary)"
                            : "var(--text-tertiary)",
                          maxWidth: 360,
                        }}
                      >
                        {row.description || "—"}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <StatusChip
                        label={row.status || "inactive"}
                        tone={row.status === "active" ? "ok" : "warn"}
                      />
                    </StyledTableCell>
                    <StyledTableCellAction>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => openEditor(row)}>
                          <EditNoteIcon />
                        </IconButton>
                      </Tooltip>
                      <BlockComponent allowedRoles={["admin"]}>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() =>
                              dispatch(
                                modalActions.openModal({
                                  type: MODAL.CONFIRMATION_FORM,
                                  data: {
                                    heading: "Delete processing level",
                                    message: `Remove “${row.name}”? Products that already use level ${row.levelValue} keep their saved value.`,
                                    confirmAction: () => {
                                      processingLevelService.remove(
                                        row._id,
                                        listQuery.filters,
                                        dispatch
                                      );
                                    },
                                  },
                                  width: "500px",
                                })
                              )
                            }
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </BlockComponent>
                    </StyledTableCellAction>
                  </StyledTableRow>
                ))}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>
        {count > 0 ? (
          <div className="pagination-list-bottom">
            <p>
              {count} {count === 1 ? "level" : "levels"}
            </p>
            <Pagination
              variant="outlined"
              color="primary"
              page={listQuery.page}
              disabled={refreshLoader}
              count={Math.max(1, Math.ceil(count / listQuery.limit))}
              onChange={(_e, page) => listQuery.setPage(page)}
            />
          </div>
        ) : null}
      </TableWrapper>
    </PageShell>
  );
}
