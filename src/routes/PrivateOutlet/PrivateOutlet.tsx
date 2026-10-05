import { PrivateOutletProps } from ".";
import { useAppSelector } from "redux/hooks";
import useEffectOnce from "hooks/useEffectOnce";
import ToasterService from "utils/toaster.util";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateOutlet({ roles = [] }: PrivateOutletProps) {
	let authenticated = true;
	const user = useAppSelector((state) => state.auth.user);

	if (!user) authenticated = false;
	if (roles.length > 0 && !roles.includes(user.role))
		authenticated = false;

	useEffectOnce(() => {
		if (!authenticated)
			setTimeout(() => ToasterService.showError("Please Login First"), 0);
	});

	return <>{authenticated ? <Outlet /> : <Navigate to="/" />}</>;
}
