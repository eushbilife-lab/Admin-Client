import { useState } from "react";
import { Button, Text, TextField } from "@mui/material";
import { modalActions } from "redux/slices/modal";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import ContactService from "services/contact.service";

export default function ReplySupport() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.modal.data);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const ticket = data?.ticket || {};
  const reason = ticket.reason || "—";
  const comments = ticket.comments || ticket.message || "—";
  const name = ticket.fullName || ticket.name || "—";
  const email = ticket.email || "—";
  const ticketNo = ticket.ticket_number ? `#${ticket.ticket_number}` : "";

  const onSend = async () => {
    const text = response.trim();
    if (text.length < 2) {
      setError("Please write a short reply (min 2 characters).");
      return;
    }
    setError("");
    await ContactService.replyToTicket(data?.type || "open", ticket._id, text);
  };

  return (
    <Box>
      <h3 style={{ marginTop: 0 }}>Reply to Help &amp; Support {ticketNo}</h3>
      <p style={{ margin: "0 0 8px", color: "#515151", fontSize: 14 }}>
        <strong>{name}</strong> · {email}
      </p>
      <p style={{ margin: "0 0 4px", fontSize: 13 }}>
        <strong>Reason:</strong> {reason}
      </p>
      <p
        style={{
          margin: "0 0 16px",
          fontSize: 13,
          whiteSpace: "pre-wrap",
          background: "#F5F9EB",
          padding: 12,
          borderRadius: 8,
        }}
      >
        {comments}
      </p>
      <TextField
        label="Your reply (sent to user email)"
        multiline
        minRows={4}
        fullWidth
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        error={Boolean(error)}
        helperText={error || "User receives this in an Eushbi Live email."}
      />
      <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
        <Button variant="contained" onClick={onSend}>
          Send reply &amp; close
        </Button>
        <Button
          variant="outlined"
          onClick={() => dispatch(modalActions.closeModal())}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
