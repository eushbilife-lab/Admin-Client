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
      data?.forEach((item) => {
        const { nutritionID = [], scores = [] } = item;
        scores?.forEach((scoreItem: any) => {
          const score = scoreItem.score;
          if (!scoreMap[score]) {
            scoreMap[score] = {
              score,
              conditions: {}
            };
          }
          nutritionID?.forEach((nutrition: any) => {
            const key = nutrition.key;
            // Map the key to the correct negative nutrient group
            const negativeNutrientMap: Record<string, string> = {
              calories: "Cal",
              total_carbohydrate: "TCarbs",
              added_sugars: "AddSug",
              natural_sugar: "NatSug",
              sodium: "Sodium",
              fat: "Fat",
              saturated_fat: "SatFat",
              trans_fat: "Trans",
              processing_level: "Proc"
            };
            
            const mappedKey = negativeNutrientMap[key] || key;
            scoreMap[score].conditions[mappedKey] = {
              operator: { value: scoreItem?.operator ?? '', required: false },
              min: { value: scoreItem?.min ?? '', required: false },
              max: { value: scoreItem?.max ?? '', required: false },
              sign: { value: scoreItem?.sign ?? '', required: false },
            };
          });
        });
      });
      return Object.values(scoreMap);
    };
    
  
  
  
    const nutrientGroupMap: Record<string, string[]> = {
      fiber: ["fiber"],
      protein: ["protein"],
      VitDCA: ["vitamin_d", "vitamin_c", "vitamin_a"],
      MinFeCaK: ["iron", "calcium", "potassium"],
      Fort: ["folatefolic_acid", "niacin", "riboflavin", "thiamin"],
      UnsatFat: ["unsaturated_fat"],
      NutsFruitAndVeggies: ["nuts","fruit","veggies"],
    };
  
    const getNutrientGroupKey = (key: string): string | undefined => {
      return Object.keys(nutrientGroupMap).find((groupKey) =>
        nutrientGroupMap[groupKey].includes(key)
      );
    };
    
    const transformPositiveScores = (data: any[] = []) => {
      const scoreMap: Record<number, any> = {};
    
      data?.forEach((item) => {
        const { nutritionID = [], scores = [] } = item;
    
        scores?.forEach((scoreItem: any) => {
          const score = scoreItem.score;
    
          if (!scoreMap[score]) {
            scoreMap[score] = {
              score,
              conditions: {},
            };
          }
    
          nutritionID?.forEach((nutrition: any) => {
            const nutrientKey = nutrition.key;
            const groupKey = getNutrientGroupKey(nutrientKey);
            if (!groupKey) return; // skip if not in group map
    
            scoreMap[score].conditions[groupKey] = {
              operator: { value: scoreItem?.operator ?? '', required: false },
              min: { value: scoreItem?.min ?? '', required: false },
              max: { value: scoreItem?.max ?? '', required: false },
              sign: { value: scoreItem?.sign ?? '', required: false },
            };
          });
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
