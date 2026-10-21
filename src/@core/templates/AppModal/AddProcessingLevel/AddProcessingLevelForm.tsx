import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import Button from "@core/basic-components/Button";
import { modalActions } from "redux/slices/modal";
import { useAppDispatch } from "redux/hooks";
import { reduxForm } from "redux-form";
import { Stack } from "@mui/material";
import type { ReduxFormField } from "@core/redux-fields/ReduxFormFields/index";
import CheckboxRedux from "@core/redux-fields/CheckboxRedux";
import InputRedux from "@core/redux-fields/InputRedux";
import { required } from "utils/validate.util";
import { digitOrFloat } from "utils/normalize.util";

const fields: ReduxFormField[] = [
  {
    name: "status",
    label: "Is Active?",
    component: CheckboxRedux,
    cellProps: { md: 12 },
  },
  {
    name: "name",
    label: "Name",
    component: InputRedux,
    validate: [required],
    cellProps: { md: 12 },
    InputProps: {
      helperText: "Shown on Add Food, e.g. Ultra - Processed Product",
    },
  },
  {
    name: "levelValue",
    label: "Level value",
    component: InputRedux,
    validate: [required],
    normalize: digitOrFloat,
    cellProps: { md: 12 },
    InputProps: {
      helperText: "Numeric code used in scoring (typically 1–4 for NOVA).",
    },
  },
  {
    name: "description",
    label: "Description",
    component: InputRedux,
    cellProps: { md: 12 },
  },
];

function AddProcessingLevelForm({ handleSubmit }: any) {
  const dispatch = useAppDispatch();
  return (
    <form onSubmit={handleSubmit}>
      <ReduxFormFields fields={fields} />
      <br />
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          onClick={() => dispatch(modalActions.closeModal())}
        >
          Cancel
        </Button>
        <Button type="submit" disableElevation variant="contained">
          Save
        </Button>
      </Stack>
    </form>
  );
}

export default reduxForm({ form: "AddProcessingLevelForm" })(
  AddProcessingLevelForm
);
