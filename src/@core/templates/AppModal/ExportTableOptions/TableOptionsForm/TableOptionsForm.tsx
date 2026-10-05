import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Button from "@core/basic-components/Button";
import { change, reduxForm } from "redux-form";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import CheckboxRedux from "@core/redux-fields/CheckboxRedux";
import ReduxFormComponent from "@core/basic-components/ReduxFormComponent";

function TableOptionsForm({ handleSubmit }: any) {
	const dispatch = useAppDispatch();
	const data = useAppSelector((state) => state.modal.data);
	const { table_data = [] } = data;
	const keys = Object.keys(table_data?.[0] || {});

	useEffect(() => {
		keys.forEach((el) => dispatch(change("TableOptionsForm", el, true)));
	}, [keys, dispatch]);

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<Grid container spacing={2}>
					{keys.map((el: any, index: any) => (
						<Grid item key={index}>
							<ReduxFormComponent
								name={el}
								label={el}
								type="checkbox"
								color="secondary"
								component={CheckboxRedux}
							/>
						</Grid>
					))}
				</Grid>
				<br />
				<Button
					type="submit"
					color="success"
					variant="contained"
					disabled={table_data.length === 0}
				>
					Export
				</Button>
			</form>
		</div>
	);
}
export default reduxForm({ form: "TableOptionsForm" })(TableOptionsForm);
