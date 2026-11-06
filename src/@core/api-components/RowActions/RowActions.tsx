import { Button, IconButton, Tooltip } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ConfirmDeleteButton from "@core/api-components/ConfirmDeleteButton";
import "./RowActions.css";

type Props = {
  onOpen?: () => void;
  onEdit?: () => void;
  openLabel?: string;
  editLabel?: string;
  deleteTitle?: string;
  deleteMessage?: string;
  onDelete?: () => void | Promise<unknown>;
  deleteDisabled?: boolean;
};

export default function RowActions({
  onOpen,
  onEdit,
  openLabel = "Open",
  editLabel = "Edit",
  deleteTitle = "Delete",
  deleteMessage,
  onDelete,
  deleteDisabled,
}: Props) {
  return (
    <div className="row-actions" onClick={(e) => e.stopPropagation()}>
      {onOpen ? (
        <Tooltip title={openLabel}>
          <Button
            size="small"
            variant="outlined"
            className="row-actions__btn"
            startIcon={<VisibilityOutlinedIcon fontSize="small" />}
            onClick={onOpen}
          >
            {openLabel}
          </Button>
        </Tooltip>
      ) : null}
      {onEdit ? (
        <Tooltip title={editLabel}>
          <IconButton
            size="small"
            className="row-actions__icon row-actions__icon--edit"
            aria-label={editLabel}
            onClick={onEdit}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : null}
      {onDelete ? (
        <ConfirmDeleteButton
          title={deleteTitle}
          message={deleteMessage}
          disabled={deleteDisabled}
          onConfirm={onDelete}
        />
      ) : null}
    </div>
  );
}
