import { useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import PageShell from "@core/templates/PageShell";
import { contactActions } from "redux/slices/contact";
import Tabs from "@core/templates/Tabs";
import ContactsList from "./ContactsList";
import AddContact from "./AddContact/AddContact";
import { Box, Button, Collapse } from "@mui/material";

export default function AddContactUs() {
  const dispatch = useAppDispatch();
  const tab = useAppSelector((state) => state.contact?.tab ?? 0);
  const [showPhones, setShowPhones] = useState(false);

  return (
    <PageShell
      kicker="Support"
      title="Help & Support"
      subtitle="Tickets from the live app. Open a ticket → Reply → member gets a branded Eushbi Live email."
    >
      <Box sx={{ mb: 2 }}>
        <Button
          size="small"
          variant="text"
          onClick={() => setShowPhones((v) => !v)}
          sx={{ color: "#74941F", fontWeight: 600, textTransform: "none" }}
        >
          {showPhones
            ? "Hide support phone numbers"
            : "Edit support phone numbers"}
        </Button>
        <Collapse in={showPhones} unmountOnExit>
          <Box sx={{ mt: 1, mb: 2 }}>
            <AddContact />
          </Box>
        </Collapse>
      </Box>

      <Tabs
        value={tab}
        showRefresh
        onRefresh={() => {
          dispatch(contactActions.resetFilters(tab === 0 ? "open" : "close"));
        }}
        onChange={(next) => dispatch(contactActions.setTab(next))}
        tabs={[
          { label: "Open tickets", element: <ContactsList type="open" /> },
          { label: "Closed tickets", element: <ContactsList type="close" /> },
        ]}
      />
    </PageShell>
  );
}
