import {
  StyledTableCell,
  StyledTableCellAction,
  StyledTableRow,
  adminTableSx,
} from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import CircleLoader from "@core/basic-components/CircleLoader";
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
  filterByStatus,
  matchesSearch,
  sortByName,
  type NameSort,
  type StatusFilter,
} from "@core/templates/CatalogToolbar/catalogList.util";

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
  const filters = bucket?.filters || { page: 1, page_size: 10 };

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<NameSort>("az");

  useEffect(() => {
    const next = {
      ...filters,
      page_size: search.trim()
        ? Math.max(Number(filters.page_size) || 10, 100)
        : filters.page_size,
      page: search.trim() ? 1 : filters.page,
    };
    healthPreferenceService.getAllHp(type, next, dispatch);
  }, [dispatch, refresh, filters, type, search]);

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

  const visible = useMemo(() => {
    let list = (hps || []).filter((item: any) =>
      matchesSearch(
        [rowName(item), item.description, item.en?.description],
        search
      )
    );
    list = filterByStatus(list, status);
    return sortByName(list, rowName, sort);
  }, [hps, search, status, sort]);

  return (
    <>
      <CatalogToolbar
        hint={blurb}
        search={search}
        onSearchChange={setSearch}
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
        activeChip={status}
        onChipChange={(id) => setStatus(id as StatusFilter)}
        actions={
          <Button variant="contained" onClick={() => openEditor()}>
            {addLabel}
          </Button>
        }
      />

      {loading && <CircleLoader />}

      <TableWrapper>
        <TableContainer>
          <Table aria-label={`${type} table`} sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={4}
              loading={!!loading}
              length={refreshLoader ? 0 : visible.length}
              message={
                search || status !== "all"
                  ? "No items match your search or filters."
                  : emptyMessage
              }
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Name</StyledTableCell>
                  <StyledTableCell align="left">Description</StyledTableCell>
                  <StyledTableCell align="left">Status</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((item: any) => {
                  const name = rowName(item);
                  const description =
                    item.description || item.en?.description || "";
                  return (
                    <StyledTableRow key={item._id}>
                      <StyledTableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {name}
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
                          tone={item.status === "inactive" ? "warn" : "ok"}
                        />
                      </StyledTableCell>
                      <StyledTableCellAction>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => openEditor(item)}>
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
                                      heading: "Delete",
                                      message:
                                        "Are you sure you want to delete this item?",
                                      confirmAction: () => {
                                        healthPreferenceService.remove(
                                          item._id,
                                          dispatch,
                                          type,
                                          filters
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
                  );
                })}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>

        <div className="pagination-list-bottom">
          <p>{count > 0 && `${count} ${count > 1 ? "items" : "item"}`}</p>
          {count > 0 && (
            <Pagination
              variant="outlined"
              color="primary"
              page={filters.page}
              disabled={refreshLoader}
              count={Math.ceil(count / filters.page_size) || 1}
              onChange={(_e, page) =>
                dispatch(healthPrefernceActions.setPage({ type, page }))
              }
            />
          )}
        </div>
      </TableWrapper>
    </>
  );
}
