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
        }}
      >
        {scoreIndex}
      </td>
      {Object.entries(score.conditions).map(
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



// import Input from "@core/basic-components/Input";
// import Select from "@core/basic-components/Select";
// import React from "react";
// import { useTranslation } from "react-i18next";
// import OptionService from "utils/option.util";

// type Condition = {
//   min: { value: string; required: boolean };
//   max: { value: string; required: boolean };
//   operator: { value: string; required: boolean };
//   sign: { value: string; required: boolean };
// };

// type PositiveScore = {
//   score: number;
//   conditions: Record<string, Condition>;
// };

// interface ScoreRowProps {
//   score: PositiveScore;
//   scoreIndex: number;
//   onChange: (
//     scoreIndex: number,
//     nutrientKey: string,
//     field: keyof Condition,
//     value: string
//   ) => void;
//   nutrientGroups: {
//     id: string;
//     nutrients: {
//       key: string;
//       label: string;
//     }[];
//   }[];
// }

// export const ScoreRow: React.FC<ScoreRowProps> = React.memo(({ 
//   score, 
//   scoreIndex, 
//   onChange,
//   nutrientGroups
// }) => {
//   const { t } = useTranslation();

//   const handleInputChange = (key: string, field: keyof Condition) => (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const value = e.target.value;
//     if (value === '' || /^\d*\.?\d*$/.test(value)) {
//       onChange(scoreIndex, key, field, value);
//     }
//   };

//   const handleSelectChange = (key: string, field: keyof Condition) => (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     onChange(scoreIndex, key, field, e.target.value);
//   };

// return (
//   <tr>
//     <td
//       style={{
//         border: "1px solid #ccc",
//         padding: "8px",
//         textAlign: "center",
//       }}
//     >
//       {scoreIndex}
//     </td>

//     {nutrientGroups.map((group) => {
//       const groupKey = group.id; // Use group.id as the key for condition
//       const condition = score.conditions[groupKey] || {
//         operator: { value: "", required: false },
//         min: { value: "", required: false },
//         max: { value: "", required: false },
//         sign: { value: "", required: false },
//       };

//       const operator = condition?.operator?.value;
//       console.log("")
//       const disableMaxField = operator !== "-";

//       return (
//         <td
//           key={`${groupKey}-${scoreIndex}`}
//           style={{ border: "1px solid #ccc", padding: "8px" }}
//         >
//           <div style={{ marginBottom: "8px" }}>
//             <Select
//               name={`operator-${groupKey}-${scoreIndex}`}
//               label={t("Operator")}
//               value={operator}
//               onChange={handleSelectChange(groupKey, "operator")}
//               options={[
//                 { label: "=", value: "=" },
//                 { label: "-", value: "-" },
//                 { label: "<", value: "<" },
//                 { label: ">", value: ">" },
//                 { label: "<=", value: "<=" },
//                 { label: ">=", value: ">=" },
//               ]}
//               error={condition.operator?.required}
//               helperText={condition.operator?.required ? t("Required") : ""}
//             />
//           </div>

//           <div style={{ marginBottom: "8px" }}>
//             <Input
//               name={`min-${groupKey}-${scoreIndex}`}
//               label={t("Value")}
//               value={condition.min.value}
//               onChange={handleInputChange(groupKey, "min")}
//               type="text"
//               inputMode="decimal"
//               inputProps={{
//                 pattern: "\\d*\\.?\\d*",
//                 min: 0,
//                 step: "0.1"
//               }}
//               error={condition.min?.required}
//               helperText={condition.min?.required ? t("Required") : ""}
//             />
//           </div>

//           <div style={{ marginBottom: "8px" }}>
//             {!disableMaxField && (
//               <Input
//                 name={`max-${groupKey}-${scoreIndex}`}
//                 label={t("Value")}
//                 value={condition.max.value}
//                 onChange={handleInputChange(groupKey, "max")}
//                 type="text"
//                 inputMode="decimal"
//                 inputProps={{
//                   pattern: "\\d*\\.?\\d*",
//                   min: 0,
//                   step: "0.1"
//                 }}
//                 error={condition.max?.required}
//                 helperText={condition.max?.required ? t("Required") : ""}
//               />
//             )}
//           </div>

//           <div style={{ marginBottom: "8px" }}>
//             <Select
//               name={`sign-${groupKey}-${scoreIndex}`}
//               label={t("Sign")}
//               value={condition.sign.value}
//               onChange={handleSelectChange(groupKey, "sign")}
//               options={OptionService.getSigns()}
//               error={condition.sign?.required}
//               helperText={condition.sign?.required ? t("Required") : ""}
//             />
//           </div>
//         </td>
//       );
//     })}
//   </tr>
// );

// });