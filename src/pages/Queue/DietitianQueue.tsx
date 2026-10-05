import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import CircleLoader from "@core/basic-components/CircleLoader";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import TableWrapper from "@core/templates/TableWrapper";
import { StyledTableCell, StyledTableCellAction, StyledTableRow, adminTableSx } from "@core/templates/Tables";
import http from "services/http.service";
import Promisable from "services/promisable.service";
import productService from "services/product.service";
import { useAppDispatch } from "redux/hooks";
import { MODAL, modalActions } from "redux/slices/modal";

const silent = { headers: { "X-Skip-Toast": "1" } };

type QueueItem = {
  _id: string;
  productName?: string;
  brand?: string;
  barcode?: string;
  status?: string;
  hasNutritionFacts?: boolean;
  nfCount?: number;
  foplCount?: number;
  kind: "pending" | "draft";
};

export default function DietitianQueue() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    http.setJWT();
    http.setLanguage();
    const [pendingRes, draftRes]: any[] = await Promise.all([
      Promisable.asPromise(http.post("/products/query", { page: 1, page_size: 30, isDelete: false, status: "pending" }, silent)),
      Promisable.asPromise(http.post("/draft-products/query", { page: 1, page_size: 20 }, silent)),
    ]);
    const pending = (pendingRes?.[0]?.data?.data?.products || []).map((item: any) => ({ ...item, kind: "pending" as const }));
    const drafts = (draftRes?.[0]?.data?.data?.products || []).map((item: any) => ({
      ...item,
      kind: "draft" as const,
    }));
    setItems([...pending, ...drafts]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PageShell
      kicker="Review"
      title="Review queue"
      subtitle="Approve pending foods and finish drafts before they reach the live catalog."
      actions={
        <Button variant="contained" onClick={() => navigate("/add-product")}>
          Add food
        </Button>
      }
    >
      {loading && <CircleLoader />}
      <TableWrapper>
        <TableContainer>
          <Table aria-label="Dietitian queue table" sx={adminTableSx}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Product</StyledTableCell>
                <StyledTableCell>Brand</StyledTableCell>
                <StyledTableCell>Kind</StyledTableCell>
                <StyledTableCell>Nutrition facts</StyledTableCell>
                <StyledTableCellAction>Action</StyledTableCellAction>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => {
                const hasFacts = item.hasNutritionFacts || (item.nfCount || 0) > 0;
                return (
                  <StyledTableRow key={`${item.kind}-${item._id}`}>
                    <StyledTableCell>{item.productName || "Untitled food"}</StyledTableCell>
                    <StyledTableCell>{item.brand || item.barcode || "—"}</StyledTableCell>
                    <StyledTableCell>
                      <StatusChip
                        label={item.kind === "draft" ? "Draft" : "Pending review"}
                        tone={item.kind === "draft" ? "info" : "warn"}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <StatusChip
                        label={hasFacts ? "Facts present" : "Missing facts"}
                        tone={hasFacts ? "ok" : "danger"}
                      />
                    </StyledTableCell>
                    <StyledTableCellAction>
                      <Button
                        size="small"
                        onClick={() =>
                          navigate(
                            item.kind === "draft"
                              ? `/update-draftProduct/${item._id}?isDraft=true`
                              : `/update-product/${item._id}`
                          )
                        }
                      >
                        Open
                      </Button>
                      {item.kind === "pending" ? (
                        <Button
                          size="small"
                          variant="contained"
                          sx={{ ml: 1 }}
                          onClick={() =>
                            dispatch(
                              modalActions.openModal({
                                type: MODAL.CONFIRMATION_FORM,
                                data: {
                                  heading: "Approve product",
                                  message: "Publish this food to the live catalog?",
                                  confirmAction: async () => {
                                    await productService.updateStatus(item._id, { status: "active" }, dispatch);
                                    load();
                                  },
                                },
                                width: "480px",
                              })
                            )
                          }
                        >
                          Approve
                        </Button>
                      ) : null}
                    </StyledTableCellAction>
                  </StyledTableRow>
                );
              })}
              {!loading && items.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={5}>Queue is clear. Nothing waiting for a dietitian.</StyledTableCell>
                </StyledTableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </TableWrapper>
    </PageShell>
  );
}
