import { email, required } from "utils/validate.util";
import InputRedux from "@core/redux-fields/InputRedux";
import { ReduxFormField } from "@core/redux-fields/ReduxFormFields/index";

export { default } from "./LoginForm";

export const fields: ReduxFormField[] = [
	{
		name: "email",
		label: "Email",
		validate: [required, email],
		component: InputRedux,
		cellProps: { lg: 12 },
		InputProps: { type: "email" },
	},
	{
		name: "password",
		label: "Password",
		validate: [required],
		component: InputRedux,
		cellProps: { lg: 12 },
		InputProps: { showIcon: true, type: "password" },
	},
];
