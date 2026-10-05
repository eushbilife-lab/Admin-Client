import { useAppDispatch, useAppSelector } from "redux/hooks";
import rdaService from "services/rda.service";
import { rdaActions } from "redux/slices/rda";
import { change } from "redux-form";
import { useEffect } from "react";

export default function AddRdaFormUpdate() {
  const form = "AddRdaForm";
  const dispatch = useAppDispatch();
  const { rdas } = useAppSelector((state) => state.rda);

  useEffect(() => {
    rdaService.getAll(dispatch);
    return () => {
      dispatch(rdaActions.setRda(null));
    };
  }, [dispatch]);

  useEffect(() => {
    if (!rdas || rdas?.length === 0) return;
    dispatch(
      change(
        form,
        "rda",
        rdas.map((rda) => ({
          _id: rda?._id || "",
          nutrition_id: {
            value: rda?.nutrition_id?._id || "",
            label: rda?.nutrition_id?.name || "",
          },
          dailyValue: rda?.dailyValue || "",
          uom:{
                label: rda.uom.sign,
                value: rda.uom._id,
              }
        }))
      )
    );
  }, [rdas?.length, dispatch]);

  return null;
}
