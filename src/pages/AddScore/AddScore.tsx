import {
  transformScores,
  validateScoreGrid,
} from "./AddScoreForm/Errors/errorHandling";
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
import { scoreCalculationActions } from "redux/slices/scoreCalculation";
import {
  useNegativeNutrientOptions,
  usePositiveNutrientOptions,
} from "./AddScoreForm/types/scoreTypes";
import ToasterService from "utils/toaster.util";

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
      dispatch(scoreCalculationActions.setScoreCalculation(null));
      dispatch(scoreCalculationActions.setScore({}));
    };
  }, [dispatch]);

  const handleSubmit = async (values: any) => {
    const types = (values?.isPositive || []).map((t: any) => t.value);
    const wantsPositive = types.includes("positive");
    const wantsNegative = types.includes("negative");

    if (!values?.HNSSProductCategoryID?.value) {
      ToasterService.showError("Select an ENLI / HNSS category");
      return;
    }
    if (!wantsPositive && !wantsNegative) {
      ToasterService.showError("Select at least one nutrition type");
      return;
    }

    const posCheck = wantsPositive
      ? validateScoreGrid(positiveScores, "positive")
      : { ok: true, scores: [] as any[] };
    const negCheck = wantsNegative
      ? validateScoreGrid(negativeScores, "negative")
      : { ok: true, scores: [] as any[] };

    if (!posCheck.ok || !negCheck.ok) {
      if (posCheck.scores) {
        dispatch(
          scoreCalculationActions.setScoreCalculation({
            positiveScores: posCheck.scores,
          })
        );
      }
      if (negCheck.scores) {
        dispatch(
          scoreCalculationActions.setScoreCalculation({
            negativeScores: negCheck.scores,
          })
        );
      }
      ToasterService.showError(
        posCheck.message || negCheck.message || "Fix highlighted fields"
      );
      return;
    }

    const transformedPositive = wantsPositive
      ? transformScores(positiveScores, positiveNutrients)
      : [];
    const transformedNegative = wantsNegative
      ? transformScores(negativeScores, negativeNutrients)
      : [];

    if (wantsPositive && !transformedPositive.length) {
      ToasterService.showError("Add at least one filled positive score cell");
      return;
    }
    if (wantsNegative && !transformedNegative.length) {
      ToasterService.showError("Add at least one filled negative score cell");
      return;
    }

    const finalPayload = {
      HNSSProductCategoryID: values.HNSSProductCategoryID.value,
      isPositive: values.isPositive,
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
      kicker="Science"
      title={id ? "Edit health score" : "Add health score"}
      subtitle="ENLI category rules — exclusive min–max bands for points 0–20."
      actions={<GoBack path="/scores" title="Back to scores" />}
    >
      {loading ? <CircleLoader /> : null}
      <AddScoreForm onSubmit={handleSubmit} />
      {id ? <UpdateScoreForm id={id} /> : null}
    </PageShell>
  );
}
