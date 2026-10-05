import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import { reduxForm } from "redux-form";
import { fields } from ".";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";
import MeasurementScaleService from "services/measurementScale.service";
function AddRdaForm({ handleSubmit }: any) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    MeasurementScaleService.getOptions({ type: "uom" }, dispatch);
  }, [dispatch]);
  return (
    <div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <ReduxFormFields fields={fields(t)} />
          <br />
        </form>
      </div>
    </div>
  );
}
export default reduxForm({ form: "AddRdaForm" })(AddRdaForm);
