import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { change } from "redux-form";
import { Box, Typography, Button, Stack, IconButton } from "@mui/material";
import CircleLoader from "@core/basic-components/CircleLoader";
import CloseIcon from "@mui/icons-material/Close";
import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import { NutrientFields } from "..";
import { scoreCalculationActions } from "redux/slices/scoreCalculation";
import { ScoreRow } from "./positiveScoreRow";
import {
  NutrientGroup,
  PositiveConditions,
  PositiveScore,
} from "../types/scoreTypes";
import { shallowEqual } from "react-redux";

function PositiveNutrientsTable() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const [nutrientGroups, setNutrientGroups] = useState<NutrientGroup[]>([]);
  const [positiveScores, setPositiveScores] = useState<PositiveScore[]>([]);
  const [loadingPositiveMore, setLoadingPositiveMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(11);
  const [localScores, setLocalScores] = useState<PositiveScore[]>([]);
  const [scoreInitializing, setScoreInitializing] = useState(true);
  
  console.log("🚀 ~ PositiveNutrientsTable ~ localScores:", localScores)
  console.log("🚀 ~ PositiveNutrientsTable ~ nutrientGroups:", nutrientGroups)
  const Nutrient = useAppSelector(
    (state) => state.form.AddScoreForm?.values?.NutrientID || [],
    shallowEqual
  );

  const currentTypes = useAppSelector(
    (state) => state.form.AddScoreForm?.values?.isPositive || [],
    shallowEqual
  );

  const updatedPositiveScore = useAppSelector(
    (state) => state.scoreCalculations.score?.updatedPositiveScore || [],
    shallowEqual
  );

  const selectedTypes = useMemo(
    () => currentTypes?.map((item: { value: string }) => item.value) ?? [],
    [currentTypes]
  );

  if(id && updatedPositiveScore?.length > 0){
  useEffect(() => {
    console.log("sheraz")
      const firstScore = updatedPositiveScore[0];
      if (firstScore?.conditions) {
        const groups: NutrientGroup[] = Object.keys(firstScore.conditions).map(
          (key) => ({
            id: key,
            nutrients: key.split(",").map((k) => ({ key: k, label: k })),
          })
        );
        setNutrientGroups(groups);
      }
  }, [id, updatedPositiveScore]);
  }

  useEffect(() => {
    if (!selectedTypes.includes("positive") || nutrientGroups.length === 0) return;
    if (positiveScores.length > 0) return;
   console.log("abbas")
    setLoadingPositiveMore(true);
    setScoreInitializing(true);
    const groupKeys = nutrientGroups?.map((group) =>
      group.nutrients.map((n) => n.key).join(",")
    );
    const initializedScores = Array.from({ length: 21 }, (_, i) => ({
      score: i,
      conditions: groupKeys.reduce<Record<string, PositiveConditions>>(
        (acc, groupKey) => {
          acc[groupKey] = {
            operator: { value: "", required: false },
            min: { value: "", required: false },
            max: { value: "", required: false },
            sign: { value: "", required: false },
          };
          return acc;
        },
        {}
      ),
    }));
    const finalScores =
      id && updatedPositiveScore?.length > 0
        ? initializedScores.map((score) => {
            const match = updatedPositiveScore.find(
              (item: any) => item.score === score.score
            );
            if (!match) return score;

            const mergedConditions = { ...score.conditions };
            for (const groupKey in match.conditions) {
              if (mergedConditions[groupKey]) {
                mergedConditions[groupKey] = {
                  ...mergedConditions[groupKey],
                  ...match.conditions[groupKey],
                };
              }
            }
            return { ...score, conditions: mergedConditions };
          })
        : initializedScores;

    setPositiveScores(finalScores);
    setLocalScores(finalScores);

    setLoadingPositiveMore(false);
    setScoreInitializing(false);
  }, [
    selectedTypes,
    id,
    nutrientGroups,
    positiveScores.length,
    updatedPositiveScore,
  ]);

  useEffect(() => {
    dispatch(
      scoreCalculationActions.setScoreCalculation({
        positiveScores: localScores,
      })
    );
  }, [localScores, dispatch, positiveScores]);

  const handleAddGroup = useCallback(() => {
    if (Nutrient.length === 0) return;

    const groupKey = Nutrient.map((n: any) => n.key).join(",");

    // Check if group already exists
    const groupExists = nutrientGroups.some((group) => group.id === groupKey);
    if (groupExists) {
      // Optionally show an error message or just return
      return;
    }

    const newGroup: NutrientGroup = {
      id: groupKey,
      nutrients: [...Nutrient],
    };

    setNutrientGroups((prev) => [...prev, newGroup]);
    setLocalScores((prev) =>
      prev.map((score) => ({
        ...score,
        conditions: {
          ...score.conditions,
          [groupKey]: {
            operator: { value: "", required: false },
            min: { value: "", required: false },
            max: { value: "", required: false },
            sign: { value: "", required: false },
          },
        },
      }))
    );
    dispatch(change("AddScoreForm", "NutrientID", []));
  }, [Nutrient, dispatch, nutrientGroups]);

  const handleDeleteGroup = useCallback((groupId: string) => {
    console.log("1")
    setNutrientGroups((prev) => prev.filter((group) => group.id !== groupId));
    setLocalScores((prev) =>
      prev.map((score) => {
        const { [groupId]: _, ...remainingConditions } = score.conditions;
        return { ...score, conditions: remainingConditions };
      })
    );
  }, []);




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

  const handleLoadMore = useCallback(() => {
    setLoadingPositiveMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 10);
      setLoadingPositiveMore(false);
    }, 300);
  }, []);

  return (
    <>
      {!id && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ width: "48.5%" }}>
            <ReduxFormFields fields={NutrientFields()} />
          </Box>
          <Button
            variant="contained"
            onClick={handleAddGroup}
            disabled={Nutrient.length === 0}
            sx={{padding:"10px 25px"}}
          >
            {t("Add")}
          </Button>
        </Box>
      )}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {t("Positive Nutrients")}
        </Typography>

        {nutrientGroups.length > 0 && (
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
              position: "relative", // Add this for positioning the loader
              minHeight: "200px", // Ensure minimum height for loader visibility
            }}
          >
            <Box
              sx={{
                minWidth: `${nutrientGroups.length * 250 + 100}px`,
                display: "table",
                tableLayout: "fixed",
                opacity: scoreInitializing ? 0.5 : 1, // Optional: fade the table when loading
              }}
            >
              <Box sx={{ display: "table-header-group" }}>
                <Box sx={{ display: "table-row" }}>
                  <Box
                    sx={{
                      display: "table-cell",
                      width: "100px",
                      minWidth: "100px",
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                      backgroundColor: "#f5f5f5",
                      borderBottom: "1px solid #e0e0e0",
                      padding: "12px 16px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Score")}
                  </Box>
                  {nutrientGroups.map((group) => (
                    <Box
                      key={group.id}
                      sx={{
                        display: "table-cell",
                        width: "250px",
                        minWidth: "250px",
                        borderLeft: "1px solid #e0e0e0",
                        borderBottom: "1px solid #e0e0e0",
                        backgroundColor: "#f5f5f5",
                        padding: "8px",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          pr: 3,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {group.nutrients.map((n) => n.label).join(", ")}
                        </Typography>
                      </Box>
                      {!id && (
                        <IconButton
                          onClick={() => handleDeleteGroup(group.id)}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            padding: "4px",
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "table-row-group",
                  position: "relative",
                  height: "100%",
                  minHeight: "300px",
                }}
              >
                {scoreInitializing ? (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 50,
                      left: 0,
                      right: 300,
                      bottom: 0,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 10,
                    }}
                  >
                    <CircleLoader size={70} thickness={4} />
                  </Box>
                ) : (
                  localScores
                    .slice(0, visibleCount)
                    .map((score) => (
                      <ScoreRow
                        key={`score-${score.score}`}
                        score={score}
                        scoreIndex={score.score}
                        onChange={handleChange}
                      />
                    ))
                )}
              </Box>
            </Box>
          </Box>
        )}

        {/* Keep your existing Load More button code */}
        {localScores?.length > visibleCount && (
          <Box mt={2} mb={2}>
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
                  <CircleLoader size={20} color="inherit" />
                  {t("Loading...")}
                </Box>
              ) : (
                t("Load More")
              )}
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
}

export default React.memo(PositiveNutrientsTable);

PositiveNutrientsTable.whyDidYouRender = true; 
