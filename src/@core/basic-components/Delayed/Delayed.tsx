import { DelayedProps } from ".";
import { useEffect, useRef, useState } from "react";

export default function Delayed({ children, wait = 300 }: DelayedProps) {
	let timer: any = useRef(null);
	const [show, setShow] = useState(false);

	useEffect(() => {
		clearTimeout(timer.current);
		timer.current = setTimeout(() => setShow(true), wait);
	}, [wait]);

	useEffect(() => {
		return () => clearTimeout(timer.current);
	}, []);

	return <>{show ? children : null}</>;
}
