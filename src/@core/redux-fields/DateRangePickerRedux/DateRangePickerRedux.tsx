import DateRangePicker from "@core/basic-components/DateRangePicker";

export default function DateRangePickerRedux({
	input,
	InputProps,
	handleBlur,
	handleFocus,
	DateRangePickerProps,
	meta: { error, touched, invalid },
	...rest
}: any) {
	const { onChange, ...inputRest } = input;

	return (
		<DateRangePicker
			{...DateRangePickerProps}
			{...rest}
			value={input.value}
			onChange={onChange}
			InputFieldProps={{
				...InputProps,
				...inputRest,
				helperText: touched && invalid && error,
				error: touched && invalid && error && true,
				onBlur: (e:any) => {
					handleBlur?.(e);
					e.preventDefault();
				},
				onFocus: (e:any) => {
					handleFocus?.(e);
					e.preventDefault();
				},
			}}
		/>
	);
}
