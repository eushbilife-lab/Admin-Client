import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import { NutrientFields } from "..";
import { Box, Typography, Button, Stack, IconButton } from "@mui/material";
import {
  NegativeConditions,
  NegativeScore,
  NutrientGroup,
} from "../types/scoreTypes";
import { useTranslation } from "react-i18next";
import { change } from "redux-form";
import CloseIcon from "@mui/icons-material/Close";
import { scoreCalculationActions } from "redux/slices/scoreCalculation";
import { useParams } from "react-router-dom";
import { NegativeScoreRow } from "./NegativeScoreRow";
import CircleLoader from "@core/basic-components/CircleLoader";

function NegativeNutrientsTable() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const [nutrientGroups, setNutrientGroups] = useState<NutrientGroup[]>([]);
  const [negativeScores, setNegativeScores] = useState<NegativeScore[]>([]);
  const [loadingNegativeMore, setLoadingNegativeMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(11);
  const [localScores, setLocalScores] = useState<NegativeScore[]>([]);
  const [scoreInitializing, setScoreInitializing] = useState(true);

  const Nutrient = useAppSelector(
    (state) => state.form.AddScoreForm?.values?.NutrientID || []
  );

  const currentTypes = useAppSelector(
    (state) => state.form.AddScoreForm?.values?.isPositive || [],
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
  );

  const { updatedNegativeScore = [] } = useAppSelector(
    (state) => state.scoreCalculations.score ?? {},
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
  );

  const selectedTypes = useMemo(
    () => currentTypes?.map((item: { value: string }) => item.value) ?? [],
    [currentTypes]
  );

  // Extract nutrient groups from existing data when updating
  useEffect(() => {
    if (id && updatedNegativeScore?.length > 0) {
      const firstScore = updatedNegativeScore[0];
      if (firstScore?.conditions) {
        const groups: NutrientGroup[] = Object.keys(firstScore.conditions).map(
          (key) => {
            const nutrientKeys = key.split(",");
            return {
              id: key, // Use the key as the group ID
              nutrients: nutrientKeys.map((k) => ({ key: k, label: k })), // You might want to map these to proper labels
            };
          }
        );
        setNutrientGroups(groups);
      }
    }
  }, [id, updatedNegativeScore]);

  // Initialize scores based on nutrient groups
  useEffect(() => {
    if (!selectedTypes.includes("negative") || nutrientGroups.length === 0)
      return;
    if (negativeScores.length > 0) return;

    setLoadingNegativeMore(true);
    setScoreInitializing(true);
    const groupKeys = nutrientGroups.map((group) =>
      group.nutrients.map((n) => n.key).join(",")
    );
    const initializedScores = Array.from({ length: 21 }, (_, i) => ({
      score: i,
      conditions: groupKeys.reduce<Record<string, NegativeConditions>>(
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
      id && updatedNegativeScore?.length > 0
        ? initializedScores.map((score) => {
            const match = updatedNegativeScore.find(
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

    setNegativeScores(finalScores);
    setLocalScores(finalScores);

    setLoadingNegativeMore(false);
    setScoreInitializing(false);
  }, [
    selectedTypes,
    id,
    nutrientGroups,
    negativeScores.length,
    updatedNegativeScore,
  ]);

  useEffect(() => {
    dispatch(
      scoreCalculationActions.setScoreCalculation({
        negativeScores: localScores,
      })
    );
  }, [localScores, dispatch, negativeScores]);

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
  }, [Nutrient, dispatch, nutrientGroups]); // Add nutrientGroups to dependencies

  const handleDeleteGroup = useCallback((groupId: string) => {
    setNutrientGroups((prev) => prev.filter((group) => group.id !== groupId));
    setLocalScores((prev) =>
      prev.map((score) => {
        const { [groupId]: _, ...remainingConditions } = score.conditions;
        return {
          ...score,
          conditions: remainingConditions,
        };
      })
    );
  }, []);

  const handleChange = useCallback(
    (
      scoreIndex: number,
      groupId: string,
      field: keyof NegativeConditions,
      value: string
    ) => {
      setLocalScores((prev) => {
        const newScores = [...prev];
        const score = newScores[scoreIndex];
        if (!score) return prev;

        const updatedConditions = {
          ...score.conditions,
          [groupId]: {
            ...score.conditions[groupId],
            [field]: {
              ...score.conditions[groupId][field],
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
    setLoadingNegativeMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 10);
      setLoadingNegativeMore(false);
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
          {t("Negative Nutrients")}
        </Typography>

        {nutrientGroups.length > 0 ? (
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
                      <NegativeScoreRow
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
        ) : null}
        {localScores?.length > visibleCount && (
          <Box mt={2} mb={2}>
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

export default React.memo(NegativeNutrientsTable);
