import { StyledTableCell, StyledTableCellAction, StyledTableRow, adminTableSx } from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import TableWrapper from "@core/templates/TableWrapper";
import { useNavigate } from "react-router-dom";
import PageShell from "@core/templates/PageShell";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect } from "react";
import CircleLoader from "@core/basic-components/CircleLoader";
import NotificationService from "services/notification.service";
import { notificationActions } from "redux/slices/notification";
import moment from "moment";

export default function Notifications() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { count, notifications, loading, refreshLoader, filters, refresh } =
    useAppSelector((state) => state.notification);

  useEffect(() => {
    NotificationService.getAllNotifications(filters, dispatch);
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(notificationActions.resetPage());
    };
  }, [dispatch]);

  return (
    <PageShell
      kicker="Operations"
      title="Notifications"
      subtitle="Push messages sent to members in the live app."
      actions={
        <Button variant="contained" onClick={() => navigate("/add-notifications")}>
          Send notification
        </Button>
      }
    >
      {loading && <CircleLoader />}
      <TableWrapper>
        <TableContainer>
          <Table aria-label="Notifications table" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={6}
              loading={loading}
              length={refreshLoader ? 0 : notifications.length}
              message="There are no notifications currently available."
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Image</StyledTableCell>
                  <StyledTableCell>Title</StyledTableCell>
                  <StyledTableCell>Content</StyledTableCell>
                  <StyledTableCell>URL</StyledTableCell>
                  <StyledTableCellAction>Action</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications?.map((item) => (
                  <StyledTableRow key={item?._id}>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                      {moment(item?.createdAt).format("YYYY-MM-DD hh:mm a")}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item?.media ? (
                        <img
                          src={item?.media}
                          alt=""
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      ) : (
                        "—"
                      )}
                    </StyledTableCell>
                    <StyledTableCell>{item?.title}</StyledTableCell>
                    <StyledTableCell>{item?.content}</StyledTableCell>
                    <StyledTableCell>{item?.url || "—"}</StyledTableCell>
                    <StyledTableCellAction>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(`/update-notifications/${item?._id}`)}
                      >
                        Edit
                      </Button>
                    </StyledTableCellAction>
                  </StyledTableRow>
                ))}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>
        <div className="pagination-list-bottom">
          <p>{count > 0 ? `${count} ${count === 1 ? "message" : "messages"}` : ""}</p>
          {count > 0 && (
            <Pagination
              variant="outlined"
              color="primary"
              page={filters.page}
              disabled={refreshLoader}
              count={Math.ceil(count / filters.page_size)}
              onChange={(_e, page) => dispatch(notificationActions.setPage(page))}
            />
          )}
        </div>
      </TableWrapper>
    </PageShell>
  );
}
