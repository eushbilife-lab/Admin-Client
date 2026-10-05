import Button from "@core/basic-components/Button";
import { modalActions } from "redux/slices/modal";

import { useAppDispatch, useAppSelector } from "redux/hooks";

export default function DisableModal() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.modal.data);
  const onClickYes = async () =>console.log("s")


  return (
    <div>
      <h3>
        {data.currentStatus === "active" ? "Inactivate" : "Activate"} Driver
      </h3>
      <p>
        Do you really want to{" "}
        {data.currentStatus === "active" ? "Inactivate" : "Activate"} this
        Driver?
      </p>
      <Button
        variant="outlined"
        sx={{ marginRight: "10px" }}
        onClick={() => dispatch(modalActions.closeModal())}
      >
        No
      </Button>
      <Button variant="contained" onClick={onClickYes}>
        Yes
      </Button>
    </div>
  );
}
