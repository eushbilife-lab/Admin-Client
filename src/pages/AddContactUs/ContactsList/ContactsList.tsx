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
  Stack,
} from "@mui/material";
import { MODAL, modalActions } from "redux/slices/modal";
import type { ContactListProps } from ".";
import { contactActions } from "redux/slices/contact";
import moment from "moment";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import {
  StyledTableCell,
  StyledTableCellAction,
  StyledTableRow,
  adminTableSx,
} from "@core/templates/Tables";
import ContactFilters from "../ContactFilters";
import TableWrapper from "@core/templates/TableWrapper";

export default function ContactsList({ type }: ContactListProps) {
  const dispatch = useAppDispatch();
  const slice = useAppSelector((state) => state.contact?.[type]);
  const loading = slice?.loading ?? true;
  const contacts = Array.isArray(slice?.contacts) ? slice.contacts : [];
  const count = slice?.count ?? 0;
  const refreshLoader = slice?.refreshLoader ?? false;
  const filters = slice?.filters || { page: 1, page_size: 30 };
  const refresh = slice?.refresh ?? 0;
  const pageSize = Number(filters.page_size) || 30;

  useEffect(() => {
    return () => {
      dispatch(contactActions.resetPage(type));
    };
  }, [dispatch, type]);

  useEffect(() => {
    ContactService.getAllContacts(filters, type, false);
  }, [filters, type, refresh]);

  return (
    <>
      <ContactFilters type={type} />
      <br />
      <TableWrapper refreshing={refreshLoader}>
        <TableContainer>
          <Table aria-label="support tickets" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={5}
              loading={loading}
              length={contacts.length}
              message="No support tickets in this list."
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Ticket</StyledTableCell>
                  <StyledTableCell>Member</StyledTableCell>
                  <StyledTableCell>Subject</StyledTableCell>
                  <StyledTableCell>Updated</StyledTableCell>
                  {type === "close" ? (
                    <StyledTableCell>Reply</StyledTableCell>
                  ) : (
                    <StyledTableCellAction>Action</StyledTableCellAction>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact: any, index: number) => (
                  <StyledTableRow key={contact?._id || index}>
                    <StyledTableCell>
                      <strong>
                        {contact?.ticket_number
                          ? `#${contact.ticket_number}`
                          : "—"}
                      </strong>
                      <div style={{ fontSize: 11, color: "#8A9199" }}>
                        {contact?.status === "in_progress"
                          ? "In progress"
                          : contact?.status === "close"
                            ? "Closed"
                            : "Open"}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      {contact?.fullName || contact?.name || "—"}
                      <div style={{ fontSize: 12, color: "#666" }}>
                        {contact?.email || ""}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        maxWidth: 320,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>
                        {contact?.reason || "—"}
                      </div>
                      <div style={{ fontSize: 12, color: "#515151" }}>
                        {(contact?.comments || contact?.message || "").slice(
                          0,
                          120
                        )}
                        {(contact?.comments || contact?.message || "").length >
                        120
                          ? "…"
                          : ""}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      {moment(
                        contact?.lastActivityAt || contact?.createdAt
                      ).format("YYYY-MM-DD hh:mm a")}
                    </StyledTableCell>
                    {type === "close" ? (
                      <StyledTableCell
                        sx={{
                          maxWidth: 240,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {contact?.adminResponse || "—"}
                      </StyledTableCell>
                    ) : (
                      <StyledTableCellAction>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                              dispatch(
                                modalActions.openModal({
                                  width: "640px",
                                  type: MODAL.REPLY_SUPPORT,
                                  data: { ticket: contact, type },
                                })
                              );
                            }}
                          >
                            Reply
                          </Button>
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
                                    heading: "Close ticket",
                                    message:
                                      "Close this ticket without emailing a reply?",
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
                            Close
                          </Button>
                        </Stack>
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
                {count} {count > 1 ? "tickets" : "ticket"}
              </p>
              <Pagination
                variant="outlined"
                color="primary"
                page={Number(filters.page) || 1}
                disabled={refreshLoader}
                count={Math.max(1, Math.ceil(count / pageSize))}
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
