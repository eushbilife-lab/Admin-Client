import ErrorBoundary from "@core/basic-components/ErrorBoundary";
import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import CloseIcon from "@mui/icons-material/Close";
import { modalActions } from "redux/slices/modal";
import { Box, Modal } from "@mui/material";
import { modalMapper } from ".";
import { Suspense } from "react";

function AppModal() {
	const dispatch = useAppDispatch();
	const type = useAppSelector((state) => state.modal.type);
	const open = useAppSelector((state) => state.modal.open);
	const width = useAppSelector((state) => state.modal.width);
	const loading = useAppSelector((state) => state.modal.loading);
	const closeBackdropClick = useAppSelector(
		(state) => state.modal.closeBackdropClick
	  );
	return (
		<Modal
			open={open}
			onClose={(_, reason) => {
				if (reason !== "backdropClick"||closeBackdropClick)
					dispatch(modalActions.closeModal());
			}}
			sx={{
				padding: "16px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Box
				className="app-modal-body"
				sx={{
					p: 4,
					width: "100%",
					border: "none",
					maxWidth: width,
					maxHeight: "90vh",
					overflowY: "auto",
					bgcolor: "background.paper",
					borderRadius: "16px",
				}}
			>
				<ErrorBoundary>
					<div style={{ minHeight: "123px", position: "relative" }}>
						
							<CloseIcon
							style={{
								position: "absolute",
								top: "-20px",
								right: "-26px",
								cursor: "pointer",
								color: "var(--color-forest)",
							}}
							onClick={() => dispatch(modalActions.closeModal())}
						/>
						{loading && <CircleLoader />}

						<Suspense fallback={<CircleLoader />}>
							{type && modalMapper[type]}
						</Suspense>
					</div>
				</ErrorBoundary>
			</Box>
		</Modal>
	);
}
export default AppModal;
