import { StyledTableCell, StyledTableCellAction, StyledTableRow, adminTableSx } from "@core/templates/Tables";
import TableLoadingWrapper from "@core/templates/TableLoadingWrapper";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import TableWrapper from "@core/templates/TableWrapper";
import { useEffect } from "react";
import moment from "moment";
import {
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { reviewsActions } from "redux/slices/Reviews";
import reviewsService from "services/reviews.service";
import ReviewsFilters from "./ReviewsFilters";
import { Link } from "react-router-dom";
import PageShell from "@core/templates/PageShell";

export default function Reviews() {
  const dispatch = useAppDispatch();
  const { count, Reviews, loading, refreshLoader, filters, refresh } =
    useAppSelector((state) => state.review);

  useEffect(() => {
    reviewsService.getAll(filters, dispatch);
  }, [dispatch, refresh, filters]);

  useEffect(() => {
    return () => {
      dispatch(reviewsActions.resetPage());
    };
  }, [dispatch]);

  return (
    <PageShell
      kicker="Feedback"
      title="Reviews"
      subtitle="Taste, texture, and appearance scores left by members."
    >
      {loading && <CircleLoader />}
      <ReviewsFilters
        count={count}
        reviewsActions={reviewsActions}
        refreshLoader={refreshLoader}
        filters={filters}
      />
      <TableWrapper>
        <TableContainer>
          <Table aria-label="Reviews table" sx={adminTableSx}>
            <TableLoadingWrapper
              coloumns={6}
              loading={loading}
              length={refreshLoader ? 0 : Reviews?.length}
              message="No product reviews currently available."
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Product</StyledTableCell>
                  <StyledTableCell>Member</StyledTableCell>
                  <StyledTableCell>Rating</StyledTableCell>
                  <StyledTableCellAction>Comments</StyledTableCellAction>
                </TableRow>
              </TableHead>
              <TableBody>
                {Reviews?.map((item: any) => (
                  <StyledTableRow key={item?._id}>
                    <StyledTableCell>{item?.doc_number}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                      {moment(item?.createdAt).format("YYYY-MM-DD HH:mm")}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Link
                        to={`/update-product/${item?.productID?._id}`}
                        style={{ textDecoration: "none", color: "inherit", fontWeight: 600 }}
                      >
                        {item?.productID?.productName}
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell>
                      {`${item?.userID?.firstName || ""} ${item?.userID?.lastName || ""}`.trim() || "—"}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item?.totalRating ?? "—"}
                    </StyledTableCell>
                    <StyledTableCellAction>
                      {item?.comments || "—"}
                    </StyledTableCellAction>
                  </StyledTableRow>
                ))}
              </TableBody>
            </TableLoadingWrapper>
          </Table>
        </TableContainer>
        <div className="pagination-list-bottom">
          <p>{count > 0 ? `${count} ${count === 1 ? "review" : "reviews"}` : ""}</p>
          {count > 0 && (
            <Pagination
              variant="outlined"
              color="primary"
              page={filters.page}
              disabled={refreshLoader}
              count={Math.ceil(count / filters.page_size)}
              onChange={(_e, page) => dispatch(reviewsActions.setPage(page))}
            />
          )}
        </div>
      </TableWrapper>
    </PageShell>
  );
}
