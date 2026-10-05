const ObjectService = {
	getFullName: (person: any, allowMX: boolean = true) => {
		let fullName = "";

		if (person) {
			const { title, last_name, first_name } = person;

			if (title) fullName += `${title} `;
			if (first_name) fullName += `${first_name} `;
			if (last_name) fullName += `${last_name}`;
		}

		return fullName.trim();
	},
	getObjectPropertiesSum: (values: any) => {
		let sum = 0;

		for (const key in values) {
			if (Object.prototype.hasOwnProperty.call(values, key)) {
				const element = values[key];
				sum += Number(element);
			}
		}

		return sum;
	},
};

export default ObjectService;
