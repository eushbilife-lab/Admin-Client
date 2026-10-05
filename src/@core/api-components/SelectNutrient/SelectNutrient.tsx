import React from "react";
import Button from "@mui/material/Button";

interface ButtonComponentProps {
  label: string;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  sx?: object;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  label,
  onClick,
  variant = "outlined",
  color = "primary",
  sx = {},
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      sx={{ ...sx }}
    >
      {label}
    </Button>
  );
};

export default ButtonComponent;
