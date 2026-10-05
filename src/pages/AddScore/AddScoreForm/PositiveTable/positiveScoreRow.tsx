import Input from "@core/basic-components/Input";
import Select from "@core/basic-components/Select";
import React from "react";
import { useTranslation } from "react-i18next";
import OptionService from "utils/option.util";

type Condition = {
  min: { value: string; required: boolean };
  max: { value: string; required: boolean };
  operator: { value: string; required: boolean };
  sign: { value: string; required: boolean };
};

type PositiveScore = {
  score: number;
  conditions: Record<string, Condition>;
};


export const ScoreRow: React.FC<{
  score: PositiveScore;
  scoreIndex: number;
  onChange: (
    scoreIndex: number,
    nutrientKey: string,
    field: keyof Condition,
    value: string
  ) => void;
}> = React.memo(({ score, scoreIndex, onChange }) => {
  const { t } = useTranslation();



  const handleInputChange = (key: string, field: keyof Condition) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onChange(scoreIndex, key, field, value);
    }
  };

  const handleSelectChange = (key: string, field: keyof Condition) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(scoreIndex, key, field, e.target.value);
  };

  return (
    <tr>
      <td
        style={{
          border: "1px solid #ccc",
          padding: "8px",
          textAlign: "center",
          position: "sticky",
          left: 0,
          zIndex: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        {scoreIndex}
      </td>
      {Object.entries(score.conditions || {}).map(
        ([key, condition], nutrientIndex) => {
          const operator = condition.operator.value;
          const disableMaxField = operator !== "-";

          return (
            <td
              key={`${key}-${scoreIndex}`}
              style={{ border: "1px solid #ccc", padding: "8px" }}
            >
              <div style={{ marginBottom: "8px" }}>
                <Select
                  name=""
                  label={t("Operator")}
                  value={operator}
                  onChange={handleSelectChange(key, "operator")}
                  options={[
                    { label: "=", value: "=" },
                    { label: "-", value: "-" },
                    { label: "<", value: "<" },
                    { label: ">", value: ">" },
                    { label: "<=", value: "<=" },
                    { label: ">=", value: ">=" },

                  ]}
                  error={condition.operator?.required}
                  helperText={condition.operator?.required ? t("Required") : ""}
                />
              </div>
              <div style={{ marginBottom: "8px" }}>
                <Input
                  name=""
                  label={t("Value")}
                  value={condition.min.value}
                  onChange={handleInputChange(key, "min")}
                  type="text"
                  inputMode="decimal"
                  inputProps={{ 
                    pattern: "\\d*\\.?\\d*",
                    min: 0,
                    step: "0.1"
                  }}
                  error={condition.min?.required}
                  helperText={condition.min?.required ? t("Required") : ""}
                />
              </div>

              <div style={{ marginBottom: "8px" }}>
                {!disableMaxField && (
                  <Input
                    name=""
                    label={t("Value")}
                    value={condition.max.value}
                    onChange={handleInputChange(key, "max")}
                    type="text"
                    inputMode="decimal"
                    inputProps={{ 
                      pattern: "\\d*\\.?\\d*",
                      min: 0,
                      step: "0.1"
                    }}
                    error={condition.max?.required}
                    helperText={condition.max?.required ? t("Required") : ""}
                  />
                )}
              </div>

              <div style={{ marginBottom: "8px" }}>
                <Select
                  name=""
                  label={t("Sign")}
                  value={condition.sign.value}
                  onChange={handleSelectChange(key, "sign")}
                  options={OptionService.getSigns()}
                  error={condition.sign?.required}
                  helperText={condition.sign?.required ? t("Required") : ""}
                />
              </div>
            </td>
          );
        }
      )}
    </tr>
  );
});
