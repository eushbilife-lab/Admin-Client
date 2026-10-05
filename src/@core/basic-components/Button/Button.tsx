import { Button as BaseButton } from "@mui/material";

type ButtonProps = React.ComponentProps<typeof BaseButton>;

export default function Button(props: ButtonProps) {
  return <BaseButton {...props} />;
}
