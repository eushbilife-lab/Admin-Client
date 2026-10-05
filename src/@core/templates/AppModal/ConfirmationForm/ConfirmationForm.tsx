import { useEffect } from "react";
import { modalActions } from "redux/slices/modal";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import SubscriptionService from "services/subscription.service";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ConfirmationForm() {
	const dispatch = useAppDispatch();
	const data = useAppSelector((state) => state.modal.data);
    const {t}=useTranslation()
	useEffect(() => {
		return () => {
			SubscriptionService.unsubscribe();
		};
	}, []);

  const onClickYes = () => {
    if (data.confirmAction) {
      console.log("Executing confirmAction...");
      data.confirmAction();
    } else {
      console.warn("No confirmAction found!");
    }
  };
  
	return (
		<div>
			<h3>{data.heading}</h3>
			<p>{data.message}</p>
			<br/>
			<div style={{display:"flex",gap:"15px"}}>
			<Button variant="contained" onClick={onClickYes}>
				{t("Yes")}
			</Button>
			<Button
				variant="outlined"
				onClick={() => dispatch(modalActions.closeModal())}
			>
				{t("No")}
			</Button>
			</div>
		</div>
	);
}
