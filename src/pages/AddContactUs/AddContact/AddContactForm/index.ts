import PhoneInputRedux from "@core/redux-fields/PhoneInputRedux";
import ReduxFieldArray from "@core/redux-fields/ReduxFieldArray";
import { ReduxFormField } from "@core/redux-fields/ReduxFormFields";

export { default } from "./AddContactForm";

export const fields=(t:Function):ReduxFormField[] =>[
	{
		name: "contacts",
		label: t("Contact Number"),
		component: ReduxFieldArray,
		reduxFormComponent: "FieldArray",
		fieldsArray: [
			{
				name: "phone",
				label: t("Phone"),
				component: PhoneInputRedux,
				cellProps: { md: 6, lg: 6 },
			},
		],
	},
];
