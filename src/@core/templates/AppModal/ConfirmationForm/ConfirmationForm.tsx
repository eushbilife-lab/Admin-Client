import { useEffect, useState } from "react";
import { modalActions } from "redux/slices/modal";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import SubscriptionService from "services/subscription.service";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ConfirmationForm() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.modal.data);
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    return () => {
      SubscriptionService.unsubscribe();
    };
  }, []);

  const onClickYes = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (typeof data?.confirmAction === "function") {
        await data.confirmAction();
      }
    } finally {
      setBusy(false);
      dispatch(modalActions.closeModal());
    }
  };

  return (
    <div>
      <h3>{data?.heading}</h3>
      <p>{data?.message}</p>
      <br />
      <div style={{ display: "flex", gap: "15px" }}>
        <Button variant="contained" disabled={busy} onClick={() => void onClickYes()}>
          {busy ? t("Please wait") || "Please wait…" : t("Yes")}
        </Button>
        <Button
          variant="outlined"
          disabled={busy}
          onClick={() => dispatch(modalActions.closeModal())}
        >
          {t("No")}
        </Button>
      </div>
    </div>
  );
}
