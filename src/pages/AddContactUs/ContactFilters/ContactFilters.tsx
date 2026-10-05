import { config } from "config";
import { change, reset } from "redux-form";
import { ContactFiltersProps, fields } from ".";
import { useAppDispatch } from "redux/hooks";
import { contactActions } from "redux/slices/contact";
import MyForm from "@core/templates/MyForm";
import PersistFilters from "@core/templates/PersistFilters";
import { format } from "date-fns";

export default function ContactFilters({type}:ContactFiltersProps) {
	const form = "ContactFiltersForm";
	const dispatch = useAppDispatch();
	const onClickReset = () => {
		const default_page_size = config.PAGE_SIZE;
		dispatch(contactActions.resetFilters(type));
		dispatch(reset(form));
		dispatch(change(form, "page_size", default_page_size));
	};
	const handleSubmit = (values: any) => {
		const default_page_size = config.PAGE_SIZE;
		let data: any = { page: 1, page_size: default_page_size };
		const {
			date,
			page_size,
		} = values;

		if (page_size) data.page_size = Number(page_size);
		if (date && date.date[0] && date.date[1]) {
			data.end_date = format(new Date(date.date[1]), "yyyy-MM-dd");
			data.start_date = format(new Date(date.date[0]), "yyyy-MM-dd");
		}
		dispatch(contactActions.setFilters({data,type}))
	};

	return (
		<div className="filters">
			<MyForm
				form={form}
				myFields={fields}
				onSubmit={handleSubmit}
				onClickReset={onClickReset}
			/>
			<br/>
			<PersistFilters form={form} type={type} />
		</div>
	);
}
