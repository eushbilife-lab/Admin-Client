import { useState } from "react";
import {
  Button,
  Box,
  TextField,
  Divider,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { modalActions } from "redux/slices/modal";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import ContactService from "services/contact.service";
import moment from "moment";

export default function ReplySupport() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.modal.data);
  const loading = useAppSelector((state) => state.modal.loading);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [closeTicket, setCloseTicket] = useState(true);

  const ticket = data?.ticket || {};
  const reason = ticket.reason || "—";
  const comments = ticket.comments || ticket.message || "—";
  const name = ticket.fullName || ticket.name || "Member";
  const email = ticket.email || "—";
  const ticketNo = ticket.ticket_number ? `#${ticket.ticket_number}` : "";
  const thread = Array.isArray(ticket.messages) ? ticket.messages : [];

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
    await ContactService.replyToTicket(
      data?.type || "open",
      ticket._id,
      text,
      { close: closeTicket }
    );
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ m: 0, mb: 1, fontWeight: 800 }}>
        Support reply {ticketNo}
      </Typography>

      <Typography sx={{ m: 0, fontWeight: 600 }}>{name}</Typography>
      <Typography sx={{ mb: 1.5, color: "#515151", fontSize: 13 }}>
        {email}
      </Typography>

      <Divider sx={{ mb: 1.5 }} />

      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: "#8A9199",
          mb: 0.5,
        }}
      >
        Subject
      </Typography>
      <Typography sx={{ mb: 1.5 }}>{reason}</Typography>

      {thread.length > 0 ? (
        <Box
          sx={{
            mb: 2,
            maxHeight: 180,
            overflowY: "auto",
            border: "1px solid #E4EBD3",
            borderRadius: 2,
            p: 1.5,
            bgcolor: "#FAFBF7",
          }}
        >
          {thread.map((m: any, i: number) => (
            <Box key={i} sx={{ mb: 1.25 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#74941F" }}>
                {m.from === "admin" ? "Support" : "Member"}
                {m.authorName ? ` · ${m.authorName}` : ""}
                {m.createdAt
                  ? ` · ${moment(m.createdAt).format("MMM D, h:mm a")}`
                  : ""}
              </Typography>
              <Typography
                sx={{ fontSize: 13, whiteSpace: "pre-wrap", color: "#0A0A0A" }}
              >
                {m.body}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            bgcolor: "#F4F7EC",
            borderLeft: "4px solid #9FC53A",
            borderRadius: "0 8px 8px 0",
            fontSize: 13,
            whiteSpace: "pre-wrap",
          }}
        >
          {comments}
        </Box>
      )}

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
          "Sends a branded Eushbi Live email to the member with this reply."
        }
      />

      <FormControlLabel
        sx={{ mt: 1 }}
        control={
          <Checkbox
            checked={closeTicket}
            onChange={(e) => setCloseTicket(e.target.checked)}
            disabled={loading}
          />
        }
        label="Close ticket after sending"
      />

      <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
        <Button
          variant="contained"
          disabled={loading}
          onClick={onSend}
          sx={{ bgcolor: "#9FC53A", "&:hover": { bgcolor: "#8BB52F" } }}
        >
          {loading ? "Sending…" : "Send reply"}
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
