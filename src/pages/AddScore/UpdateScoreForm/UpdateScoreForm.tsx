import { useAppDispatch, useAppSelector } from "redux/hooks";
import { change } from "redux-form";
import { useEffect } from "react";
import scoreCalculationService from "services/score.service";
import { scoreCalculationActions } from "redux/slices/scoreCalculation";

export default function UpdateScoreForm({ id }: any) {
  const form = "AddScoreForm";
  const dispatch = useAppDispatch();
  const { score } = useAppSelector((state) => state?.scoreCalculations);

  useEffect(() => {
      if (id) {
         scoreCalculationService.get(id, dispatch);
      }
    return () => {
      dispatch(scoreCalculationActions.setScoreCalculation(null));
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
    // Populate the category dropdown
    dispatch(
      change(form, "HNSSProductCategoryID", {
        label: HNSSProductCategoryID?.en?.name,
        value: HNSSProductCategoryID?._id,
      })
    );
    // Populate the isPositive field
    dispatch(
      change(
        form,
        "isPositive",
        isPositive?.map((item: any) => ({
          label: item?.label,
          value: item?.value,
        })) || []
      )
    );

    const transformNegativeScores = (data: any[] = []) => {
      const scoreMap: Record<number, any> = {};
      const nutritionGroups: Record<string, string[]> = {};
      data?.forEach(item => {
        const nutritionIDs = item.nutritionID?.map((n: any) => n.key) || [];
        if (nutritionIDs.length > 1) {
          const groupKey = nutritionIDs.join(',');
          nutritionIDs.forEach((nutritionKey:any) => {
            nutritionGroups[nutritionKey] = nutritionIDs;
          });
        } else if (nutritionIDs.length === 1) {
          const nutritionKey = nutritionIDs[0];
          nutritionGroups[nutritionKey] = [nutritionKey];
        }
      });
      data?.forEach((item) => {
        const { nutritionID = [], scores = [] } = item;
        const nutritionKeys = nutritionID?.map((n: any) => n.key) || [];
        scores?.forEach((scoreItem: any) => {
          const score = scoreItem.score;
          if (!scoreMap[score]) {
            scoreMap[score] = {
              score,
              conditions: {},
            };
          }
          const groupKey = nutritionKeys.join(',');
          if (!scoreMap[score].conditions[groupKey]) {
            scoreMap[score].conditions[groupKey] = {
              operator: { value: scoreItem?.operator ?? '', required: false },
              min: { value: scoreItem?.min ?? '', required: false },
              max: { value: scoreItem?.max ?? '', required: false },
              sign: { value: scoreItem?.sign ?? '', required: false },
            };
          }
        });
      });
      return Object.values(scoreMap);
    };
    
    const transformPositiveScores = (data: any[] = []) => {
      const scoreMap: Record<number, any> = {};
      const nutritionGroups: Record<string, string[]> = {};
      data?.forEach(item => {
        const nutritionIDs = item.nutritionID?.map((n: any) => n.key) || [];
        if (nutritionIDs.length > 1) {
          const groupKey = nutritionIDs.join(',');
          nutritionIDs.forEach((nutritionKey:any) => {
            nutritionGroups[nutritionKey] = nutritionIDs;
          });
        } else if (nutritionIDs.length === 1) {
          const nutritionKey = nutritionIDs[0];
          nutritionGroups[nutritionKey] = [nutritionKey];
        }
      });
      data?.forEach((item) => {
        const { nutritionID = [], scores = [] } = item;
        const nutritionKeys = nutritionID?.map((n: any) => n.key) || [];
        scores?.forEach((scoreItem: any) => {
          const score = scoreItem.score;
          if (!scoreMap[score]) {
            scoreMap[score] = {
              score,
              conditions: {},
            };
          }
          const groupKey = nutritionKeys.join(',');
          if (!scoreMap[score].conditions[groupKey]) {
            scoreMap[score].conditions[groupKey] = {
              operator: { value: scoreItem?.operator ?? '', required: false },
              min: { value: scoreItem?.min ?? '', required: false },
              max: { value: scoreItem?.max ?? '', required: false },
              sign: { value: scoreItem?.sign ?? '', required: false },
            };
          }
        });
      });
      return Object.values(scoreMap);
    };
    dispatch(
      scoreCalculationActions.setScore({
        updatedPositiveScore: transformPositiveScores(positiveScores),
        updatedNegativeScore: transformNegativeScores(negativeScores),
      })
    );
  }, [score, dispatch, id]);

  if (!score) return null;

  return null;
}
