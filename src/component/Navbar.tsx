import { Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Login", path: "/" },
  { label: "Register", path: "/register" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        width: "98%",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(12px)",
        background: "rgba(0, 0, 0, 0.6)",
        boxShadow: "0 0 20px rgba(0, 255, 234, 0.15)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <Typography
        variant="h6"
        sx={{
          color: "#00ffea",
          fontWeight: "bold",
          letterSpacing: 1,
          cursor: "pointer",
        }}
      >
        StcokWave
      </Typography>

      {/* Nav Items */}
      <Box sx={{ display: "flex", gap: 3 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Typography
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                cursor: "pointer",
                position: "relative",
                color: isActive ? "#00ffea" : "#aaa",
                transition: "all 0.3s ease",

                "&:hover": {
                  color: "#00ffea",
                  textShadow: "0 0 8px #00ffea",
                },

                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: isActive ? "100%" : "0%",
                  height: "2px",
                  bottom: -4,
                  left: 0,
                  backgroundColor: "#00ffea",
                  transition: "width 0.3s ease",
                },

                "&:hover::after": {
                  width: "100%",
                },
              }}
            >
              {item.label}
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
};

export default Navbar;
