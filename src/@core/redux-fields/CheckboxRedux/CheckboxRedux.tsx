import BaseCheckbox from "@core/basic-components/BaseCheckbox";
export default function CheckboxRedux({
	input,
	handleBlur,
	handleFocus,
	CheckBoxProps,
	...rest
}: any) {
	return (
		<BaseCheckbox
			{...CheckBoxProps}
			{...rest}
			{...input}
			// checked={input.value === true}
			checked={input?.value}
			onBlur={(e) => {
				handleBlur?.(e);
				e.preventDefault();
			}}
			onFocus={(e) => {
				handleFocus?.(e);
				e.preventDefault();
			}}
		/>
	);
}
