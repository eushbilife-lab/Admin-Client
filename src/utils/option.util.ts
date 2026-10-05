import { SelectOption } from "@core/basic-components/Select";
import momentTimezone from 'moment-timezone'

const OptionService = {
	getOptions: (range: number, start: number = 0) => {
		let options: SelectOption[] = [];
		for (let i = start; i < range + start; i++) {
			options.push({ value: `${i}`, label: `${i}` });
		}

		return options;
	},
	getMeasurementOptions: (t:Function) => {
		return [
			{ value: "gal", label: t("gal") },
			{ value: "ml", label: t("ml") },
			{ value: "ltr", label: t("ltr") },
			{ value: "oz.fl", label: t("oz.fl") },
			{ value: "gm", label: t("gm") },
			{ value: "mg", label: t("mg") },
			{ value: "mcg", label: t("mcg") },
			{ value: "kg", label: t("kg") },
			{ value: "lb", label: t("lb") },
			{ value: "oz", label: t("oz") },
		]
	},
	getNutrientMeasurementOptions: (t:Function) => {
		return [
			{ value: "Kcal", label: t("Kcal") },
			{ value: "KJ", label: t("KJ") },
			{ value: "gal", label: t("gal") },
			{ value: "ml", label: t("ml") },
			{ value: "ltr", label: t("ltr") },
			{ value: "oz.fl", label: t("oz.fl") },
			{ value: "gm", label: t("gm") },
			{ value: "mg", label: t("mg") },
			{ value: "mcg", label: t("mcg") },
			{ value: "kg", label: t("kg") },
			{ value: "lb", label: t("lb") },
			{ value: "oz", label: t("oz") },
		]
	},
	getCaloriesOptions: () => {
		return [
			{ value: "KCal", label: "KCal" },
			{ value: "KJ", label: "KJ" },
		]
	},
	getTagsOptions: () => {
		return [
			{ value: "vegan", label: "Vegan" },
			{ value: "vegetarian", label: "Vegetarian" },
			{ value: "halal", label: "Halal" },
			{ value: "kosher", label: "Kosher" },
		]
	},
	getProcessingLevel: () => {
		return [
			{ value: 1, label:"Under processed item"},
			{ value: 2, label:"Processed Culinary Ingredients" },
			{ value: 3, label:"Processed Product" },
			{ value: 4, label:"Ultra - Processed Product" },
		]
	},
	getScoresLevel: () => {
		return [
			{ value: "0", label:"0"},
			{ value: "1", label:"1"},
			{ value: "2", label:"2"},
			{ value: "3", label:"3"},
			{ value: "4", label:"4"},
			{ value: "5", label:"5"},
			{ value: "6", label:"6"},
			{ value: "7", label:"7"},
			{ value: "8", label:"8"},
			{ value: "9", label:"9"},
			{ value: "10", label:"10"},
			{ value: "11", label:"11"},
			{ value: "12", label:"12"},
			{ value: "13", label:"13"},
			{ value: "14", label:"14"},
			{ value: "15", label:"15"},
			{ value: "16", label:"16"},
			{ value: "17", label:"17"},
			{ value: "18", label:"18"},
			{ value: "19", label:"19"},
			{ value: "20", label:"20"},
		]
	},
	getSigns: () => {
		return [
			{ value: "+++", label:"+++"},
			{ value: "++", label:"++"},
			{ value: "+", label:"+"},
			{ value: "-", label:"-"},
			{ value: "--", label:"--"},
			{ value: "---", label:"---"},
		]
	},
	getProcessingLevels: () => {
		return [
			{ value: "0", label:"0"},
			{ value: "1", label:"1"},
			{ value: "2", label:"2"},
			{ value: "3", label:"3"},
			{ value: "4", label:"4"},
		]
	},
};

export default OptionService;
