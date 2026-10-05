import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

interface CheckBoxOwnProps {
  label?: string | React.ReactElement;
  FormControlLabelProps?: Omit<
    React.ComponentProps<typeof FormControlLabel>,
    "control"
  >;
  onClick?: (e: React.MouseEvent) => void;
  sign?: React.ReactElement;
  isSelected?: boolean; // Add the custom prop for selection state
}

export type CheckBoxProps = CheckBoxOwnProps &
  React.ComponentProps<typeof Checkbox>;

// Define the props interface for the StyledChipBox
const StyledChipBox = styled("div", {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  display: "flex", 
  alignItems: "center",
  flexWrap: "wrap", 
  padding: "14px 18px 8px 18px",
  borderRadius: "20px",
  fontSize: "0.73rem",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  border: isSelected ? "none" : `1px solid ${theme.palette.grey[400]}`,
  backgroundColor: isSelected ? "#FFAC1C" : theme.palette.background.paper,
  color: isSelected
    ? theme.palette.common.white 
    : theme.palette.text.primary, 
  gap: "2px",
  marginTop:"20px",
  marginLeft:"8px",
    // Hover state
  "&:hover": {
    backgroundColor: isSelected ? "#FFAC1C" : theme.palette.action.hover,
    borderColor: theme.palette.primary.light,
  },

  // Focused or active state
  "&:active": {
    backgroundColor: theme.palette.action.selected,
    borderColor: theme.palette.primary.dark,
  },

  // Disabled state
  "&.Mui-disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    borderColor: theme.palette.action.disabledBackground,
    cursor: "not-allowed",
  },
}));


export default function BaseChipbox({
  label = "",
  FormControlLabelProps,
  onClick,
  sign,
  isSelected,
  ...rest
}: CheckBoxProps) {
  const { t } = useTranslation();

  return (
    <FormControlLabel
      control={
        <Checkbox
          {...rest}
          sx={{
            display: "none", // Hide checkbox, using the chip for display
          }}
        />
      }
      label={
        <StyledChipBox isSelected={isSelected} onClick={onClick}>
          {" "}
          {sign}
          {t(`${label}`)}
        </StyledChipBox>
      }
      {...FormControlLabelProps}
    />
  );
}
