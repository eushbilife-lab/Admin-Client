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
import { useTranslation } from "react-i18next";
import MeasurementScaleService from "services/measurementScale.service";
import { measurementScaleActions } from "redux/slices/measurementScale";
import { localizedData } from "utils/localizedData.util";
import Tooltip from "@core/basic-components/Tooltip";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import BlockComponent from "@core/api-components/BlockComponent";
import StatusChip from "@core/templates/PageShell/StatusChip";
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

export default function UOM({ type }: any) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { refresh, refreshLoader } = useAppSelector(
    (state) => state.measurementScale
  );
  const { count, measurementScales, loading, filters } = useAppSelector(
    (state) => state.measurementScale.uom
  );

  const listQuery = useListQueryParams();
  const [sort, setSort] = useState<NameSort>("az");

  useEffect(() => {
    MeasurementScaleService.getAll(type, listQuery.filters, dispatch);
  }, [dispatch, refresh, type, listQuery.filters]);

  useEffect(() => {
    return () => {
      dispatch(measurementScaleActions.resetPage(type));
    };
  }, [dispatch, type]);

  const rowName = (item: any) =>
    String(
      localizedData({
        en: item?.en?.name,
        ar: item?.ar?.name,
      }) || ""
    );

  const statusCounts = useMemo(
    () => countByStatus(measurementScales || []),
    [measurementScales]
  );

  const visible = useMemo(
    () => sortByName(measurementScales || [], rowName, sort),
    [measurementScales, sort]
  );

  return (
    <>
      <CatalogToolbar
        hint="Units used on labels and RDA conversion (g, ml, cup, scoop)."
        search={listQuery.searchInput}
        onSearchChange={listQuery.setSearch}
        searchPlaceholder="Search unit name or sign… (⌘K)"
        searchAriaLabel="Search units"
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
          <Button
            variant="contained"
            onClick={() =>
              dispatch(
                modalActions.openModal({
                  type: MODAL.ADD_UOM,
                  data: { type },
                  width: "500px",
                })
              )
            }
          >
            {t("Add UOM")}
          </Button>
        }
      />

      <TableWrapper
        refreshing={refreshLoader}
      >
        <TableContainer>
          <Table aria-label="UOM table" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={4}
              loading={loading}
              length={visible.length}
              message={
                listQuery.debouncedSearch || listQuery.status !== "all"
                  ? "No units match your search or filters."
                  : t("No UOM currently available.")
              }
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">{t("Name")}</StyledTableCell>
                  <StyledTableCell align="left">{t("Sign")}</StyledTableCell>
                  <StyledTableCell align="left">{t("Status")}</StyledTableCell>
                  <StyledTableCellAction align="center">
                    {t("Action")}
                  </StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((item: any) => (
                  <StyledTableRow key={item._id}>
                    <StyledTableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {rowName(item)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <span className="catalog-key">{item.sign || "—"}</span>
                    </StyledTableCell>
                    <StyledTableCell>
                      <StatusChip
                        label={item.status || "inactive"}
                        tone={item.status === "active" ? "ok" : "warn"}
                      />
                    </StyledTableCell>
                    <StyledTableCellAction>
                      <Tooltip title={t("Edit")}>
                        <IconButton
                          onClick={() =>
                            dispatch(
                              modalActions.openModal({
                                type: MODAL.ADD_UOM,
                                data: {
                                  id: item?._id,
                                  data: item,
                                  type,
                                },
                                width: "500px",
                              })
                            )
                          }
                        >
                          <EditNoteIcon />
                        </IconButton>
                      </Tooltip>

                      <BlockComponent allowedRoles={["admin"]}>
                        <Tooltip title={t("Delete")}>
                          <IconButton
                            onClick={() =>
                              dispatch(
                                modalActions.openModal({
                                  type: MODAL.CONFIRMATION_FORM,
                                  data: {
                                    heading: t("Delete UOM"),
                                    message: t(
                                      "Are you sure you want to delete this UOM?"
                                    ),
                                    confirmAction: () => {
                                      MeasurementScaleService.remove(
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
                ))}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>

        <div className="pagination-list-bottom">
          <p>
            {count > 0 &&
              `${count} ${count > 1 ? t("Counts") : t("Count")}`}
          </p>

          {count > 0 && (
            <Pagination
              variant="outlined"
              color="primary"
              page={listQuery.page}
              disabled={refreshLoader}
              count={Math.max(1, Math.ceil(count / listQuery.limit))}
              onChange={(_e, page) =>
                listQuery.setPage(page)
              }
            />
          )}
        </div>
      </TableWrapper>
    </>
  );
}
