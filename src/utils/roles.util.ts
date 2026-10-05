import { SelectOption } from "@core/basic-components/Select";

const RoleService = {
	getOptions: (range: number, start: number = 0) => {
		let options: SelectOption[] = [];
		for (let i = start; i < range + start; i++) {
			options.push({ value: `${i}`, label: `${i}` });
		}

		return options;
	},
	getRolesOptions: () => {
		return [
			{ value: "admin", label: "admin" },
			{ value: "data_entry", label: "data_entry" },
			{ value: "data_author", label: "data_author" },
			{ value: "restaurant_user", label: "restaurant_user" },
		];
	},
	getStatusOptions: (t:Function) => {
		return [
			{ value: "active", label: t("Active") },
			{ value: "inactive", label: t("In Active") },
		];
	}
};

export default RoleService;
