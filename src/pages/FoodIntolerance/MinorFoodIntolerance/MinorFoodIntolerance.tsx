import {
  StyledTableCell,
  StyledTableCellAction,
  StyledTableRow, adminTableSx } from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { MODAL, modalActions } from "redux/slices/modal";
import TableWrapper from "@core/templates/TableWrapper";
import { dynamicActions } from "redux/slices/dynamic";
import Button from "@core/basic-components/Button";
import { useEffect } from "react";
import {
  Box,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import allergyService from "services/allergy.service";
import allergies, { allergyActions } from "redux/slices/allergies";
import { useTranslation } from "react-i18next";
import { localizedData } from "utils/localizedData.util";
import foodIntoleranceService from "services/foodIntolerance.service";
import { foodIntoleranceActions } from "redux/slices/foodIntolerance";
export default function MinorFoodIntolerance({ type }: any) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { count, foodIntolerances, loading, filters, refresh, refreshLoader } =
    useAppSelector((state) => state.foodIntolerance);

  useEffect(() => {
    foodIntoleranceService.getAllMinor(filters, dispatch);
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(foodIntoleranceActions.resetPage());
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
                type: MODAL.ADD_MINOR_FOOD_INTOLERANCE,
                data: {},
                width: "500px",
              })
            )
          }
        >
          {t("Add Sub Category")}
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
              coloumns={4}
              loading={loading}
              length={refreshLoader ? 0 : foodIntolerances?.length}
              message={t("No sub Categories currently available")}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>{t("Name")}</StyledTableCell>
                  <StyledTableCell>{t("Status")}</StyledTableCell>
                  <StyledTableCell>{t("Category")}</StyledTableCell>
                  <StyledTableCellAction>{t("Action")}</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {foodIntolerances?.map((item) => (
                  <StyledTableRow key={item?._id}>
                    <StyledTableCell>
                      <Typography variant="body2">
                        {localizedData({
                          en: item?.en?.name,
                          ar: item?.ar?.name,
                        })}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2">{t(item?.status)}</Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2">
                        {localizedData({
                          en: item?.majorFoodIntoleranceID?.en?.name,
                          ar: item?.majorFoodIntoleranceID?.ar?.name,
                        })}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCellAction>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          fontSize: "12px",
                          textTransform: "capitalize",
                          padding: "4px 12px",
                        }}
                        onClick={() =>
                          dispatch(
                            modalActions.openModal({
                              type: MODAL.ADD_MINOR_FOOD_INTOLERANCE,
                              data: {
                                id: item._id,
                                data: item,
                              },
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
            {" "}
            {count > 0 && `${count} ${count > 1 ? t("Counts") : t("Count")}`}
          </p>

          {count > 0 && (
            <Pagination
              variant="outlined"
              color="primary"
              page={filters.page}
              disabled={refreshLoader}
              count={Math.ceil(count / filters.page_size)}
              onChange={(_e, page) => dispatch(foodIntoleranceActions.setPage(page))}
            />
          )}
        </div>
      </TableWrapper>
    </>
  );
}
