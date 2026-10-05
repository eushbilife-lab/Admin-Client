import {
  errorHandling,
  transformScores,
} from "./AddScoreForm/Errors/errorHandling";
import { useEffect } from "react";
import { Container } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { change } from "redux-form";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import CircleLoader from "@core/basic-components/CircleLoader";
import Banner from "@core/templates/Banner";
import GoBack from "@core/basic-components/GoBack";
import AddScoreForm from "./AddScoreForm";
import UpdateScoreForm from "./UpdateScoreForm";
import nutritionService from "services/nutrition.service";
import scoreCalculationService from "services/score.service";
import { nutritionActions } from "redux/slices/nutrition";
import { scoreCalculationActions } from "redux/slices/scoreCalculation";
import { useNegativeNutrientOptions, usePositiveNutrientOptions } from "./AddScoreForm/types/scoreTypes";

export default function AddScore() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector((state) => state.scoreCalculations);
  const { nutritionsOptions } = useAppSelector((state) => state?.nutrition);
  const { positiveScores = [], negativeScores = [] } = useAppSelector(
    (state) => state?.scoreCalculations?.scoreCalculation || {}
  );

  const positiveNutrients = usePositiveNutrientOptions(nutritionsOptions);
  const negativeNutrients = useNegativeNutrientOptions(nutritionsOptions);

  useEffect(() => {
    nutritionService.getAll(dispatch);
    return () => {
      dispatch(nutritionActions.setNutrition(null));
    };
  }, [dispatch]);

  const handleSubmit = async (values: any) => {
    dispatch(change("AddScoreForm", "errors", {}));
    const errorResult = errorHandling(positiveScores, negativeScores);
    if (!errorResult) return;
    const { plusData, negData } = errorResult;

    const hasPlusErrors =
      plusData?.some((scoreItem: any) =>
        Object.values(scoreItem.conditions || {}).some((nutrient: any) =>
          Object.values(nutrient).some((field: any) => field?.required === true)
        )
      ) ?? false;

    const hasNegErrors =
      negData?.some((scoreItem: any) =>
        Object.values(scoreItem.conditions || {}).some((nutrient: any) =>
          Object.values(nutrient).some((field: any) => field?.required === true)
        )
      ) ?? false;

    if (hasPlusErrors || hasNegErrors) {
      dispatch(
        scoreCalculationActions.setScoreCalculation({
          positiveScores: plusData,
          negativeScores: negData,
        })
      );
      return;
    }

    const baseData = {
      ...values,
      HNSSProductCategoryID: values?.HNSSProductCategoryID?.value,
    };

    const transformedPositive = transformScores(
      positiveScores,
      positiveNutrients
    );
    const transformedNegative = transformScores(
      negativeScores,
      negativeNutrients
    );

    const finalPayload = {
      ...baseData,
      positiveScores: transformedPositive,
      negativeScores: transformedNegative,
    };

    if (id) {
      await scoreCalculationService.update(
        id,
        finalPayload,
        navigate,
        dispatch
      );
    } else {
      await scoreCalculationService.create(finalPayload, navigate, dispatch);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <Container maxWidth="xl">
        {loading && <CircleLoader />}
        <GoBack path="/scores" title="Back to Scores" />
        <div className="banner-heading">
          <Banner heading={`${id ? "Update" : "Add"} Scoring`} />
        </div>
        <AddScoreForm onSubmit={handleSubmit} />
        {id ? <UpdateScoreForm id={id} /> : null}
      </Container>
    </div>
  );
}
