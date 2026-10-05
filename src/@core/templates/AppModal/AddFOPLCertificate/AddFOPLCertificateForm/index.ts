import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";
import CheckboxRedux from "@core/redux-fields/CheckboxRedux";
import InputRedux from "@core/redux-fields/InputRedux";
import { required } from "utils/validate.util";
import FileUploadRedux from "@core/redux-fields/FileUploadRedux";

export { default } from "./AddFOPLCertificateForm";

export const fields: ReduxFormField[] = [
  {
    name: "name",
    label: "Name",
    component: InputRedux,
    validate: [required],
    cellProps: { md: 12 },
  },
  {
    name: "url",
    label: "Image",
    component: FileUploadRedux,
    validate: [required],
    cellProps: { md: 12 },
    FileUploadProps: {
			maxSize: 5,
			accept: [".jpg", ".jpeg", ".png"],
		}
  },
];
