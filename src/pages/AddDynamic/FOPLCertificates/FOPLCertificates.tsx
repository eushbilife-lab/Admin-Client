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
import { useTranslation } from "react-i18next";
import imagesService from "services/images.service";
import { imageActions } from "redux/slices/images";
import BlockComponent from "@core/api-components/BlockComponent";
import Tooltip from "@core/basic-components/Tooltip";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CatalogToolbar, {
  CatalogMetaPill,
} from "@core/templates/CatalogToolbar";
import {
  matchesSearch,
  sortByName,
  type NameSort,
} from "@core/templates/CatalogToolbar/catalogList.util";

export default function FOPLCertificates({ type }: any) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { refresh, refreshLoader } = useAppSelector((state) => state.image);
  const { count, images, loading, filters } = useAppSelector(
    (state) => state.image.product_certificate
  );

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<NameSort>("az");

  useEffect(() => {
    imagesService.getAll(type, filters, dispatch);
  }, [dispatch, refresh, filters, type]);

  useEffect(() => {
    return () => {
      dispatch(imageActions.resetPage(type));
    };
  }, [dispatch, type]);

  const rowName = (item: any) => String(item?.name || "");

  const visible = useMemo(() => {
    const list = (images || []).filter((item: any) =>
      matchesSearch([rowName(item)], search)
    );
    return sortByName(list, rowName, sort);
  }, [images, search, sort]);

  return (
    <>
      <CatalogToolbar
        hint="Front-of-pack certificate badges shown on product labels."
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search certificate… (⌘K)"
        searchAriaLabel="Search certificates"
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
        actions={
          <Button
            variant="contained"
            onClick={() =>
              dispatch(
                modalActions.openModal({
                  type: MODAL.ADD_FOPLCERTIFICATE,
                  data: { type },
                  width: "500px",
                })
              )
            }
          >
            {t("Add Certificate")}
          </Button>
        }
      />

      {loading && <CircleLoader />}

      <TableWrapper>
        <TableContainer>
          <Table aria-label="FOPL certificates" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={3}
              loading={loading}
              length={refreshLoader ? 0 : visible.length}
              message={
                search
                  ? "No certificates match your search."
                  : t("No certificate currently available.")
              }
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">{t("Name")}</StyledTableCell>
                  <StyledTableCell align="left">{t("Image")}</StyledTableCell>
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
                        {item?.name}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      {!item.url ? (
                        <CircleLoader />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.name}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      )}
                    </StyledTableCell>
                    <StyledTableCellAction>
                      <Tooltip title={t("Edit")}>
                        <IconButton
                          onClick={() =>
                            dispatch(
                              modalActions.openModal({
                                type: MODAL.ADD_FOPLCERTIFICATE,
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
                                    heading: t("Delete FOPL Certificate"),
                                    message: t(
                                      "Are you sure you want to delete this FOPL Certificate?"
                                    ),
                                    confirmAction: () => {
                                      imagesService.remove(
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
              page={filters.page}
              disabled={refreshLoader}
              count={Math.ceil(count / filters.page_size)}
              onChange={(_e, page) =>
                dispatch(imageActions.setPage({ type, page }))
              }
            />
          )}
        </div>
      </TableWrapper>
    </>
  );
}
