import {
  Box,
  Button,
  Grid,
  Typography
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { reduxForm, change } from "redux-form";
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

  const currentTypes = useAppSelector((state) => state.form[formName]?.values?.isPositive);

  const selectedTypes = useMemo(() => {
    return currentTypes?.map((item: { value: string }) => item?.value);
  }, [currentTypes]);

  useEffect(() => {
    if (!id) {
      dispatch(
        change(formName, "isPositive", [
          { label: "positive", value: "positive" },
        ])
      );
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!selectedTypes?.includes("positive")) {
      dispatch(scoreCalculationActions.setScoreCalculation({ positiveScores: [] }));
    }
    if (!selectedTypes?.includes("negative")) {
      dispatch(scoreCalculationActions.setScoreCalculation({ negativeScores: [] }));
    }
  }, [selectedTypes, dispatch]);

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <ReduxFormFields fields={ScoreFields(t)} />
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 3,
          }}
        >
          <Typography variant="h6">
            {t("Scores and Nutrient Conditions")}
          </Typography>
          <Button type="submit" variant="contained">
            {t("Submit")}
          </Button>
        </Box>

        {/* Dynamically render based on selection order */}
        {selectedTypes?.map((type:any) => {
          if (type === "positive") return <PositiveNutrientsTable key="positive" />;
          if (type === "negative") return <NegativeNutrientsTable key="negative" />;
          return null;
        })}
      </form>
    </Box>
  );
}

export default reduxForm({ form: formName })(AddScoreForm);
