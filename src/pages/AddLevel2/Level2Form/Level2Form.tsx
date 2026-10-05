import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import Button from "@core/basic-components/Button";
import { useTranslation } from "react-i18next";
import { reduxForm } from "redux-form";
import { fields } from ".";

function Level2Form({ handleSubmit }: any) {
  const {t}=useTranslation()
  return (
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
  );
}
export default reduxForm({ form: "Level2Form" })(Level2Form);
