import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { Field, reduxForm } from "redux-form";
import Button from "@core/basic-components/Button";
import { modalActions } from "redux/slices/modal";
import { Stack } from "@mui/material";
import InputRedux from "@core/redux-fields/InputRedux";
import nutritionService from "services/nutrition.service";

function AddNutritionForm() {
  const dispatch = useAppDispatch();
  const { nutritions, loading } = useAppSelector((state) => state.nutrition);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const name = event.target.nutrient.value;
    const nutrient = { name };
    const data = { nutritions: [...nutritions, nutrient] };
    await nutritionService.update(data, dispatch);
    dispatch(modalActions.closeModal());
  };

  return (
    <>
      {loading && <CircleLoader />}
      <form onSubmit={handleSubmit}>
        <br />
        <Field
          name={"nutrient"}
          label={"nutrient"}
          component={InputRedux}
          type="text"
        />
        <br />
        <br />
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => dispatch(modalActions.closeModal())}
          >
            Cancel
          </Button>
          <Button type="submit" disableElevation variant="contained">
            Add
          </Button>
        </Stack>
      </form>
    </>
  );
}

export default reduxForm({ form: "AddNutritionForm" })(AddNutritionForm);
