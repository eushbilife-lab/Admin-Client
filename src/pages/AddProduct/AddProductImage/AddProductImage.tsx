import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import Button from "@core/basic-components/Button";
import { reduxForm } from "redux-form";
import { field } from ".";
import { useTranslation } from "react-i18next";

function AddProductImage({ handleSubmit }: any) {
  const { t } = useTranslation();
  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <ReduxFormFields fields={field} />
        <br />
        <Button variant="contained" type="submit" sx={{ fontSize: "18px" }}>
          {t("Submit")}
        </Button>
      </form>
    </div>
  );
}

export default reduxForm({ form: "AddProductImage" })(AddProductImage);
