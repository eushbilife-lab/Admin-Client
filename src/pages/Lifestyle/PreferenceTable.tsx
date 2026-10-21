import {
  StyledTableCell,
  StyledTableCellAction,
  StyledTableRow,
  adminTableSx,
} from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { MODAL, modalActions } from "redux/slices/modal";
import TableWrapper from "@core/templates/TableWrapper";
import Button from "@core/basic-components/Button";
import { useEffect, useMemo, useState } from "react";
import {
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import healthPreferenceService from "services/healthPreference.service";
import { healthPrefernceActions } from "redux/slices/healthPrefernce";
import Tooltip from "@core/basic-components/Tooltip";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import BlockComponent from "@core/api-components/BlockComponent";
import StatusChip from "@core/templates/PageShell/StatusChip";
import type { healthPrefernceType } from "redux/slices/healthPrefernce";
import { optionLabel } from "utils/selectOption.util";
import CatalogToolbar, {
  CatalogMetaPill,
} from "@core/templates/CatalogToolbar";
import {
  countByStatus,
  sortByName,
  type NameSort,
  type StatusFilter,
} from "@core/templates/CatalogToolbar/catalogList.util";
import useListQueryParams from "hooks/useListQueryParams";

type Props = {
  type: healthPrefernceType;
  addLabel: string;
  emptyMessage: string;
  blurb?: string;
};

export default function PreferenceTable({
  type,
  addLabel,
  emptyMessage,
  blurb,
}: Props) {
  const dispatch = useAppDispatch();
  const { refresh, refreshLoader } = useAppSelector(
    (state) => state.healthPreference
  );
  const bucket = useAppSelector((state) => state.healthPreference[type]);
  const count = bucket?.count || 0;
  const hps = bucket?.hps || [];
  const loading = bucket?.loading;

  const listQuery = useListQueryParams({ prefix: `${type}_` });
  const [sort, setSort] = useState<NameSort>("az");

  useEffect(() => {
    healthPreferenceService.getAllHp(type, listQuery.filters, dispatch);
  }, [dispatch, refresh, type, listQuery.filters]);

  useEffect(() => {
    return () => {
      dispatch(healthPrefernceActions.resetPage(type));
    };
  }, [dispatch, type]);

  const openEditor = (item?: { _id: string }) => {
    dispatch(
      modalActions.openModal({
        type: MODAL.ADD_FOODTYPE,
        data: {
          type,
          id: item?._id,
          data: item,
        },
        width: "560px",
      })
    );
  };

  const rowName = (item: any) => optionLabel(item, "") || "";
  const statusCounts = useMemo(() => countByStatus(hps), [hps]);

  const visible = useMemo(
    () => sortByName(hps || [], rowName, sort),
    [hps, sort]
  );

  return (
    <>
      <CatalogToolbar
        hint={blurb}
        search={listQuery.searchInput}
        onSearchChange={listQuery.setSearch}
        searchPlaceholder="Search by name or description… (⌘K)"
        searchAriaLabel="Search preferences"
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
            {addLabel}
          </Button>
        }
      />

      <TableWrapper
        refreshing={refreshLoader || (!!loading && hps.length > 0)}
      >
        <TableContainer>
          <Table aria-label={addLabel} sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={4}
              loading={!!loading}
              length={visible.length}
              message={
                listQuery.debouncedSearch || listQuery.status !== "all"
                  ? "No rows match your search or filters."
                  : emptyMessage
              }
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((item: any) => {
                  const description =
                    item.description || item.en?.description || "";
                  return (
                    <StyledTableRow key={item._id}>
                      <StyledTableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {rowName(item) || "Untitled"}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: description
                              ? "var(--text-secondary)"
                              : "var(--text-tertiary)",
                            maxWidth: 360,
                          }}
                        >
                          {description || "—"}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <StatusChip
                          label={item.status || "inactive"}
                          tone={item.status === "active" ? "ok" : "warn"}
                        />
                      </StyledTableCell>
                      <StyledTableCellAction>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => openEditor(item)}
                          >
                            <EditNoteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <BlockComponent allowedRoles={["admin"]}>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() =>
                                dispatch(
                                  modalActions.openModal({
                                    type: MODAL.CONFIRMATION_FORM,
                                    data: {
                                      heading: "Delete",
                                      message:
                                        "Are you sure you want to delete this item?",
                                      confirmAction: () =>
                                        healthPreferenceService.remove(
                                          item._id,
                                          dispatch,
                                          type,
                                          listQuery.filters
                                        ),
                                    },
                                    width: "480px",
                                  })
                                )
                              }
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </BlockComponent>
                      </StyledTableCellAction>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>
        {count > 0 ? (
          <div className="pagination-list-bottom">
            <p>
              {count} {count === 1 ? "item" : "items"}
            </p>
            <Pagination
              variant="outlined"
              color="primary"
              page={listQuery.page}
              disabled={refreshLoader}
              count={Math.max(
                1,
                Math.ceil(count / (listQuery.limit || 10))
              )}
              onChange={(_e, page) => listQuery.setPage(page)}
            />
          </div>
        ) : null}
      </TableWrapper>
    </>
  );
}
