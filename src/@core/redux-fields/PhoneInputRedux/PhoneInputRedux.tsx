import PhoneInput from "@core/basic-components/PhoneInput";

export default function PhoneInputRedux({
	id,
	input,
	label,
	handleBlur,
	handleFocus,
	PhoneInputProps,
	meta: { error, touched, invalid },
}: any) {
	return (
		<PhoneInput
			{...PhoneInputProps}
			id={id}
			name={input?.name}
			specialLabel={label}
			value={input?.value?.value}
			helperText={touched && invalid && error}
			error={touched && invalid && error && true}
			onBlur={(e) => {
				handleBlur?.(e);
				e.preventDefault();
			}}
			onFocus={(e) => {
				handleFocus?.(e);
				e.preventDefault();
			}}
			onChange={(value: any, data: any, _e: any, formattedValue: any) => {
				input.onChange({ value, data, formattedValue });
			}}
		/>
	);
}
