import { ReduxFormField } from "@core/redux-fields/ReduxFormFields/index";
import SelectRedux from "@core/redux-fields/SelectRedux";
import InputRedux from "@core/redux-fields/InputRedux";
import { file, required } from "utils/validate.util";
import RoleService from "utils/roles.util";
import FileUploadRedux from "@core/redux-fields/FileUploadRedux";
export { default } from "./AddNotificationsForm";

export const fields=(t:Function): ReduxFormField[] => [
	{
		name: "media",
		label: "Media",
		validate: [file],
		component: FileUploadRedux,
		cellProps: { md: 4 },
		FileUploadProps: {
			maxSize: 5,
			accept: [".jpg", ".jpeg", ".png"],
		},
	},
	{
		name: "title",
		label: "Title",
		validate: [required],
		component: InputRedux,
		cellProps: { md: 4 },
	},
	{
		name: "url",
		label: "URL",
		component: InputRedux,
		cellProps: { md: 4 },
	},
	{
		name: "content",
		label: "Content",
		validate: [required],
		component: InputRedux,
		cellProps: { md: 12 },
		InputProps: { multiline: true, rows: 5 },
	},
];
