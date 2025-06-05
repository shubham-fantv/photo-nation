import React from "react";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    arrow
    classes={{ popper: className }}
    enterTouchDelay={0}
    leaveTouchDelay={6000}
    placement="bottom-start" // your use case
  />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "#000",
    fontSize: "0.95rem",
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid #E2E2E2",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: 320,
    fontWeight: 400,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff",
    "&::before": {
      border: "1px solid #E2E2E2",
      boxSizing: "border-box",
    },
  },

  // Shift arrow right when tooltip is at bottom-start
  '&[data-popper-placement^="bottom-start"] .MuiTooltip-arrow': {
    marginLeft: "5px", // ← adjust this value to move arrow
  },
}));

export default CustomTooltip;
