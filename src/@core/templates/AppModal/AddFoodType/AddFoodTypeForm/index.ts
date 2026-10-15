import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import CheckboxRedux from "@core/redux-fields/CheckboxRedux";
import InputRedux from "@core/redux-fields/InputRedux";
import { required } from "utils/validate.util";

export { default } from "./AddFoodTypeForm";

export type PreferenceFormCopy = {
  nameLabel: string;
  nameHint: string;
  descriptionLabel: string;
  descriptionHint: string;
};

export const PREFERENCE_FORM_COPY: Record<string, PreferenceFormCopy> = {
  exercise_level: {
    nameLabel: "Activity level name",
    nameHint: "e.g. Sedentary, Lightly active, Very active",
    descriptionLabel: "Description",
    descriptionHint:
      "Explain how active this level is — shown to members when they pick their lifestyle.",
  },
  target: {
    nameLabel: "Goal name",
    nameHint: "e.g. Lose weight, Maintain, Build muscle",
    descriptionLabel: "Description",
    descriptionHint:
      "Short guidance for this goal — calorie and macro targets use this choice.",
  },
  food_concern: {
    nameLabel: "Food type / interest name",
    nameHint: "e.g. High protein, Organic, Low sugar, Gluten-free",
    descriptionLabel: "Description",
    descriptionHint:
      "What this label means on a product or profile — keep it clear for shoppers and members.",
  },
  diet: {
    nameLabel: "Diet name",
    nameHint: "e.g. Vegan, Keto, Mediterranean, Halal",
    descriptionLabel: "Description",
    descriptionHint:
      "Describe the eating pattern so members understand what the diet includes or excludes.",
  },
  temporary_concerns: {
    nameLabel: "Temporary concern name",
    nameHint: "e.g. Pregnancy, Fasting, Post-surgery",
    descriptionLabel: "Description",
    descriptionHint:
      "Short-term state that may change calorie needs or food advice for a limited time.",
  },
  health_issue: {
    nameLabel: "Health issue name",
    nameHint: "e.g. Type 2 diabetes, Hypertension",
    descriptionLabel: "Description",
    descriptionHint:
      "Condition used on member profiles when filtering or advising on food choices.",
  },
};

const DEFAULT_COPY: PreferenceFormCopy = {
  nameLabel: "Name",
  nameHint: "Display name shown in the app and admin lists.",
  descriptionLabel: "Description",
  descriptionHint: "Optional details that help people understand this option.",
};

export function preferenceFields(type?: string): ReduxFormField[] {
  const copy = PREFERENCE_FORM_COPY[type || ""] || DEFAULT_COPY;
  return [
    {
      name: "status",
      label: "Active (shown in selectors)",
      component: CheckboxRedux,
      cellProps: { md: 12 },
    },
    {
      name: "en.name",
      label: copy.nameLabel,
      component: InputRedux,
      validate: [required],
      hint: copy.nameHint,
      cellProps: { md: 12 },
      InputProps: { type: "text", placeholder: copy.nameHint },
    },
    {
      name: "description",
      label: copy.descriptionLabel,
      component: InputRedux,
      hint: copy.descriptionHint,
      cellProps: { md: 12 },
      InputProps: {
        type: "text",
        multiline: true,
        minRows: 3,
        placeholder: copy.descriptionHint,
      },
    },
  ];
}

/** @deprecated use preferenceFields(type) */
export const fields: ReduxFormField[] = preferenceFields("food_concern");
