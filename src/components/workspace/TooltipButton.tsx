import { IconButton, type IconButtonProps } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { Tooltip } from "../ui/tooltip";

export default function TooltipButton({
  children,
  label,
  onClick,
  isDisabled = false,
  variant = "outline",
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  variant?: IconButtonProps["variant"];
}) {
  return (
    <Tooltip content={label}>
      <IconButton
        aria-label={label}
        onClick={onClick}
        disabled={isDisabled}
        variant={variant}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}
