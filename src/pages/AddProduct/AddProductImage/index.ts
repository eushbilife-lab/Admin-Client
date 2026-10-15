import { ReduxFormField } from "@core/redux-fields/ReduxFormFields/index";
import MultiFileUploadRedux from "@core/redux-fields/MultiFileUploadRedux";
export { default } from "./AddProductImage";

export const field: ReduxFormField[] = [
	{
		name: "productImages",
		label: "Photos",
		component: MultiFileUploadRedux,
		cellProps: { xs: 12, md: 12 },
		FileUploadProps: {
			maxSize: 5,
			maxCount: 5,
			accept: [".jpg", ".jpeg", ".png"],
			title: "Drop pack photos here or click to browse",
		},
	},
];