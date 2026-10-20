import { Box, Button, Grid } from "@mui/material";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change, reduxForm } from "redux-form";
import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import { ScoreFields } from ".";
import PositiveNutrientsTable from "./PositiveTable/PositiveNutrientsTable";
import NegativeNutrientsTable from "./NegativeTable/NegativeNutrientsTable";
import { scoreCalculationActions } from "redux/slices/scoreCalculation";

const formName = "AddScoreForm";

function AddScoreForm({ handleSubmit }: any) {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const currentTypes = useAppSelector(
    (state) => state.form[formName]?.values?.isPositive
  );

  const selectedTypes = useMemo(() => {
    return currentTypes?.map((item: { value: string }) => item?.value) || [];
  }, [currentTypes]);

  useEffect(() => {
    if (!id) {
      dispatch(
        change(formName, "isPositive", [
          { label: "positive", value: "positive" },
          { label: "negative", value: "negative" },
        ])
      );
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && (!currentTypes || currentTypes.length === 0)) return;
    if (!selectedTypes.includes("positive")) {
      dispatch(
        scoreCalculationActions.setScoreCalculation({ positiveScores: [] })
      );
    }
    if (!selectedTypes.includes("negative")) {
      dispatch(
        scoreCalculationActions.setScoreCalculation({ negativeScores: [] })
      );
    }
  }, [selectedTypes, dispatch, id, currentTypes]);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <ReduxFormFields fields={ScoreFields(t)} />
      </Grid>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          mt: 3,
          mb: 2,
        }}
      >
        <Box>
          <Box sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
            Score tables
          </Box>
          <Box sx={{ color: "#667066", fontSize: "0.875rem" }}>
            Add nutrient columns, then fill points 0–20. Prefer Range operator.
          </Box>
        </Box>
        <Button type="submit" variant="contained" size="large">
          {id ? "Save changes" : "Create score"}
        </Button>
      </Box>

      {selectedTypes.includes("negative") ? (
        <NegativeNutrientsTable />
      ) : null}
      {selectedTypes.includes("positive") ? (
        <PositiveNutrientsTable />
      ) : null}
    </Box>
  );
}

export default reduxForm({ form: formName })(AddScoreForm);
