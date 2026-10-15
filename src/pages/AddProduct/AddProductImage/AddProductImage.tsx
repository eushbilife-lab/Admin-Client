import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import Button from "@core/basic-components/Button";
import { reduxForm } from "redux-form";
import { field } from ".";
import { useTranslation } from "react-i18next";
import "../AddProduct.css";

function AddProductImage({ handleSubmit, submitting }: any) {
  const { t } = useTranslation();
  return (
    <div className="add-food" style={{ paddingBottom: "1.5rem", maxWidth: "100%" }}>
      <form onSubmit={handleSubmit}>
        <section className="add-food__section">
          <header className="add-food__section-head">
            <h2 className="add-food__section-title">
              <span className="add-food__section-step">+</span>
              Pack photos
            </h2>
            <p className="add-food__section-hint">
              Add clear front-of-pack shots. Click a published tile below to make it the default.
            </p>
          </header>
          <ReduxFormFields fields={field} />
        </section>
        <div className="add-food__actions" style={{ position: "static", marginTop: "1rem" }}>
          <Button variant="contained" type="submit" disabled={submitting}>
            {t("Upload photos")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default reduxForm({ form: "AddProductImage" })(AddProductImage);
