import React, { type ReactNode } from "react";
import { Box } from "@mui/material";

interface BaseBackgroundProps {
  children: ReactNode;
}

const BaseBackground: React.FC<BaseBackgroundProps> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: `linear-gradient(
          135deg,
          #000000 0%,      /* pure black */
          #0a0a12 20%,     /* very dark purple */
          #1a1a2e 40%,     /* dark bluish purple */
          #2e2c4c 60%,     /* medium purple/blue */
          #505075 80%,     /* soft bluish tone */
          #7878a0 100%,    /* dark bluish highlight */
          #505075 80%,     /* soft bluish tone */
          #2e2c4c 60%,     /* medium purple/blue */
          #1a1a2e 40%,     /* dark bluish purple */
          #0a0a12 20%,     /* very dark purple */
          #000000 0%       /* pure black */
        );`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        color: "#00ffea",
        backgroundSize: "400% 400%",
        animation: "gradientShift 30s ease infinite",
      }}
    >
      {children}

      <style>
        {`
              @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
        `}
      </style>
    </Box>
  );
};

export default BaseBackground;
