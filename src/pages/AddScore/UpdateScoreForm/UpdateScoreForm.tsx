import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import scoreCalculationService from "services/score.service";
import { scoreCalculationActions } from "redux/slices/scoreCalculation";

function transformSide(data: any[] = []) {
  const scoreMap: Record<number, any> = {};

  data.forEach((item) => {
    const nutritionKeys =
      item.nutritionID
        ?.map((n: any) => n?.key || n?.value || n?._id || n)
        .filter(Boolean)
        .map(String) || [];
    if (!nutritionKeys.length) return;
    const groupKey = nutritionKeys.join(",");
    const scores = item.scores || [];

    scores.forEach((scoreItem: any) => {
      const score = Number(scoreItem.score);
      if (!Number.isFinite(score)) return;
      if (!scoreMap[score]) {
        scoreMap[score] = { score, conditions: {} };
      }
      if (!scoreMap[score].conditions[groupKey]) {
        scoreMap[score].conditions[groupKey] = {
          operator: { value: scoreItem?.operator ?? "-", required: false },
          min: {
            value:
              scoreItem?.min === 0 || scoreItem?.min
                ? String(scoreItem.min)
                : "",
            required: false,
          },
          max: {
            value:
              scoreItem?.max === 0 || scoreItem?.max
                ? String(scoreItem.max)
                : "",
            required: false,
          },
          sign: { value: scoreItem?.sign ?? "", required: false },
        };
      }
    });
  });

  return Object.values(scoreMap).sort(
    (a: any, b: any) => Number(a.score) - Number(b.score)
  );
}

export default function UpdateScoreForm({ id }: { id: string }) {
  const form = "AddScoreForm";
  const dispatch = useAppDispatch();
  const { score } = useAppSelector((state) => state?.scoreCalculations);

  useEffect(() => {
    if (id) scoreCalculationService.get(id, dispatch);
    return () => {
      dispatch(scoreCalculationActions.setScore({}));
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (!id || !score?.HNSSProductCategoryID) return;

    const {
      HNSSProductCategoryID,
      isPositive,
      positiveScores = [],
      negativeScores = [],
    } = score;

    const categoryLabel =
      HNSSProductCategoryID?.name ||
      HNSSProductCategoryID?.en?.name ||
      HNSSProductCategoryID?.label ||
      "";

    dispatch(
      change(form, "HNSSProductCategoryID", {
        label: categoryLabel,
        value: HNSSProductCategoryID?._id || HNSSProductCategoryID?.value,
      })
    );

    const types =
      isPositive?.map((item: any) => ({
        label: item?.label,
        value: item?.value,
      })) || [];
    dispatch(
      change(
        form,
        "isPositive",
        types.length
          ? types
          : [
              { label: "positive", value: "positive" },
              { label: "negative", value: "negative" },
            ]
      )
    );

    dispatch(
      scoreCalculationActions.setScore({
        ...score,
        updatedPositiveScore: transformSide(positiveScores),
        updatedNegativeScore: transformSide(negativeScores),
      })
    );
  }, [score?._id, dispatch, id]);

  return null;
}
