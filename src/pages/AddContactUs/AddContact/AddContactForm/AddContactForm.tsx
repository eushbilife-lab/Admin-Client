import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import { reduxForm } from "redux-form";
import { fields } from ".";
import { useTranslation } from "react-i18next";

function AddContactForm({ handleSubmit }: any) {
  const { t } = useTranslation();
  return (
    <div>
      <form onSubmit={handleSubmit}>
         <ReduxFormFields fields={fields(t)} />
      </form>
    </div>
  );
}
export default reduxForm({ form: "AddContactForm" })(AddContactForm);
