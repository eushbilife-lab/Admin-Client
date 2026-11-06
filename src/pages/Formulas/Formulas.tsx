import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  FormControlLabel,
  MenuItem,
  Skeleton,
  Switch,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import PageShell from "@core/templates/PageShell";
import StatusChip from "@core/templates/PageShell/StatusChip";
import formulaService from "services/formula.service";
import ToasterService from "utils/toaster.util";
import "./Formulas.css";

type FormulaConfig = {
  key?: string;
  version?: number;
  calculateValues?: any;
  safety?: any;
  clinicalRules?: any[];
  activity?: any;
  updatedAt?: string;
  updatedBy?: string;
  sections?: string[];
};

const TABS: { id: string; label: string }[] = [
  { id: "bmi", label: "BMI / IBW" },
  { id: "bmr", label: "BMR" },
  { id: "pal", label: "PAL / TEF" },
  { id: "goals", label: "Goals" },
  { id: "macros", label: "Macros" },
  { id: "diets", label: "Diets" },
  { id: "dga", label: "DGA / Fiber" },
  { id: "nutrients", label: "Nutrients" },
  { id: "clinical", label: "Clinical" },
  { id: "activity", label: "Activity" },
  { id: "safety", label: "Safety" },
];

function NumField({
  label,
  value,
  onChange,
  step = "any",
}: {
  label: string;
  value: number | string | undefined;
  onChange: (n: number) => void;
  step?: string;
}) {
  return (
    <TextField
      size="small"
      type="number"
      label={label}
      value={value ?? ""}
      inputProps={{ step }}
      onChange={(e) => onChange(Number(e.target.value))}
      fullWidth
    />
  );
}

function sectionPayload(tab: string, config: FormulaConfig): Record<string, unknown> {
  const cv = config.calculateValues || {};
  const safety = config.safety || {};
  switch (tab) {
    case "bmi":
      return { bmi: cv.bmi, ibw: cv.ibw };
    case "bmr":
      return { bmrConstants: cv.bmrConstants, tefConstant: cv.tefConstant };
    case "pal":
      return { palValues: cv.palValues, tefConstant: cv.tefConstant };
    case "goals":
      return {
        targetAdjustments: cv.targetAdjustments,
        calorieFloorMale: safety.calorieFloorMale,
        calorieFloorFemale: safety.calorieFloorFemale,
      };
    case "macros":
      return {
        macroByGoal: cv.macroByGoal,
        proteinFloorPerKg: safety.proteinFloorPerKg,
        calorieDivisors: cv.calorieDivisors,
      };
    case "diets":
      return { dietMacroStyle: cv.dietMacroStyle };
    case "dga":
      return {
        DGA_Formula_values: cv.DGA_Formula_values,
        RDA_Formula_values: cv.RDA_Formula_values,
      };
    case "nutrients":
      return { nutritionalGoals: cv.nutritionalGoals };
    case "clinical":
      return { clinicalRules: config.clinicalRules || [], clamps: safety.clamps };
    case "activity":
      return { activity: config.activity };
    case "safety":
      return { safety: config.safety };
    default:
      return {};
  }
}

export default function Formulas() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<FormulaConfig | null>(null);
  const [tab, setTab] = useState("bmi");
  const [nutrientBand, setNutrientBand] = useState("19-50+");
  const [nutrientSex, setNutrientSex] = useState<"male" | "female">("male");

  const load = useCallback(async () => {
    setLoading(true);
    const [success, error]: any = await formulaService.getActive();
    setLoading(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Failed to load formulas"
      );
      return;
    }
    const next = success?.data?.data?.config as FormulaConfig;
    setConfig(next || null);
    const nextBands = Object.keys(
      next?.calculateValues?.nutritionalGoals || {}
    );
    if (nextBands.length) {
      setNutrientBand((prev) =>
        nextBands.includes(prev) ? prev : nextBands[0]
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const cv = config?.calculateValues || {};
  const bands = useMemo(
    () => Object.keys(cv.nutritionalGoals || {}),
    [cv.nutritionalGoals]
  );

  const setCv = (patch: Record<string, unknown>) => {
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            calculateValues: { ...(prev.calculateValues || {}), ...patch },
          }
        : prev
    );
  };

  const saveSection = async () => {
    if (!config) return;
    setSaving(true);
    const [success, error]: any = await formulaService.saveSection(
      tab,
      sectionPayload(tab, config)
    );
    setSaving(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Could not save section"
      );
      return;
    }
    const next = success?.data?.data?.config as FormulaConfig;
    if (next) setConfig(next);
    ToasterService.showSuccess(
      success?.data?.message || `Saved “${tab}” section`
    );
  };

  const resetDefaults = async () => {
    if (
      !window.confirm(
        "Reset all formulas to code defaults? This overwrites the active config."
      )
    ) {
      return;
    }
    setSaving(true);
    const [success, error]: any = await formulaService.reset();
    setSaving(false);
    if (error) {
      ToasterService.showError(
        error?.response?.data?.message || "Reset failed"
      );
      return;
    }
    const next = success?.data?.data?.config as FormulaConfig;
    if (next) setConfig(next);
    ToasterService.showSuccess("Formulas reset to defaults");
  };

  const updatedLabel = config?.updatedAt
    ? new Date(config.updatedAt).toLocaleString()
    : "—";

  return (
    <PageShell
      title="Formulas"
      subtitle="Coefficients, RDA tables, clinical rules, and activity constants used by the User health calculator."
    >
      {loading || !config ? (
        <Skeleton variant="rounded" height={360} />
      ) : (
        <>
          <div className="formulas-meta">
            <StatusChip label={`v${config.version ?? 1}`} tone="info" />
            <span>Updated {updatedLabel}</span>
            {config.updatedBy ? <span>by {config.updatedBy}</span> : null}
          </div>

          <Tabs
            value={tab}
            onChange={(_e, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {TABS.map((t) => (
              <Tab key={t.id} value={t.id} label={t.label} />
            ))}
          </Tabs>

          <div className="formulas-panel">
            {tab === "bmi" && (
              <>
                <p className="formulas-hint">
                  BMI category ranges and ideal body weight target BMI.
                </p>
                <div className="formulas-group">
                  <h4>IBW</h4>
                  <div className="formulas-grid">
                    <NumField
                      label="Target BMI"
                      value={cv.ibw?.targetBmi}
                      onChange={(n) =>
                        setCv({ ibw: { ...(cv.ibw || {}), targetBmi: n } })
                      }
                    />
                    <NumField
                      label="BMI exponent"
                      value={cv.bmi?.exponent}
                      onChange={(n) =>
                        setCv({ bmi: { ...(cv.bmi || {}), exponent: n } })
                      }
                    />
                  </div>
                </div>
                <div className="formulas-group">
                  <h4>Ranges</h4>
                  <table className="formulas-table">
                    <thead>
                      <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(cv.bmi?.ranges || []).map((row: any, i: number) => (
                        <tr key={i}>
                          <td>
                            <TextField
                              size="small"
                              type="number"
                              value={row.from ?? ""}
                              onChange={(e) => {
                                const ranges = [...(cv.bmi?.ranges || [])];
                                ranges[i] = {
                                  ...ranges[i],
                                  from: Number(e.target.value),
                                };
                                setCv({ bmi: { ...cv.bmi, ranges } });
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              size="small"
                              type="number"
                              value={row.to ?? ""}
                              onChange={(e) => {
                                const ranges = [...(cv.bmi?.ranges || [])];
                                ranges[i] = {
                                  ...ranges[i],
                                  to: Number(e.target.value),
                                };
                                setCv({ bmi: { ...cv.bmi, ranges } });
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              size="small"
                              value={row.category ?? ""}
                              onChange={(e) => {
                                const ranges = [...(cv.bmi?.ranges || [])];
                                ranges[i] = {
                                  ...ranges[i],
                                  category: e.target.value,
                                };
                                setCv({ bmi: { ...cv.bmi, ranges } });
                              }}
                              fullWidth
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {tab === "bmr" && (
              <>
                <p className="formulas-hint">
                  Mifflin–St Jeor coefficients (structure stays in code).
                </p>
                {(["male", "female"] as const).map((sex) => (
                  <div className="formulas-group" key={sex}>
                    <h4>{sex}</h4>
                    <div className="formulas-grid">
                      {(
                        [
                          "weightMultiplier",
                          "heightMultiplier",
                          "ageMultiplier",
                          "base",
                        ] as const
                      ).map((key) => (
                        <NumField
                          key={key}
                          label={key}
                          value={cv.bmrConstants?.[sex]?.[key]}
                          onChange={(n) =>
                            setCv({
                              bmrConstants: {
                                ...cv.bmrConstants,
                                [sex]: {
                                  ...(cv.bmrConstants?.[sex] || {}),
                                  [key]: n,
                                },
                              },
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            {tab === "pal" && (
              <>
                <p className="formulas-hint">
                  Physical activity level multipliers and TEF constant.
                </p>
                <div className="formulas-grid">
                  {Object.keys(cv.palValues || {}).map((key) => (
                    <NumField
                      key={key}
                      label={key}
                      step="0.001"
                      value={cv.palValues?.[key]}
                      onChange={(n) =>
                        setCv({
                          palValues: { ...cv.palValues, [key]: n },
                        })
                      }
                    />
                  ))}
                  <NumField
                    label="TEF constant"
                    step="0.01"
                    value={cv.tefConstant}
                    onChange={(n) => setCv({ tefConstant: n })}
                  />
                </div>
              </>
            )}

            {tab === "goals" && (
              <>
                <p className="formulas-hint">
                  Calorie deltas by goal plus safety floors.
                </p>
                <div className="formulas-group">
                  <h4>Target adjustments (kcal)</h4>
                  <table className="formulas-table">
                    <thead>
                      <tr>
                        <th>Goal</th>
                        <th>Min</th>
                        <th>Max</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(cv.targetAdjustments || {}).map((goal) => (
                        <tr key={goal}>
                          <td>{goal}</td>
                          <td>
                            <TextField
                              size="small"
                              type="number"
                              value={cv.targetAdjustments[goal]?.min ?? ""}
                              onChange={(e) =>
                                setCv({
                                  targetAdjustments: {
                                    ...cv.targetAdjustments,
                                    [goal]: {
                                      ...cv.targetAdjustments[goal],
                                      min: Number(e.target.value),
                                    },
                                  },
                                })
                              }
                            />
                          </td>
                          <td>
                            <TextField
                              size="small"
                              type="number"
                              value={cv.targetAdjustments[goal]?.max ?? ""}
                              onChange={(e) =>
                                setCv({
                                  targetAdjustments: {
                                    ...cv.targetAdjustments,
                                    [goal]: {
                                      ...cv.targetAdjustments[goal],
                                      max: Number(e.target.value),
                                    },
                                  },
                                })
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="formulas-grid">
                  <NumField
                    label="Calorie floor male"
                    value={config.safety?.calorieFloorMale}
                    onChange={(n) =>
                      setConfig((p) =>
                        p
                          ? {
                              ...p,
                              safety: { ...p.safety, calorieFloorMale: n },
                            }
                          : p
                      )
                    }
                  />
                  <NumField
                    label="Calorie floor female"
                    value={config.safety?.calorieFloorFemale}
                    onChange={(n) =>
                      setConfig((p) =>
                        p
                          ? {
                              ...p,
                              safety: { ...p.safety, calorieFloorFemale: n },
                            }
                          : p
                      )
                    }
                  />
                </div>
              </>
            )}

            {tab === "macros" && (
              <>
                <p className="formulas-hint">
                  Protein / fat g per kg by goal, protein floor, calorie divisors.
                </p>
                <table className="formulas-table">
                  <thead>
                    <tr>
                      <th>Goal</th>
                      <th>Protein g/kg</th>
                      <th>Fat g/kg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(cv.macroByGoal || {}).map((goal) => (
                      <tr key={goal}>
                        <td>{goal}</td>
                        <td>
                          <TextField
                            size="small"
                            type="number"
                            inputProps={{ step: "0.1" }}
                            value={cv.macroByGoal[goal]?.proteinPerKg ?? ""}
                            onChange={(e) =>
                              setCv({
                                macroByGoal: {
                                  ...cv.macroByGoal,
                                  [goal]: {
                                    ...cv.macroByGoal[goal],
                                    proteinPerKg: Number(e.target.value),
                                  },
                                },
                              })
                            }
                          />
                        </td>
                        <td>
                          <TextField
                            size="small"
                            type="number"
                            inputProps={{ step: "0.1" }}
                            value={cv.macroByGoal[goal]?.fatPerKg ?? ""}
                            onChange={(e) =>
                              setCv({
                                macroByGoal: {
                                  ...cv.macroByGoal,
                                  [goal]: {
                                    ...cv.macroByGoal[goal],
                                    fatPerKg: Number(e.target.value),
                                  },
                                },
                              })
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="formulas-grid" style={{ marginTop: 16 }}>
                  <NumField
                    label="Protein floor g/kg"
                    step="0.1"
                    value={config.safety?.proteinFloorPerKg}
                    onChange={(n) =>
                      setConfig((p) =>
                        p
                          ? {
                              ...p,
                              safety: { ...p.safety, proteinFloorPerKg: n },
                            }
                          : p
                      )
                    }
                  />
                  {Object.keys(cv.calorieDivisors || {}).map((key) => (
                    <NumField
                      key={key}
                      label={`Divisor ${key}`}
                      value={cv.calorieDivisors[key]}
                      onChange={(n) =>
                        setCv({
                          calorieDivisors: {
                            ...cv.calorieDivisors,
                            [key]: n,
                          },
                        })
                      }
                    />
                  ))}
                </div>
              </>
            )}

            {tab === "diets" && (
              <>
                <p className="formulas-hint">
                  Diet style multipliers, leftover macro, carb caps, mix ratios.
                </p>
                <table className="formulas-table">
                  <thead>
                    <tr>
                      <th>Diet</th>
                      <th>Protein ×</th>
                      <th>Leftover</th>
                      <th>Carb cap g</th>
                      <th>Mix carb</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(cv.dietMacroStyle || {}).map((diet) => {
                      const row = cv.dietMacroStyle[diet] || {};
                      return (
                        <tr key={diet}>
                          <td>{diet}</td>
                          <td>
                            <TextField
                              size="small"
                              type="number"
                              inputProps={{ step: "0.05" }}
                              value={row.proteinMultiplier ?? ""}
                              onChange={(e) =>
                                setCv({
                                  dietMacroStyle: {
                                    ...cv.dietMacroStyle,
                                    [diet]: {
                                      ...row,
                                      proteinMultiplier: Number(e.target.value),
                                    },
                                  },
                                })
                              }
                            />
                          </td>
                          <td>
                            <TextField
                              size="small"
                              select
                              value={row.leftover || "carbs"}
                              onChange={(e) =>
                                setCv({
                                  dietMacroStyle: {
                                    ...cv.dietMacroStyle,
                                    [diet]: {
                                      ...row,
                                      leftover: e.target.value,
                                    },
                                  },
                                })
                              }
                              style={{ minWidth: 100 }}
                            >
                              {["carbs", "fat", "mix"].map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                  {opt}
                                </MenuItem>
                              ))}
                            </TextField>
                          </td>
                          <td>
                            <TextField
                              size="small"
                              type="number"
                              value={row.carbCapG ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                const next = { ...row };
                                if (val === "") delete next.carbCapG;
                                else next.carbCapG = Number(val);
                                setCv({
                                  dietMacroStyle: {
                                    ...cv.dietMacroStyle,
                                    [diet]: next,
                                  },
                                });
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              size="small"
                              type="number"
                              inputProps={{ step: "0.05" }}
                              value={row.mixCarb ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                const next = { ...row };
                                if (val === "") delete next.mixCarb;
                                else next.mixCarb = Number(val);
                                setCv({
                                  dietMacroStyle: {
                                    ...cv.dietMacroStyle,
                                    [diet]: next,
                                  },
                                });
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}

            {tab === "dga" && (
              <>
                <p className="formulas-hint">
                  Added sugar / saturated fat DGA coeffs and fiber RDA formula.
                </p>
                <div className="formulas-group">
                  <h4>Added sugar DGA</h4>
                  <div className="formulas-grid">
                    <NumField
                      label="Multiplier"
                      step="0.01"
                      value={cv.DGA_Formula_values?.AddedSugar_DGA?.multiplierValue}
                      onChange={(n) =>
                        setCv({
                          DGA_Formula_values: {
                            ...cv.DGA_Formula_values,
                            AddedSugar_DGA: {
                              ...cv.DGA_Formula_values?.AddedSugar_DGA,
                              multiplierValue: n,
                            },
                          },
                        })
                      }
                    />
                    <NumField
                      label="Divider"
                      value={cv.DGA_Formula_values?.AddedSugar_DGA?.dividerValue}
                      onChange={(n) =>
                        setCv({
                          DGA_Formula_values: {
                            ...cv.DGA_Formula_values,
                            AddedSugar_DGA: {
                              ...cv.DGA_Formula_values?.AddedSugar_DGA,
                              dividerValue: n,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="formulas-group">
                  <h4>Saturated fat DGA</h4>
                  <div className="formulas-grid">
                    <NumField
                      label="Multiplier"
                      step="0.01"
                      value={
                        cv.DGA_Formula_values?.SaturatedFat_DGA?.multiplierValue
                      }
                      onChange={(n) =>
                        setCv({
                          DGA_Formula_values: {
                            ...cv.DGA_Formula_values,
                            SaturatedFat_DGA: {
                              ...cv.DGA_Formula_values?.SaturatedFat_DGA,
                              multiplierValue: n,
                            },
                          },
                        })
                      }
                    />
                    <NumField
                      label="Divider"
                      value={cv.DGA_Formula_values?.SaturatedFat_DGA?.dividerValue}
                      onChange={(n) =>
                        setCv({
                          DGA_Formula_values: {
                            ...cv.DGA_Formula_values,
                            SaturatedFat_DGA: {
                              ...cv.DGA_Formula_values?.SaturatedFat_DGA,
                              dividerValue: n,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="formulas-group">
                  <h4>Fiber RDA</h4>
                  <div className="formulas-grid">
                    <NumField
                      label="Constant (kcal base)"
                      value={cv.RDA_Formula_values?.fiber?.constantValue}
                      onChange={(n) =>
                        setCv({
                          RDA_Formula_values: {
                            ...cv.RDA_Formula_values,
                            fiber: {
                              ...cv.RDA_Formula_values?.fiber,
                              constantValue: n,
                            },
                          },
                        })
                      }
                    />
                    <NumField
                      label="Multiplier g / 1000 kcal"
                      value={cv.RDA_Formula_values?.fiber?.multiplierValue}
                      onChange={(n) =>
                        setCv({
                          RDA_Formula_values: {
                            ...cv.RDA_Formula_values,
                            fiber: {
                              ...cv.RDA_Formula_values?.fiber,
                              multiplierValue: n,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {tab === "nutrients" && (
              <>
                <p className="formulas-hint">
                  Full age-band vitamin / mineral tables. Edit constants per band
                  and sex.
                </p>
                <div className="formulas-band-bar">
                  <TextField
                    select
                    size="small"
                    label="Age band"
                    value={nutrientBand}
                    onChange={(e) => setNutrientBand(e.target.value)}
                    style={{ minWidth: 140 }}
                  >
                    {bands.map((b) => (
                      <MenuItem key={b} value={b}>
                        {b}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    size="small"
                    label="Sex"
                    value={nutrientSex}
                    onChange={(e) =>
                      setNutrientSex(e.target.value as "male" | "female")
                    }
                    style={{ minWidth: 120 }}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </TextField>
                </div>
                {Object.keys(
                  cv.nutritionalGoals?.[nutrientBand]?.[nutrientSex] || {}
                ).map((group) => {
                  const rows =
                    cv.nutritionalGoals[nutrientBand][nutrientSex][group] || [];
                  if (!Array.isArray(rows)) return null;
                  return (
                    <div className="formulas-group" key={group}>
                      <h4>{group}</h4>
                      <table className="formulas-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Constant</th>
                            <th>Unit</th>
                            <th>Basis</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row: any, i: number) => (
                            <tr key={`${row.name}-${i}`}>
                              <td>{row.name}</td>
                              <td>
                                <TextField
                                  size="small"
                                  type="number"
                                  inputProps={{ step: "any" }}
                                  value={row.constant ?? ""}
                                  onChange={(e) => {
                                    const goals = JSON.parse(
                                      JSON.stringify(cv.nutritionalGoals)
                                    );
                                    goals[nutrientBand][nutrientSex][group][i] =
                                      {
                                        ...row,
                                        constant: Number(e.target.value),
                                      };
                                    setCv({ nutritionalGoals: goals });
                                  }}
                                />
                              </td>
                              <td>{row.unit}</td>
                              <td>{row.unitValue}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </>
            )}

            {tab === "clinical" && (
              <>
                <p className="formulas-hint">
                  Enable / disable concern rules and edit numeric effects.
                </p>
                <table className="formulas-table">
                  <thead>
                    <tr>
                      <th>On</th>
                      <th>Rule</th>
                      <th>Carb cap</th>
                      <th>Cal scale</th>
                      <th>Prot × extra</th>
                      <th>Sugar × max</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(config.clinicalRules || []).map((rule: any, i: number) => (
                      <tr key={rule.id || i}>
                        <td>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={!!rule.enabled}
                                onChange={(e) => {
                                  const clinicalRules = [
                                    ...(config.clinicalRules || []),
                                  ];
                                  clinicalRules[i] = {
                                    ...rule,
                                    enabled: e.target.checked,
                                  };
                                  setConfig((p) =>
                                    p ? { ...p, clinicalRules } : p
                                  );
                                }}
                                size="small"
                              />
                            }
                            label=""
                          />
                        </td>
                        <td>
                          <div>{rule.catalogKey}</div>
                          <div className="formulas-rule-note">
                            {rule.catalogType}
                          </div>
                        </td>
                        <td>
                          <TextField
                            size="small"
                            type="number"
                            value={rule.effects?.carbCapG ?? ""}
                            onChange={(e) => {
                              const clinicalRules = [
                                ...(config.clinicalRules || []),
                              ];
                              const effects = { ...(rule.effects || {}) };
                              if (e.target.value === "") delete effects.carbCapG;
                              else effects.carbCapG = Number(e.target.value);
                              clinicalRules[i] = { ...rule, effects };
                              setConfig((p) =>
                                p ? { ...p, clinicalRules } : p
                              );
                            }}
                          />
                        </td>
                        <td>
                          <TextField
                            size="small"
                            type="number"
                            inputProps={{ step: "0.01" }}
                            value={rule.effects?.calorieScale ?? ""}
                            onChange={(e) => {
                              const clinicalRules = [
                                ...(config.clinicalRules || []),
                              ];
                              const effects = { ...(rule.effects || {}) };
                              if (e.target.value === "")
                                delete effects.calorieScale;
                              else effects.calorieScale = Number(e.target.value);
                              clinicalRules[i] = { ...rule, effects };
                              setConfig((p) =>
                                p ? { ...p, clinicalRules } : p
                              );
                            }}
                          />
                        </td>
                        <td>
                          <TextField
                            size="small"
                            type="number"
                            inputProps={{ step: "0.05" }}
                            value={rule.effects?.proteinMultiplierExtra ?? ""}
                            onChange={(e) => {
                              const clinicalRules = [
                                ...(config.clinicalRules || []),
                              ];
                              const effects = { ...(rule.effects || {}) };
                              if (e.target.value === "")
                                delete effects.proteinMultiplierExtra;
                              else
                                effects.proteinMultiplierExtra = Number(
                                  e.target.value
                                );
                              clinicalRules[i] = { ...rule, effects };
                              setConfig((p) =>
                                p ? { ...p, clinicalRules } : p
                              );
                            }}
                          />
                        </td>
                        <td>
                          <TextField
                            size="small"
                            type="number"
                            inputProps={{ step: "0.05" }}
                            value={rule.effects?.addedSugarScaleMax ?? ""}
                            onChange={(e) => {
                              const clinicalRules = [
                                ...(config.clinicalRules || []),
                              ];
                              const effects = { ...(rule.effects || {}) };
                              if (e.target.value === "")
                                delete effects.addedSugarScaleMax;
                              else
                                effects.addedSugarScaleMax = Number(
                                  e.target.value
                                );
                              clinicalRules[i] = { ...rule, effects };
                              setConfig((p) =>
                                p ? { ...p, clinicalRules } : p
                              );
                            }}
                          />
                        </td>
                        <td>
                          <div className="formulas-rule-note">{rule.note}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {tab === "activity" && (
              <>
                <p className="formulas-hint">
                  Walking / sleep / water goal coefficients.
                </p>
                <div className="formulas-grid">
                  {Object.keys(config.activity || {}).map((key) => (
                    <NumField
                      key={key}
                      label={key}
                      step="any"
                      value={config.activity?.[key]}
                      onChange={(n) =>
                        setConfig((p) =>
                          p
                            ? {
                                ...p,
                                activity: { ...p.activity, [key]: n },
                              }
                            : p
                        )
                      }
                    />
                  ))}
                </div>
              </>
            )}

            {tab === "safety" && (
              <>
                <p className="formulas-hint">
                  Floors and modifier clamps applied after clinical rules.
                </p>
                <div className="formulas-group">
                  <h4>Floors</h4>
                  <div className="formulas-grid">
                    {(
                      [
                        "calorieFloorMale",
                        "calorieFloorFemale",
                        "proteinFloorPerKg",
                      ] as const
                    ).map((key) => (
                      <NumField
                        key={key}
                        label={key}
                        step="any"
                        value={config.safety?.[key]}
                        onChange={(n) =>
                          setConfig((p) =>
                            p
                              ? {
                                  ...p,
                                  safety: { ...p.safety, [key]: n },
                                }
                              : p
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="formulas-group">
                  <h4>Clamps</h4>
                  <table className="formulas-table">
                    <thead>
                      <tr>
                        <th>Clamp</th>
                        <th>Min</th>
                        <th>Max</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(config.safety?.clamps || {}).map((key) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>
                            <TextField
                              size="small"
                              type="number"
                              inputProps={{ step: "any" }}
                              value={config.safety.clamps[key]?.min ?? ""}
                              onChange={(e) =>
                                setConfig((p) =>
                                  p
                                    ? {
                                        ...p,
                                        safety: {
                                          ...p.safety,
                                          clamps: {
                                            ...p.safety.clamps,
                                            [key]: {
                                              ...p.safety.clamps[key],
                                              min: Number(e.target.value),
                                            },
                                          },
                                        },
                                      }
                                    : p
                                )
                              }
                            />
                          </td>
                          <td>
                            <TextField
                              size="small"
                              type="number"
                              inputProps={{ step: "any" }}
                              value={config.safety.clamps[key]?.max ?? ""}
                              onChange={(e) =>
                                setConfig((p) =>
                                  p
                                    ? {
                                        ...p,
                                        safety: {
                                          ...p.safety,
                                          clamps: {
                                            ...p.safety.clamps,
                                            [key]: {
                                              ...p.safety.clamps[key],
                                              max: Number(e.target.value),
                                            },
                                          },
                                        },
                                      }
                                    : p
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="formulas-actions">
              <Button
                variant="contained"
                disabled={saving}
                onClick={() => void saveSection()}
              >
                {saving ? "Saving…" : "Save section"}
              </Button>
              <Button
                variant="outlined"
                color="warning"
                disabled={saving}
                onClick={() => void resetDefaults()}
              >
                Reset to defaults
              </Button>
              <Button
                variant="text"
                disabled={saving}
                onClick={() => void load()}
              >
                Reload
              </Button>
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}
