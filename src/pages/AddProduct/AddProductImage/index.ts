import { ReduxFormField } from "@core/redux-fields/ReduxFormFields/index";
import MultiFileUploadRedux from "@core/redux-fields/MultiFileUploadRedux";
export { default } from "./AddProductImage";

export const field: ReduxFormField[] = [
	{
		name: "productImages",
		label: "Media",
		component: MultiFileUploadRedux,
		cellProps: { md: 6 },
		FileUploadProps: {
			maxSize: 5,
			accept: [".jpg", ".jpeg", ".png"],
		},
	},
];