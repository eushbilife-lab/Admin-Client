import { StyledTableCell, StyledTableCellAction, StyledTableRow , adminTableSx } from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { MODAL, modalActions } from "redux/slices/modal";
import TableWrapper from "@core/templates/TableWrapper";
import Button from "@core/basic-components/Button";
import { useEffect } from "react";
import {
  Box,
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

export default function UOM({ type }: any) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { refresh, refreshLoader } = useAppSelector(
    (state) => state.measurementScale
  );
  const { count, measurementScales, loading, filters } = useAppSelector(
    (state) => state.measurementScale.uom
  );

  useEffect(() => {
    MeasurementScaleService.getAll(type, filters, dispatch);
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(measurementScaleActions.resetPage(type));
    };
  }, [dispatch]);

  return (
    <>
      <Box className="table-toolbar">
        <Button
          variant="contained"
          onClick={() =>
            dispatch(
              modalActions.openModal({
                type: MODAL.ADD_UOM,
                data: {
                  type,
                },
                width: "500px",
              })
            )
          }
        >
          {t("Add UOM")}
        </Button>
      </Box>
      {loading && <CircleLoader />}

      <TableWrapper>
        <TableContainer>
          <Table
            aria-label="customized table"
            sx={adminTableSx}
          >
            <TableLoadingWrapper
              coloumns={3}
              loading={loading}
              length={refreshLoader ? 0 : measurementScales?.length}
              message={t("No UOM currently available.")}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">{t("Name")}</StyledTableCell>
                  <StyledTableCell align="left">{t("Status")}</StyledTableCell>
                  <StyledTableCell align="left">{t("Sign")}</StyledTableCell>
                  <StyledTableCellAction align="center">
                    {t("Action")}
                  </StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {measurementScales?.map((item: any) => (
                  <StyledTableRow key={item._id}>
                    <StyledTableCell>
                      <Typography variant="body2">
                        {localizedData({
                          en: item?.en?.name,
                          ar: item?.ar?.name,
                        })}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2">{t(item.status)}</Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2">{t(item.sign)}</Typography>
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
                                      MeasurementScaleService.remove(item._id, dispatch,type,filters);
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
        <p>  {count > 0 && `${count} ${count > 1 ? t("Counts") : t("Count")}`}</p>

          {count > 0 && (
            <Pagination
              variant="outlined"
              color="primary"
              page={filters.page}
              disabled={refreshLoader}
              count={Math.ceil(count / filters.page_size)}
              onChange={(_e, page) => dispatch(measurementScaleActions.setPage({type,page}))}
            />
          )}
        </div>
      </TableWrapper>
    </>
  );
}
