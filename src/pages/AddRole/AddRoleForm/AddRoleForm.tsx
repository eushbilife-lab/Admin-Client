import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import Button from "@core/basic-components/Button";
import { reduxForm } from "redux-form";
import { fields } from ".";
import { useTranslation } from "react-i18next";

function AddRoleForm({ handleSubmit }: any) {
  const {t}=useTranslation()
  return (
    <div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <ReduxFormFields fields={fields(t)} />
          <div className="form-actions">
          <Button
            variant="contained"
            type="submit"
            sx={{ fontSize: "14px" }}
          >
            {t("Submit")}
          </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default reduxForm({ form: "AddRoleForm" })(AddRoleForm);
