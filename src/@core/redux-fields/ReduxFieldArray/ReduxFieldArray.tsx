import React, { useEffect } from "react";
import Button from "@core/basic-components/Button";
import ReduxFormFields, { ReduxFormField } from "../ReduxFormFields";
import FieldArrayHeading from "../FieldArrayHeading";
import { Typography, Box } from "@mui/material";
import BlockComponent from "@core/api-components/BlockComponent";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "redux/hooks";

export default function ReduxFieldArray({
  fields,
  label,
  fieldsArray,
  upperLayout,
  handleSubmit,
  isUpdateMode,
  ...rest
}: any) {
  const { t } = useTranslation();
  const formValues = useAppSelector((state) => state.form[rest.meta.form]);

  // Ensure at least one blank row for empty arrays; never block render when nf is pre-seeded.
  useEffect(() => {
    if (fields.length === 0) {
      fields.push({});
    }
  }, [fields, fields.length]);

  const handleRemoveField = (index: number) => {
    if (index < 0 || index >= fields.length) return;
    fields.remove(index);
  };

  return (
    <>
      {upperLayout ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <h3>
            {label}
            <br />
            <Button
              type="button"
              onClick={() => fields.unshift({})}
              sx={{ fontSize: "14px" }}
            >
              {t("Add More")} {t(label)}
            </Button>
          </h3>
          <BlockComponent allowedRoles={["admin", "data_author"]}>
            <Button
              variant="contained"
              type="submit"
              onClick={handleSubmit}
              sx={{ fontSize: "13.5px" }}
            >
              {t("Submit")}
            </Button>
          </BlockComponent>
        </Box>
      ) : (
        <h3>{label}</h3>
      )}

      {fields.map((member: string, index: number) => {
        const isUnsaturatedFat =
          formValues?.values?.nf?.[index]?.nutritionId?.key ===
          "unsaturated_fat";
        return (
          <div key={index} className="field-array-row">
            <FieldArrayHeading
              index={index}
              heading={label}
              fieldsLength={fields.length}
              onClick={() => handleRemoveField(index)}
            />
            <ReduxFormFields
              member={member}
              fields={fieldsArray.map((field: any) => ({
                ...field,
                disabled:
                  (isUnsaturatedFat && field.name === "perServing") ||
                  field.disabled,
              }))}
            />
          </div>
        );
      })}
      {!upperLayout && (
        <Box>
          <Button type="button" onClick={() => fields.push({})}>
            {t("Add More")} {t(label)}
          </Button>
          <br />
          {/* Show Submit button only when NOT in update mode
    {!isUpdateMode && (
      <Button variant="contained" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
    )} */}
        </Box>
      )}
    </>
  );
}
