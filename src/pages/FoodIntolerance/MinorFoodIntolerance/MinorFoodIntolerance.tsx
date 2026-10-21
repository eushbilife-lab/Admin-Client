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
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { localizedData } from "utils/localizedData.util";
import foodIntoleranceService from "services/foodIntolerance.service";
import { foodIntoleranceActions } from "redux/slices/foodIntolerance";
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

export default function MinorFoodIntolerance() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { count, foodIntolerances, loading, refresh, refreshLoader } =
    useAppSelector((state) => state.foodIntolerance);

  const listQuery = useListQueryParams();
  const [sort, setSort] = useState<NameSort>("az");

  useEffect(() => {
    foodIntoleranceService.getAllMinor(listQuery.filters, dispatch);
  }, [dispatch, refresh, listQuery.filters]);

  useEffect(() => {
    return () => {
      dispatch(foodIntoleranceActions.resetPage());
    };
  }, [dispatch]);

  const rowName = (item: any) =>
    String(
      localizedData({ en: item?.en?.name, ar: item?.ar?.name }) || ""
    );

  const parentName = (item: any) =>
    String(
      localizedData({
        en: item?.majorFoodIntoleranceID?.en?.name,
        ar: item?.majorFoodIntoleranceID?.ar?.name,
      }) ||
        localizedData({
          en: item?.majorAllergyID?.en?.name,
          ar: item?.majorAllergyID?.ar?.name,
        }) ||
        ""
    );

  const statusCounts = useMemo(
    () => countByStatus(foodIntolerances || []),
    [foodIntolerances]
  );

  const visible = useMemo(
    () => sortByName(foodIntolerances || [], rowName, sort),
    [foodIntolerances, sort]
  );

  return (
    <>
      <CatalogToolbar
        hint="Specific foods under each intolerance category."
        search={listQuery.searchInput}
        onSearchChange={listQuery.setSearch}
        searchPlaceholder="Search subcategory or parent… (⌘K)"
        searchAriaLabel="Search intolerance subcategories"
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
                  type: MODAL.ADD_MINOR_FOOD_INTOLERANCE,
                  data: {},
                  width: "500px",
                })
              )
            }
          >
            {t("Add Sub Category")}
          </Button>
        }
      />
      <TableWrapper
        refreshing={refreshLoader}
      >
        <TableContainer>
          <Table aria-label="Intolerance subcategories" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={4}
              loading={loading}
              length={visible.length}
              message={
                listQuery.debouncedSearch || listQuery.status !== "all"
                  ? "No subcategories match your search or filters."
                  : t("No sub Categories currently available")
              }
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>{t("Name")}</StyledTableCell>
                  <StyledTableCell>{t("Category")}</StyledTableCell>
                  <StyledTableCell>{t("Status")}</StyledTableCell>
                  <StyledTableCellAction>{t("Action")}</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((item: any) => (
                  <StyledTableRow key={item?._id}>
                    <StyledTableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {rowName(item)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2">{parentName(item)}</Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <StatusChip
                        label={item?.status || "inactive"}
                        tone={item?.status === "active" ? "ok" : "warn"}
                      />
                    </StyledTableCell>
                    <StyledTableCellAction>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() =>
                          dispatch(
                            modalActions.openModal({
                              type: MODAL.ADD_MINOR_FOOD_INTOLERANCE,
                              data: { id: item._id, data: item },
                              width: "500px",
                            })
                          )
                        }
                      >
                        {t("Edit")}
                      </Button>
                    </StyledTableCellAction>
                  </StyledTableRow>
                ))}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>

        <div className="pagination-list-bottom">
          <p>
            {count > 0 && `${count} ${count > 1 ? t("Counts") : t("Count")}`}
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
