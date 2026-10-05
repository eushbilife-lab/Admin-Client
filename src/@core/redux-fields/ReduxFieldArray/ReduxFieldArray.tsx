import React, { useEffect, useState } from "react";
import Button from "@core/basic-components/Button";
import ReduxFormFields, { ReduxFormField } from "../ReduxFormFields";
import FieldArrayHeading from "../FieldArrayHeading";
import { Typography, Box } from "@mui/material";
import BlockComponent from "@core/api-components/BlockComponent";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import {
  change,
  unregisterField,
  clearAsyncError,
  untouch,
  registerField,
} from "redux-form";

export default function ReduxFieldArray({
  fields,
  label,
  fieldsArray,
  upperLayout,
  handleSubmit,
  isUpdateMode,
  ...rest
}: any) {
  const [initialized, setInitialized] = useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formValues = useAppSelector((state) => state.form[rest.meta.form]);

   useEffect(() => {
    if (fields.length === 0) {
      fields.push({});
      setInitialized(true);
    }
  }, [fields]);

  if (!initialized) {
    return null;
  }

  // const handleRemoveField = (indexToRemove: number) => {
  //   console.log("🚀 ~ handleRemoveField ~ indexToRemove:", indexToRemove)
  //   const { form } = rest.meta;

  //   fieldsArray.forEach((field: any) => {
  //     const fieldName = `${fields.name}[${indexToRemove}].${field.name}`;
  //     dispatch(unregisterField(form, fieldName));
  //     dispatch(untouch(form, fieldName));
  //     dispatch(unregisterField(form, fieldName));
  //     dispatch(untouch(form, fieldName));
  //   });

  //   fields.remove(indexToRemove);

  // };

  // function getActualIndexFromUIIndex(registeredKeys: string[], arrayName: string, uiIndex: number) {
  //   const regex = new RegExp(`^${arrayName}\\[(\\d+)\\]`);

  //   const matchedIndices = registeredKeys
  //     .map((key) => {
  //       const match = key.match(regex);
  //       return match ? parseInt(match[1], 10) : undefined;
  //     })
  //     .filter((i): i is number => i !== undefined);

  //   matchedIndices.sort((a, b) => a - b); // ensure order

  //   return matchedIndices[uiIndex]; // the actual field index at UI position
  // }

  function getActualIndexFromUIIndex(
    registeredKeys: string[],
    arrayName: string,
    uiIndex: number
  ): number | undefined {
    const regex = new RegExp(`^${arrayName}\\[(\\d+)\\]`);

    const matchedIndices = registeredKeys
      .map((key) => {
        const match = key.match(regex);
        return match ? parseInt(match[1], 10) : undefined;
      })
      .filter((i): i is number => i !== undefined);

    matchedIndices.sort((a, b) => a - b); // make sure it's sorted

    return matchedIndices[uiIndex]; // get actual field index at UI position
  }

  // const handleRemoveField = (index: number) => {
  //   const { form } = rest.meta;

  //   // Grab current list of registered field names
  //   const registeredFields = formValues?.registeredFields || {};
  //   const registeredKeys = Object.keys(registeredFields);

  //   // Find out which actual index (like nf[2]) is currently at the UI's index
  //   const currentFieldIndex = getActualIndexFromUIIndex(registeredKeys, fields.name, index);

  //   // If not found, fallback to default
  //   const actualIndex = currentFieldIndex !== undefined ? currentFieldIndex : index;

  //   fieldsArray.forEach((field: any) => {
  //     const fieldName = `${fields.name}[${actualIndex}].${field.name}`;
  //     dispatch(unregisterField(form, fieldName));
  //     dispatch(untouch(form, fieldName));
  //     dispatch(unregisterField(form, fieldName));
  //     dispatch(untouch(form, fieldName));
  //   });

  //   // Remove from UI
  //   fields.remove(index);
  // };
  const handleRemoveField = (index: number) => {
    const { form } = rest.meta;

    // Ensure formValues is defined and typed
    const registeredFields: Record<string, any> =
      formValues?.registeredFields || {};

    // 1. Unregister fields at the index to remove
    fieldsArray.forEach((field: any) => {
      const fieldName = `${fields.name}[${index}].${field.name}`;
      dispatch(unregisterField(form, fieldName));
      dispatch(untouch(form, fieldName));
      dispatch(unregisterField(form, fieldName));
      dispatch(untouch(form, fieldName));
    });

    // 2. Shift all fields after the removed index up by one
    const lastIndex = fields.length - 1;

    for (let i = index + 1; i <= lastIndex; i++) {
      fieldsArray.forEach((field: any) => {
        const oldFieldName = `${fields.name}[${i}].${field.name}`;
        const newFieldName = `${fields.name}[${i - 1}].${field.name}`;

        const oldValue = registeredFields[oldFieldName];
        if (oldValue !== undefined) {
          dispatch(unregisterField(form, oldFieldName));
          dispatch(untouch(form, oldFieldName));
          dispatch(unregisterField(form, oldFieldName));
          dispatch(untouch(form, oldFieldName));

          dispatch(registerField(form, newFieldName, oldValue.type));
        }
      });
    }

    // 3. Remove the field from UI array
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
