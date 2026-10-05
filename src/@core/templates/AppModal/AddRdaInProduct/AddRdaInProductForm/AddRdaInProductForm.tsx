import CircleLoader from "@core/basic-components/CircleLoader";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import CheckboxRedux from "@core/redux-fields/CheckboxRedux";
import { change, Field, reduxForm } from "redux-form";
import Button from "@core/basic-components/Button";
import { modalActions } from "redux/slices/modal";
import ToasterService from "utils/toaster.util";
import { Stack } from "@mui/material";
import { useState } from "react";


function AddRdaInProductForm() {
  let form = "AddProductForm";
  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState<[]>([]);
  const {RDAOptions,loading} = useAppSelector((state) => state.rda);

  const handleToggle = (rda: any) => {
    setSelectedItems((prevSelected: any) => {
      const isAlreadySelected = prevSelected.some((item: any) => item.value === rda.value);
      if (isAlreadySelected) {
        return prevSelected.filter((item: any) => item.value !== rda.value);
      } else {
        return [...prevSelected, rda];
      }
    });
  };
  
  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      ToasterService.showError("Please select atleast one RDA!");
      return;
    }
    dispatch(change(form, "rdaSection", selectedItems));
    dispatch(modalActions.closeModal())
  };

  return (
    <>
    {loading && <CircleLoader/>}
      {RDAOptions?.map((rda) => (
        <Field
          key={rda._id}
          name={rda.dataId.value}
          label={rda.dataId.label}
          component={CheckboxRedux}
          type="checkbox"
          onChange={() => handleToggle(rda)}
        />
      ))}
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          onClick={() => dispatch(modalActions.closeModal())}
        >
          Cancel
        </Button>
        <Button
          type="button"
          disableElevation
          variant="contained"
          onClick={handleSubmit}
        >
          Add
        </Button>
      </Stack>
    </>
  );
}
export default reduxForm({ form: "AddRdaInProductForm" })(AddRdaInProductForm);
