import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { useParams } from "react-router-dom";
import { scoreCalculationActions } from "redux/slices/scoreCalculation";
import type { PositiveConditions, PositiveScore } from "../types/scoreTypes";
import { positiveNutrients } from "../types/scoreTypes";
import { ScoreRow } from "./positiveScoreRow";

function PositiveNutrientsTable() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [positiveScores, setPositiveScores] = useState<PositiveScore[]>([]);
  const [loadingPositiveMore, setLoadingPositiveMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(11);
  const [localScores, setLocalScores] = useState<PositiveScore[]>([]);

  const currentTypes = useAppSelector(
    (state) => state.form.AddScoreForm?.values?.isPositive,
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
  );
  
  const { updatedPositiveScore } = useAppSelector(
    (state) => state.scoreCalculations.score ?? {},
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
  ) ?? {};
  
  const checkPositiveScores = useAppSelector(
    (state) => state?.scoreCalculations?.scoreCalculation ?? {},
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
  );

  const selectedTypes = useMemo(
    () => currentTypes?.map((item: { value: string }) => item.value) ?? [],
    [currentTypes]
  );

  // Initialize scores
  useEffect(() => {
    if (!selectedTypes?.includes("positive")) return;
    if (positiveScores.length > 0) return;
    setLoadingPositiveMore(true);
    setTimeout(() => {
      const initializedScores: PositiveScore[] = [];
      for (let i = 0; i <= 20; i++) {
        const conditions = positiveNutrients.reduce((acc:any, nutrient:any) => {
          acc[nutrient.key] = {
            operator: { value: "", required: false },
            min: { value: "", required: false },
            max: { value: "", required: false },
            sign: { value: "", required: false },
          };
          return acc;
        }, {} as Record<string, PositiveConditions>);

        initializedScores.push({ score: i, conditions });
      }

      const finalScores =
        id && updatedPositiveScore?.length
          ? initializedScores.map((score) => {
              const match = updatedPositiveScore.find(
                (item: PositiveScore) => item.score === score.score
              );
              return match ?? score;
            })
          : initializedScores;

      setPositiveScores(finalScores);
      setLocalScores(finalScores);
      setLoadingPositiveMore(false);
    }, 300);
  }, [selectedTypes, id, positiveScores.length, updatedPositiveScore]);


  useEffect(() => {
    if (checkPositiveScores?.positiveScores?.length > 0) {
      setPositiveScores(checkPositiveScores?.positiveScores);
      setLocalScores(checkPositiveScores?.positiveScores);
    }
  }, [checkPositiveScores]);

  const handleChange = useCallback(
    (
      scoreIndex: number,
      nutrientKey: string,
      field: keyof PositiveConditions,
      value: string
    ) => {
      setLocalScores((prevScores) => {
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
              required: false,
            },
          },
        };
        newScores[scoreIndex] = {
          ...score,
          conditions: updatedConditions,
        };
        return newScores;
      });
    },
    []
  );

  useEffect(
    () => {
      setPositiveScores(localScores);
      dispatch(
        scoreCalculationActions.setScoreCalculation({
          positiveScores: localScores,
        })
      );
    },
    [localScores, dispatch]  
  );

  const handleLoadMore = () => {
    setLoadingPositiveMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 10);
      setLoadingPositiveMore(false);
    }, 300);
  };


  return (
    <Box sx={{ overflowX: "auto", mt: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {t("Positive Nutrients")}
      </Typography>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              {t("Score")}
            </th>
            {positiveNutrients.map((nutrient:any) => (
              <th
                key={`nutrient-${nutrient.key}`}
                style={{ border: "1px solid #ccc", padding: "8px" }}
              >
                {t(nutrient.label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loadingPositiveMore && (
            <tr>
              <td
                colSpan={positiveNutrients.length + 1}
                style={{ textAlign: "center", padding: "16px" }}
              >
                <CircularProgress size={24} />
              </td>
            </tr>
          )}
          {localScores.slice(0, visibleCount).map((score) => (
            <ScoreRow
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
            disabled={loadingPositiveMore}
            onClick={handleLoadMore}
            sx={{
              minWidth: "120px",
              transition: "all 0.3s ease",
            }}
          >
            {loadingPositiveMore ? (
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

export default React.memo(PositiveNutrientsTable);
