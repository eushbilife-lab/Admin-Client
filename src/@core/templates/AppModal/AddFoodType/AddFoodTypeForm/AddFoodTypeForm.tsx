import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import Button from "@core/basic-components/Button";
import { modalActions } from "redux/slices/modal";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { reduxForm } from "redux-form";
import { Box, Typography } from "@mui/material";
import { preferenceFields } from ".";

function AddFoodTypeForm({ handleSubmit }: any) {
  const dispatch = useAppDispatch();
  const type = useAppSelector((state) => state.modal.data?.type);
  const fields = preferenceFields(type);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Typography
        variant="body2"
        sx={{ color: "var(--text-secondary)", mb: 2, lineHeight: 1.5 }}
      >
        Add a clear name and a short description so members and staff know what
        this option means.
      </Typography>
      <ReduxFormFields fields={fields} />
      <Box display="flex" gap={1.5} mt={2.5}>
        <Button
          variant="outlined"
          onClick={() => dispatch(modalActions.closeModal())}
        >
          Cancel
        </Button>
        <Button type="submit" disableElevation variant="contained">
          Save
        </Button>
      </Box>
    </form>
  );
}

export default reduxForm({ form: "AddFoodTypeForm" })(AddFoodTypeForm);
