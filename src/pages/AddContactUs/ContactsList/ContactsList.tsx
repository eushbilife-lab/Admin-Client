import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import ContactService from "services/contact.service";
import {
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableContainer,
  Pagination,
  Button,
} from "@mui/material";
import { MODAL, modalActions } from "redux/slices/modal";
import type { ContactListProps } from ".";
import { contactActions } from "redux/slices/contact";
import moment from "moment";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import { StyledTableCell, StyledTableCellAction, StyledTableRow , adminTableSx } from "@core/templates/Tables";
import ContactFilters from "../ContactFilters";
import { useTranslation } from "react-i18next";
import TableWrapper from "@core/templates/TableWrapper";

export default function ContactsList({ type }: ContactListProps) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.contact[type].loading);
  const contacts = useAppSelector((state) => state.contact[type].contacts);
  const count = useAppSelector((state) => state.contact[type].count);
  const refreshLoader = useAppSelector(
    (state) => state.contact[type].refreshLoader
  );
  const filters = useAppSelector((state) => state.contact[type].filters);
  const refresh = useAppSelector((state) => state.contact[type].refresh);
  const { t } = useTranslation();
  useEffect(() => {
    return () => {
      dispatch(contactActions.resetPage(type));
    };
  }, [dispatch, type]);

  useEffect(() => {
    const exportFile = false;
    ContactService.getAllContacts(filters, type, exportFile);
  }, [filters, type, refresh]);

  return (
    <>
      <ContactFilters type={type} />
      <br />
      <TableWrapper>
        <TableContainer>
          <Table
            aria-label="customized table"
            sx={adminTableSx}
          >
            <TableLoadingWrapper
              coloumns={4}
              loading={loading}
              length={refreshLoader ? 0 : contacts?.length}
              message={t("No Users currently available.")}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Created</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Message</StyledTableCell>
                  {type === "open" ? (
                    <StyledTableCellAction>Action</StyledTableCellAction>
                  ) : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts?.map((contact, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell >
                      {moment(contact?.createdAt).format("YYYY-MM-DD hh:mm a")}
                    </StyledTableCell>
                    <StyledTableCell>{contact.fullName}</StyledTableCell>
                    <StyledTableCell>{contact.email}</StyledTableCell>
                    <StyledTableCell>{contact.message}</StyledTableCell>
                    {type === "open" && (
                      <StyledTableCellAction>
                        <Button
                          size="small"
                          variant="text"
                          color="error"
                          onClick={() => {
                            dispatch(
                              modalActions.openModal({
                                width: "500px",
                                type: MODAL.CONFIRMATION_FORM,
                                data: {
                                  heading: "Close Contact Request",
                                  message:
                                    "Do you really want to close this contact request?",
                                  confirmAction: () => {
                                    ContactService.deleteContactRequest(
                                      type,
                                      contact?._id
                                    );
                                  },
                                },
                              })
                            );
                          }}
                        >
                          {t("Close")}
                        </Button>
                      </StyledTableCellAction>
                    )}
                  </StyledTableRow>
                ))}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>
        <div className="pagination-list-bottom">
          {count > 0 && (
            <>
              <p>
                {count} {count > 1 ? t("Counts") : t("Count")}
              </p>
              <Pagination
                variant="outlined"
                color="primary"
                page={filters.page}
                disabled={refreshLoader}
                count={Math.ceil(count / filters.page_size)}
                onChange={(_, page) =>
                  dispatch(contactActions.setPage({ page, type }))
                }
              />
            </>
          )}
        </div>
      </TableWrapper>
    </>
  );
}
