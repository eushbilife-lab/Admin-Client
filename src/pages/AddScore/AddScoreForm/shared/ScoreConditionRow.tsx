import Input from "@core/basic-components/Input";
import Select from "@core/basic-components/Select";
import React, { useCallback } from "react";
import OptionService from "utils/option.util";

export type ScoreCondition = {
  min: { value: string; required: boolean };
  max: { value: string; required: boolean };
  operator: { value: string; required: boolean };
  sign: { value: string; required: boolean };
};

export type ScoreRowData = {
  score: number;
  conditions: Record<string, ScoreCondition>;
};

type Props = {
  score: ScoreRowData;
  scoreIndex: number;
  columnKeys: string[];
  tone: "positive" | "negative";
  onChange: (
    scoreIndex: number,
    nutrientKey: string,
    field: keyof ScoreCondition,
    value: string
  ) => void;
};

const OPERATORS = [
  { label: "Range", value: "-" },
  { label: "=", value: "=" },
  { label: "<", value: "<" },
  { label: ">", value: ">" },
  { label: "≤", value: "<=" },
  { label: "≥", value: ">=" },
];

function ScoreConditionRow({
  score,
  scoreIndex,
  columnKeys,
  tone,
  onChange,
}: Props) {
  const handleInputChange = useCallback(
    (key: string, field: keyof ScoreCondition) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
          onChange(scoreIndex, key, field, value);
        }
      },
    [onChange, scoreIndex]
  );

  const handleSelectChange = useCallback(
    (key: string, field: keyof ScoreCondition) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(scoreIndex, key, field, e.target.value);
      },
    [onChange, scoreIndex]
  );

  const pointClass =
    scoreIndex === 0
      ? "hnss-score-point-0"
      : scoreIndex === 10
        ? "hnss-score-point-10"
        : "";

  return (
    <tr className={pointClass} data-tone={tone}>
      <td className="hnss-score-sticky">{scoreIndex}</td>
      {columnKeys.map((key) => {
        const condition = score.conditions[key];
        if (!condition) {
          return <td key={`${key}-${scoreIndex}`} />;
        }
        const operator = condition.operator?.value || "";
        const showMax = operator === "-";
        return (
          <td key={`${key}-${scoreIndex}`}>
            <div className="hnss-cell">
              <Select
                name=""
                label="Operator"
                value={operator}
                onChange={handleSelectChange(key, "operator")}
                options={OPERATORS}
                error={Boolean(condition.operator?.required)}
                helperText={condition.operator?.required ? "Required" : ""}
              />
              <Input
                name=""
                label={showMax ? "Min" : "Value"}
                value={condition.min?.value ?? ""}
                onChange={handleInputChange(key, "min")}
                type="text"
                inputMode="decimal"
                error={Boolean(condition.min?.required)}
                helperText={condition.min?.required ? "Required" : ""}
              />
              {showMax ? (
                <Input
                  name=""
                  label="Max"
                  value={condition.max?.value ?? ""}
                  onChange={handleInputChange(key, "max")}
                  type="text"
                  inputMode="decimal"
                  error={Boolean(condition.max?.required)}
                  helperText={condition.max?.required ? "Required" : ""}
                />
              ) : null}
              <Select
                name=""
                label="Sign"
                value={condition.sign?.value ?? ""}
                onChange={handleSelectChange(key, "sign")}
                options={OptionService.getSigns()}
                error={Boolean(condition.sign?.required)}
                helperText={condition.sign?.required ? "Required" : ""}
              />
            </div>
          </td>
        );
      })}
    </tr>
  );
}

export default React.memo(ScoreConditionRow);
