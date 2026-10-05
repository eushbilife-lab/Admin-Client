import RoleCheckbox from "@core/basic-components/RoleCheckbox";

export default function RoleCheckboxRedux({
  input,
  handleBlur,
  handleFocus,
  CheckBoxProps,
  checked,
  handleChange,
  ...rest
}: any) {

  return (
    <RoleCheckbox
      {...CheckBoxProps}
      {...rest}
      {...input}
      checked={checked}
      onBlur={(e) => {
        handleBlur?.(e);
        e.preventDefault();
      }}
      onChange={(e:any) => {
				// input.onChange(e.target.value);
				handleChange?.({...rest.info},e.target.name);
			}}
      onFocus={(e) => {
        handleFocus?.(e);
        e.preventDefault();
      }}
    />
  );
}
