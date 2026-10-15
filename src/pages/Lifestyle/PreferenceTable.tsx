import { StyledTableCell, StyledTableCellAction, StyledTableRow, adminTableSx } from "@core/templates/Tables";
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
import healthPreferenceService from "services/healthPreference.service";
import { healthPrefernceActions } from "redux/slices/healthPrefernce";
import Tooltip from "@core/basic-components/Tooltip";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import BlockComponent from "@core/api-components/BlockComponent";
import StatusChip from "@core/templates/PageShell/StatusChip";
import type { healthPrefernceType } from "redux/slices/healthPrefernce";
import { optionLabel } from "utils/selectOption.util";

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
  const { refresh, refreshLoader } = useAppSelector((state) => state.healthPreference);
  const bucket = useAppSelector((state) => state.healthPreference[type]);
  const count = bucket?.count || 0;
  const hps = bucket?.hps || [];
  const loading = bucket?.loading;
  const filters = bucket?.filters || { page: 1, page_size: 10 };

  useEffect(() => {
    healthPreferenceService.getAllHp(type, filters, dispatch);
  }, [dispatch, refresh, filters, type]);

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

  return (
    <>
      <Box
        className="table-toolbar"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 1.5,
        }}
      >
        {blurb ? (
          <Typography
            variant="body2"
            sx={{
              color: "var(--text-secondary)",
              flex: "1 1 16rem",
              maxWidth: "36rem",
              lineHeight: 1.5,
            }}
          >
            {blurb}
          </Typography>
        ) : (
          <span />
        )}
        <Button variant="contained" onClick={() => openEditor()}>
          {addLabel}
        </Button>
      </Box>
      {loading && <CircleLoader />}

      <TableWrapper>
        <TableContainer>
          <Table aria-label={`${type} table`} sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={4}
              loading={!!loading}
              length={refreshLoader ? 0 : hps?.length}
              message={emptyMessage}
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
                {hps?.map((item: any) => {
                  const name = optionLabel(item, "");
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
