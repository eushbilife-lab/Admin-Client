import ReduxFormFields from "@core/redux-fields/ReduxFormFields";

type FormSectionProps = {
  title: string;
  fields: any;
  hint?: string;
  step?: number | string;
  className?: string;
};

export const FormSection = ({
  title,
  fields,
  hint,
  step,
  className = "",
}: FormSectionProps) => (
  <section className={`add-food__section ${className}`.trim()}>
    <header className="add-food__section-head">
      <h2 className="add-food__section-title">
        {step != null ? <span className="add-food__section-step">{step}</span> : null}
        {title}
      </h2>
      {hint ? <p className="add-food__section-hint">{hint}</p> : null}
    </header>
    <ReduxFormFields fields={fields} />
  </section>
);
