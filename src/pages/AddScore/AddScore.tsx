import { transformScores } from "./AddScoreForm/Errors/errorHandling";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import CircleLoader from "@core/basic-components/CircleLoader";
import PageShell from "@core/templates/PageShell";
import GoBack from "@core/basic-components/GoBack";
import AddScoreForm from "./AddScoreForm";
import UpdateScoreForm from "./UpdateScoreForm";
import nutritionService from "services/nutrition.service";
import scoreCalculationService from "services/score.service";
import { nutritionActions } from "redux/slices/nutrition";
import {
  useNegativeNutrientOptions,
  usePositiveNutrientOptions,
} from "./AddScoreForm/types/scoreTypes";

export default function AddScore() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector((state) => state.scoreCalculations);
  const { nutritionsOptions } = useAppSelector((state) => state?.nutrition);
  const { positiveScores = [], negativeScores = [] } = useAppSelector(
    (state) => state?.scoreCalculations?.scoreCalculation || {}
  );

  const positiveNutrients = usePositiveNutrientOptions(
    positiveScores,
    nutritionsOptions
  );
  const negativeNutrients = useNegativeNutrientOptions(
    negativeScores,
    nutritionsOptions
  );

  useEffect(() => {
    nutritionService.getAll(dispatch);
    return () => {
      dispatch(nutritionActions.setNutrition(null));
    };
  }, [dispatch]);

  const handleSubmit = async (values: any) => {
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
    <PageShell
      title={`${id ? "Update" : "Add"} scoring`}
      actions={<GoBack path="/scores" title="Back to scores" />}
    >
      {loading && <CircleLoader />}
      <AddScoreForm onSubmit={handleSubmit} />
      {id ? <UpdateScoreForm id={id} /> : null}
    </PageShell>
  );
}
