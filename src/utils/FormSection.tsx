import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
import Heading from "@core/basic-components/Heading";

export const FormSection = ({
  title,
  fields,
}: {
  title: string;
  fields: any;
}) => (
  <>
    <Heading size="h3" className="text-lg">
      {title}
    </Heading>
    <ReduxFormFields fields={fields} />
    <br />
  </>
);
