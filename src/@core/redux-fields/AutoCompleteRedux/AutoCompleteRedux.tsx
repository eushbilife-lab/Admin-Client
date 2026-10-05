import AutoComplete from "@core/basic-components/Autocomplete";

export default function AutoCompleteRedux({
	input,
	handleBlur,
	handleFocus,
	meta: { error, touched, invalid },
	InputProps,
	...rest
}: any) {
	const { value, onChange, ...inputRest } = input;

	return (
		<AutoComplete
			{...InputProps}
			{...rest}
			{...inputRest}
			val={value}
			helperText={touched && invalid && error}
			error={touched && invalid && error && true}
			setAddress={onChange}
			onBlur={(e:any) => {
				handleBlur?.(e);
				e.preventDefault();
			}}
			onFocus={(e:any) => {
				handleFocus?.(e);
				e.preventDefault();
			}}
		/>
	);
}
