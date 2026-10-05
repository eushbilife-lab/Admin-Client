import { useClassChipStyles } from ".";
import { Chip as BaseChip } from "@mui/material";

export type ChipProps = React.ComponentProps<typeof BaseChip>;

export default function ClassChip(props: ChipProps) {
  // const classes = useClassChipStyles();
  return (
    <BaseChip
      {...props}
      sx={{
        fontSize: "12px",
        textTransform: "capitalize",
        paddingLeft: "10px",
        paddingRight: "10px",
        ...useClassChipStyles[props.label as string],
      }}
    />
  );
}
