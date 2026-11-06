import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import Button from "@core/basic-components/Button";
import { reduxForm } from "redux-form";
import { fields } from ".";
import { useTranslation } from "react-i18next";

function AddUserForm({ handleSubmit, submitting }: any) {
  const { t } = useTranslation();
  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <ReduxFormFields fields={fields(t)} />
        <div className="form-actions">
          <Button
            variant="contained"
            type="submit"
            disabled={submitting}
            sx={{ fontSize: "15px" }}
          >
            {t("Save changes") || "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
export default reduxForm({ form: "AddUserForm", enableReinitialize: false })(
  AddUserForm
);
