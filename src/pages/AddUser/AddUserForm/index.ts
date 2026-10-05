import { ReduxFormField } from "@core/redux-fields/ReduxFormFields/index";
import InputRedux from "@core/redux-fields/InputRedux";
import SelectRedux from "@core/redux-fields/SelectRedux";
import PhoneInputRedux from "@core/redux-fields/PhoneInputRedux";
import { status } from "utils/status.util";
export { default } from "./AddUserForm";

export const fields=(t:Function): ReduxFormField[] => [
	{
		name: "currentStatus",
		label: "Status",
		component: SelectRedux,
		cellProps: { md: 3 },
		SelectProps: { options: status(t) },
	  },
	  {
		name: "firstName",
		label: "First Name",
		component: InputRedux,
		cellProps: { md: 3 },
	  },
	  {
		name: "lastName",
		label: "Last Name",
		component: InputRedux,
		cellProps: { md: 3 },
	  },
	  {
		name: "email",
		label: "Email",
		component: InputRedux,
		cellProps: { md: 3 },
	  },
	  {
		name: "phone",
		label: t("Phone"),
		component: PhoneInputRedux,
		cellProps: { md: 3 },
	  },
];
