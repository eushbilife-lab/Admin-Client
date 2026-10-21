import { Button as BaseButton } from "@mui/material";

type ButtonProps = React.ComponentProps<typeof BaseButton>;

/** Thin wrapper — styling comes from the shared MUI theme. */
export default function Button(props: ButtonProps) {
  return <BaseButton disableElevation {...props} />;
}
