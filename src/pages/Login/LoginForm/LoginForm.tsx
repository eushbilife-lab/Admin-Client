import { fields } from ".";
import { reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import Button from "@core/basic-components/Button";
import ReduxFormFields from "@core/redux-fields/ReduxFormFields";
function LoginForm({ handleSubmit }: any) {
	return (
		<div className="login-form">
			<form onSubmit={handleSubmit}>
				<ReduxFormFields fields={fields} />
				<Link className="login-forgot" to="/forgot-password">
					Forgot Password?
				</Link>
				<Button fullWidth variant="contained" color="primary" type="submit">
					Login Now
				</Button>
			</form>
		</div>
	);
}
export default reduxForm({ form: "LoginForm" })(LoginForm);
