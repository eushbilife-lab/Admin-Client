import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useParams } from "react-router-dom";
import { scoreCalculationActions } from "redux/slices/scoreCalculation";
import type { NegativeConditions, NegativeScore } from "../types/scoreTypes";
import { negativeNutrients } from "../types/scoreTypes";
import { NegativeScoreRow } from "./NegativeScoreRow";

function NegativeNutrientsTable() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [negativeScores, setNegativeScores] = useState<NegativeScore[]>([]);
  const [loadingNegativeMore, setLoadingNegativeMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(11);
  const [localScores, setLocalScores] = useState<NegativeScore[]>([]);

  const currentTypes = useAppSelector((state) => state.form.AddScoreForm?.values?.isPositive);

  const { updatedNegativeScore } = useAppSelector(
    (state) => state.scoreCalculations.score ?? {},
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
  ) ?? {};
  
  const checkNegativeScores = useAppSelector(
    (state) => state?.scoreCalculations?.scoreCalculation ?? {},
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
  );

  const selectedTypes = useMemo(
    () => currentTypes?.map((item: { value: string }) => item.value) ?? [],
    [currentTypes]
  );

  // Initialize scores
  useEffect(() => {
    if (!selectedTypes?.includes("negative")) return;
    if (negativeScores.length > 0) return;
    setLoadingNegativeMore(true);
    setTimeout(() => {
      const initializedScores: NegativeScore[] = [];
      for (let i = 0; i <= 20; i++) {
        const conditions = negativeNutrients.reduce((acc:any, nutrient:any) => {
          acc[nutrient.key] = {
            operator: { value: "", required: false },
            min: { value: "", required: false },
            max: { value: "", required: false },
            sign: { value: "", required: false },
          };
          return acc;
        }, {} as Record<string, NegativeConditions>);

        initializedScores.push({ score: i, conditions });
      }
      
      const finalScores = id && updatedNegativeScore?.length
        ? initializedScores.map(score => {
            const match = updatedNegativeScore.find((item: NegativeScore) => item.score === score.score);
            return match ?? score;
          })
        : initializedScores;

      setNegativeScores(finalScores);
      setLocalScores(finalScores);
      setLoadingNegativeMore(false);
    }, 300);
  }, [selectedTypes, id, updatedNegativeScore,negativeScores.length]);

  useEffect(() => {
    if(checkNegativeScores?.negativeScores?.length > 0){
      setLocalScores(checkNegativeScores?.negativeScores)
    }
  }, [checkNegativeScores])

  const handleChange = useCallback((scoreIndex: number, nutrientKey: string, field: keyof NegativeConditions, value: string) => {
    setLocalScores(prevScores => {
      const newScores = [...prevScores];
      const score = newScores[scoreIndex];
      if (!score) return prevScores;
      const updatedConditions = {
        ...score.conditions,
        [nutrientKey]: {
          ...score.conditions[nutrientKey],
          [field]: {
            ...score.conditions[nutrientKey][field],
            value: value,
            required: false
          }
        }
      };
      newScores[scoreIndex] = {
        ...score,
        conditions: updatedConditions
      };
      return newScores;
    });
  }, []);

  useEffect(() => {
    setNegativeScores(localScores);
    dispatch(scoreCalculationActions.setScoreCalculation({ negativeScores: localScores }));
  }, [localScores, dispatch]);

  const handleLoadMore = () => {
    setLoadingNegativeMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 10);
      setLoadingNegativeMore(false);
    }, 300);
  };


  return (
    <Box sx={{ overflowX: "auto", mt: 3, mb: 5 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {t("Negative Nutrients")}
      </Typography>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>{t("Score")}</th>
            {negativeNutrients.map((nutrient:any) => (
              <th key={`nutrient-${nutrient.key}`} style={{ border: "1px solid #ccc", padding: "8px" }}>
                {t(nutrient.label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loadingNegativeMore && (
            <tr>
              <td colSpan={negativeNutrients.length + 1} style={{ textAlign: "center", padding: "16px" }}>
                <CircularProgress size={24} />
              </td>
            </tr>
          )}
     {localScores?.slice(0, visibleCount)?.map((score) => (
            <NegativeScoreRow
              key={`score-${score.score}`}
              score={score}
              scoreIndex={score.score}
              onChange={handleChange}
            />
          ))}
        </tbody>
      </table>

   {localScores?.length > visibleCount && (
        <Box mt={2}>
          <Button
            variant="contained"
            disabled={loadingNegativeMore}
            onClick={handleLoadMore}
            sx={{
              minWidth: "120px",
              transition: "all 0.3s ease",
            }}
          >
            {loadingNegativeMore ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                {t("Loading...")}
              </Box>
            ) : (
              t("Load More")
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default React.memo(NegativeNutrientsTable);
