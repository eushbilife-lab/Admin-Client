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
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import allergyService from "services/allergy.service";
import { allergyActions } from "redux/slices/allergies";
import { useTranslation } from "react-i18next";
import { localizedData } from "utils/localizedData.util";
import StatusChip from "@core/templates/PageShell/StatusChip";
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

export default function MajorAllergy() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { count, allergies, loading, filters, refresh, refreshLoader } =
    useAppSelector((state) => state.allergy);

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
    allergyService.getAllMajor(next, dispatch);
  }, [dispatch, refresh, filters, search]);

  useEffect(() => {
    return () => {
      dispatch(allergyActions.resetPage());
    };
  }, [dispatch]);

  const rowName = (item: any) =>
    String(
      localizedData({ en: item?.en?.name, ar: item?.ar?.name }) || ""
    );

  const statusCounts = useMemo(
    () => countByStatus(allergies || []),
    [allergies]
  );

  const visible = useMemo(() => {
    let list = (allergies || []).filter((item: any) =>
      matchesSearch(
        [
          rowName(item),
          localizedData({
            en: item?.subCategoryID?.en?.name,
            ar: item?.subCategoryID?.ar?.name,
          }),
        ],
        search
      )
    );
    list = filterByStatus(list, status);
    return sortByName(list, rowName, sort);
  }, [allergies, search, status, sort]);

  return (
    <>
      <CatalogToolbar
        hint="Major allergen groups (milk, eggs, nuts…) used on labels and member safety profiles."
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search category… (⌘K)"
        searchAriaLabel="Search allergen categories"
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
          <Button
            variant="contained"
            onClick={() =>
              dispatch(
                modalActions.openModal({
                  type: MODAL.ADD_MAJOR_ALLERGY,
                  data: {},
                  width: "500px",
                })
              )
            }
          >
            {t("Add Category")}
          </Button>
        }
      />

      {loading && <CircleLoader />}
      <TableWrapper>
        <TableContainer>
          <Table aria-label="Allergen categories" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={3}
              loading={loading}
              length={refreshLoader ? 0 : visible.length}
              message={
                search || status !== "all"
                  ? "No categories match your search or filters."
                  : t("No category currently available")
              }
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>{t("Name")}</StyledTableCell>
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
                      <Typography
                        variant="caption"
                        sx={{ color: "var(--text-secondary)" }}
                      >
                        {localizedData({
                          en: item?.subCategoryID?.en?.name,
                          ar: item?.subCategoryID?.ar?.name,
                        })}
                      </Typography>
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
                              type: MODAL.ADD_MAJOR_ALLERGY,
                              data: { id: item?._id, data: item },
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
              page={filters.page}
              disabled={refreshLoader}
              count={Math.ceil(count / filters.page_size)}
              onChange={(_e, page) => dispatch(allergyActions.setPage(page))}
            />
          )}
        </div>
      </TableWrapper>
    </>
  );
}
