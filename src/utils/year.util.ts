import { SelectOption } from "@core/basic-components/Select";
const YearService = {
	getMaxYearsOptions: (max: number): SelectOption[] => {
		let years: SelectOption[] = [];
		let year = new Date().getFullYear();
		for (let i = 0; i < max; i++) {
			let value = (year - i).toString();
			years.push({ value, label: value });
		}
		return years;
	},
};
export default YearService;
