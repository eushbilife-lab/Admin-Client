import ComboBoxRedux from "@core/redux-fields/ComboBoxRedux";
import processingLevelService from "services/processingLevel.service";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useEffect } from "react";
import Button from "@core/basic-components/Button";
import { MODAL, modalActions } from "redux/slices/modal";
import { Box } from "@mui/material";
import OptionService from "utils/option.util";

/** Processing level picker from admin catalog — `{ value: number, label }`. */
export default function SelectProcessingLevel(props: any) {
  const dispatch = useAppDispatch();
  const options = useAppSelector((state) => state.processingLevel.options);
  const list =
    Array.isArray(options) && options.length
      ? options
      : OptionService.getProcessingLevel();

  useEffect(() => {
    processingLevelService.getOptions(dispatch);
  }, [dispatch]);

  const openAdd = () => {
    dispatch(
      modalActions.openModal({
        type: MODAL.ADD_PROCESSING_LEVEL,
        data: {},
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
        + Add processing level
      </Button>
    </Box>
  );
}
