export { default } from "./PrivateRoute";

export interface PrivateRouteProps {
	roles?: string[];
	children: React.ReactNode;
	path:String
}
