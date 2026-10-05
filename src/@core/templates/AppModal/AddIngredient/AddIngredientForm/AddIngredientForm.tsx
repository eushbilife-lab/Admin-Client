import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import CheckboxRedux from "@core/redux-fields/CheckboxRedux";
import InputRedux from "@core/redux-fields/InputRedux";
import Button from "@core/basic-components/Button";
import { modalActions } from "redux/slices/modal";
import { useAppDispatch } from "redux/hooks";
import { reduxForm } from "redux-form";
import { Stack } from "@mui/material";
import { required } from "utils/validate.util";
import type { ReduxFormField } from "@core/redux-fields/ReduxFormFields";

const fields: ReduxFormField[] = [
  {
    name: "status",
    label: "Is Active?",
    component: CheckboxRedux,
    cellProps: { md: 12 },
  },
  {
    name: "en.name",
    label: "Name",
    component: InputRedux,
    validate: [required],
    cellProps: { md: 12 },
  },
];

function AddIngredientForm({ handleSubmit }: any) {
  const dispatch = useAppDispatch();
  return (
    <form onSubmit={handleSubmit}>
      <ReduxFormFields fields={fields} />
      <br />
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={() => dispatch(modalActions.closeModal())}>
          Cancel
        </Button>
        <Button type="submit" disableElevation variant="contained">
          Save
        </Button>
      </Stack>
    </form>
  );
}

export default reduxForm({ form: "AddIngredientForm" })(AddIngredientForm);
