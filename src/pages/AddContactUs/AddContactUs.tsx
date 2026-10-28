import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import PageShell from "@core/templates/PageShell";
import { contactActions } from "redux/slices/contact";
import Tabs from "@core/templates/Tabs";
import ContactsList from "./ContactsList";
import AddContact from "./AddContact/AddContact";
import { Box, Button, Collapse, Stack, Typography } from "@mui/material";
import ContactService from "services/contact.service";

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <Box
      sx={{
        flex: "1 1 140px",
        minWidth: 140,
        p: 2,
        borderRadius: 2,
        border: "1px solid #E4EBD3",
        background: "#FEFEFE",
      }}
    >
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
        {label}
      </Typography>
      <Typography
        sx={{ fontSize: 28, fontWeight: 800, color: accent || "#0A0A0A", lineHeight: 1.1 }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function AddContactUs() {
  const dispatch = useAppDispatch();
  const tab = useAppSelector((state) => state.contact?.tab ?? 0);
  const [showPhones, setShowPhones] = useState(false);
  const [stats, setStats] = useState({
    open: 0,
    in_progress: 0,
    close: 0,
    urgent: 0,
    high: 0,
    active: 0,
  });

  const loadStats = async () => {
    const data = await ContactService.getOverview();
    if (data?.stats) setStats(data.stats);
  };

  useEffect(() => {
    loadStats();
  }, [tab]);

  return (
    <PageShell
      kicker="Support desk"
      title="Help & Support"
      subtitle="Member tickets from the Eushbi Live app. Prioritize, reply by email, and close with a full thread history."
    >
      <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 2.5 }}>
        <StatCard label="Active" value={stats.active} accent="#9FC53A" />
        <StatCard label="Open" value={stats.open} />
        <StatCard label="In progress" value={stats.in_progress} accent="#EAB308" />
        <StatCard label="Urgent" value={stats.urgent} accent="#D32F2F" />
        <StatCard label="High" value={stats.high} accent="#F57C00" />
        <StatCard label="Closed" value={stats.close} />
      </Stack>

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
          loadStats();
        }}
        onChange={(next) => dispatch(contactActions.setTab(next))}
        tabs={[
          { label: "Open inbox", element: <ContactsList type="open" /> },
          { label: "Closed", element: <ContactsList type="close" /> },
        ]}
      />
    </PageShell>
  );
}
