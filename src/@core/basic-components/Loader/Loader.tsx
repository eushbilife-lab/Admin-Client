import Backdrop from "@core/basic-components/Backdrop";
import CircularProgress from "@core/basic-components/CircularProgress";
export default function Loader() {
	return (
		<Backdrop open={true}>
			<CircularProgress />
		</Backdrop>
	);
}
