import BaseChipbox from "@core/basic-components/BaseChipbox";

export default function ChipboxRedux({
  input,
  handleBlur,
  handleFocus,
  CheckBoxProps,
  sign,
  onClick, 
  ...rest
}: any) {
  return (
    <BaseChipbox
      {...CheckBoxProps}
      {...rest}
      {...input}
      checked={input.value === true}
      onBlur={(e) => {
        handleBlur?.(e);
        e.preventDefault();
      }}
      onFocus={(e) => {
        handleFocus?.(e);
        e.preventDefault();
      }}
      onClick={(e) => {
        onClick?.(e);
      }}
      sign={sign}
    />
  );
}
