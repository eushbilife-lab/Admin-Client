import { IconButton, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SuperAdminBlock from "@core/api-components/SuperAdminBlock";
import { useAppDispatch } from "redux/hooks";
import { MODAL, modalActions } from "redux/slices/modal";
import "./ConfirmDeleteButton.css";

type Props = {
  title?: string;
  message?: string;
  tooltip?: string;
  disabled?: boolean;
  onConfirm: () => void | Promise<unknown>;
  /** Prefer text button in dense tables */
  variant?: "icon" | "text";
  label?: string;
};

export default function ConfirmDeleteButton({
  title = "Delete",
  message = "Are you sure you want to delete this item? This cannot be undone.",
  tooltip = "Delete",
  disabled,
  onConfirm,
  variant = "icon",
  label = "Delete",
}: Props) {
  const dispatch = useAppDispatch();

  const open = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    dispatch(
      modalActions.openModal({
        type: MODAL.CONFIRMATION_FORM,
        data: {
          heading: title,
          message,
          confirmAction: () => onConfirm(),
        },
        width: "500px",
      })
    );
  };

  return (
    <SuperAdminBlock>
      {variant === "text" ? (
        <button
          type="button"
          className="confirm-delete-text"
          disabled={disabled}
          onClick={open}
        >
          {label}
        </button>
      ) : (
        <Tooltip title={tooltip}>
          <span>
            <IconButton
              size="small"
              className="confirm-delete-icon"
              aria-label={tooltip}
              disabled={disabled}
              onClick={open}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}
    </SuperAdminBlock>
  );
}
