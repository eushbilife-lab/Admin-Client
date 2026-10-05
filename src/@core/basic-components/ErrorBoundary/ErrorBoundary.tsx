import Button from "../Button";
import { config } from "config";
import { Component } from "react";
// import * as Sentry from "@sentry/react";
import { ErrorBoundaryProps, ErrorBoundaryState } from ".";

export default class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}

	// componentDidCatch(error: any, errorInfo: any) {
	// 	Sentry.captureException(error);
	// 	this.setState({ error: error, errorInfo: errorInfo });
	// }

	render() {
		const { children } = this.props;
		const { error, errorInfo } = this.state;

		return (
			<>
				{errorInfo ? (
					<div style={{ textAlign: "center", padding: "20px" }}>
						<h2>Something went wrong.</h2>
						<p>{error && error.toString()}</p>
						<Button
							variant="contained"
							onClick={() => window.location.reload()}
						>
							Retry
						</Button>
						{config.NODE_ENV === "development" && (
							<details
								style={{
									cursor: "pointer",
									textAlign: "initial",
									whiteSpace: "pre-wrap",
								}}
							>
								<div style={{ padding: "20px", wordWrap: "break-word" }}>
									{error && error.toString()}
									<br />
									{errorInfo.componentStack}
								</div>
							</details>
						)}
					</div>
				) : (
					children
				)}
			</>
		);
	}
}
