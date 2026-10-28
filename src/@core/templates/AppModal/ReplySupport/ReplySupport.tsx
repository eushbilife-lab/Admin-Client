import { useState } from "react";
import { Button, Box, TextField, Divider, Chip } from "@mui/material";
import { modalActions } from "redux/slices/modal";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import ContactService from "services/contact.service";

export default function ReplySupport() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.modal.data);
  const loading = useAppSelector((state) => state.modal.loading);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const ticket = data?.ticket || {};
  const reason = ticket.reason || "—";
  const comments = ticket.comments || ticket.message || "—";
  const name = ticket.fullName || ticket.name || "Member";
  const email = ticket.email || "—";
  const ticketNo = ticket.ticket_number ? `#${ticket.ticket_number}` : "";

  const onSend = async () => {
    const text = response.trim();
    if (text.length < 2) {
      setError("Write a reply of at least 2 characters.");
      return;
    }
    if (!ticket._id) {
      setError("Ticket id is missing.");
      return;
    }
    setError("");
    await ContactService.replyToTicket(data?.type || "open", ticket._id, text);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 1,
        }}
      >
        <h3 style={{ margin: 0 }}>Reply to ticket</h3>
        {ticketNo ? (
          <Chip label={ticketNo} size="small" color="success" variant="outlined" />
        ) : null}
      </Box>
      <p style={{ margin: "0 0 4px", color: "#0A0A0A", fontSize: 14, fontWeight: 600 }}>
        {name}
      </p>
      <p style={{ margin: "0 0 12px", color: "#515151", fontSize: 13 }}>{email}</p>

      <Divider sx={{ mb: 1.5 }} />

      <p
        style={{
          margin: "0 0 4px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: "#8A9199",
        }}
      >
        Reason
      </p>
      <p style={{ margin: "0 0 12px", fontSize: 14, color: "#0A0A0A" }}>{reason}</p>

      <p
        style={{
          margin: "0 0 4px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: "#8A9199",
        }}
      >
        Comments
      </p>
      <Box
        sx={{
          mb: 2,
          p: 1.5,
          bgcolor: "#F4F7EC",
          borderLeft: "4px solid #9FC53A",
          borderRadius: "0 8px 8px 0",
          fontSize: 13,
          whiteSpace: "pre-wrap",
          color: "#0A0A0A",
          lineHeight: 1.55,
        }}
      >
        {comments}
      </Box>

      <TextField
        label="Your reply"
        placeholder="Write a clear, helpful response for the member…"
        multiline
        minRows={5}
        fullWidth
        value={response}
        disabled={loading}
        onChange={(e) => setResponse(e.target.value)}
        error={Boolean(error)}
        helperText={
          error ||
          "Sends a branded Eushbi Live email to the member and closes this ticket."
        }
      />

      <Box sx={{ display: "flex", gap: 1.5, mt: 2.5 }}>
        <Button
          variant="contained"
          disabled={loading}
          onClick={onSend}
          sx={{ bgcolor: "#9FC53A", "&:hover": { bgcolor: "#8BB52F" } }}
        >
          {loading ? "Sending…" : "Send reply & close"}
        </Button>
        <Button
          variant="outlined"
          disabled={loading}
          onClick={() => dispatch(modalActions.closeModal())}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
