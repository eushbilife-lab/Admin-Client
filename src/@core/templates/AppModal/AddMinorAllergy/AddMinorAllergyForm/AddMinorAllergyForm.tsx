import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import Button from "@core/basic-components/Button";
import { modalActions } from "redux/slices/modal";
import { useAppDispatch } from "redux/hooks";
import { reduxForm } from "redux-form";
import { Box, Stack } from "@mui/material";
import { fields } from ".";
import { useTranslation } from "react-i18next";

function AddMinorAllergyForm({ handleSubmit }: any) {
  const dispatch = useAppDispatch();
  const {t}=useTranslation()
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <ReduxFormFields fields={fields(t)} />
        <br />
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={() => dispatch(modalActions.closeModal())}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disableElevation variant="contained">
            {t("save")}
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default reduxForm({ form: "AddMinorAllergyForm" })(AddMinorAllergyForm);
