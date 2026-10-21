import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import dynamicService from "services/dynamic.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";
import Button from "@core/basic-components/Button";
import { MODAL, modalActions } from "redux/slices/modal";
import { Box } from "@mui/material";

/** Manufacturer picker from Brands & makers — stores `{ value: id, label: name }`. */
export default function SelectManufacturer(props: any) {
  const dispatch = useAppDispatch();
  const options = useAppSelector(
    (state) => state.dynamic.manufacturer.dynamicOptions
  );
  const list = Array.isArray(options) ? options : [];
  const input = props.input;

  useEffect(() => {
    dynamicService.getOptions(
      { type: "manufacturer", status: "active" },
      dispatch
    );
  }, [dispatch]);

  useEffect(() => {
    const raw = input?.value;
    if (!raw || typeof raw !== "string" || !list.length) return;
    const match = list.find(
      (o: any) =>
        String(o.label || "").toLowerCase() === raw.toLowerCase() ||
        String(o.value) === raw
    );
    if (match) input.onChange(match);
  }, [list, input]);

  const openAdd = () => {
    dispatch(
      modalActions.openModal({
        type: MODAL.ADD_MANUFACTURER,
        data: { type: "manufacturer" },
        width: "520px",
      })
    );
  };

  return (
    <Box>
      <ComboBoxRedux {...props} options={list} />
      <Button
        type="button"
        variant="text"
        size="small"
        onClick={openAdd}
        sx={{ mt: 0.5, textTransform: "none", px: 0 }}
      >
        + Add manufacturer
      </Button>
    </Box>
  );
}
