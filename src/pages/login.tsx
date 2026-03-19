import { useState, type ChangeEvent } from "react";
import axios from "axios";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LOGIN_API_URL = "/api/auth/login";
const AUTH_TOKEN_KEY = "token";
const USER_ROLE_KEY = "role";

interface LoginResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    token: string;
    role?: "admin" | "trader";
  };
}

interface LoginErrorResponse {
  message?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDashboardPath = (role?: "admin" | "trader") => {
    if (role === "trader") {
      return "/trader-dashboard";
    }

    return "/admin-dashboard";
  };

  const handleChange =
    (field: "email" | "password") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((currentFormData) => ({
        ...currentFormData,
        [field]: event.target.value,
      }));
    };

  const handleLogin = async () => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await axios.post<LoginResponse>(LOGIN_API_URL, formData);
      const { token, role } = response.data.data;

      localStorage.setItem(AUTH_TOKEN_KEY, token);

      if (role) {
        localStorage.setItem(USER_ROLE_KEY, role);
      } else {
        localStorage.removeItem(USER_ROLE_KEY);
      }

      navigate(getDashboardPath(role));
    } catch (error) {
      if (axios.isAxiosError<LoginErrorResponse>(error)) {
        setErrorMessage(
          error.response?.data?.message || "Login failed. Please try again."
        );
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        width: 350,
        padding: 4,
        borderRadius: 3,
        backdropFilter: "blur(12px)",
        background: "rgba(0, 0, 0, 0.6)",
        boxShadow: "0 0 30px rgba(0, 255, 234, 0.2)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" textAlign="center">
        Login
      </Typography>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={formData.email}
        onChange={handleChange("email")}
        InputLabelProps={{ style: { color: "#00ffea" } }}
        sx={{
          input: { color: "#00ffea" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#00ffea" },
            "&:hover fieldset": { borderColor: "#00ffea" },
            "&.Mui-focused fieldset": { borderColor: "#00ffea" },
          },
        }}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={formData.password}
        onChange={handleChange("password")}
        InputLabelProps={{ style: { color: "#00ffea" } }}
        sx={{
          input: { color: "#00ffea" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#00ffea" },
            "&:hover fieldset": { borderColor: "#00ffea" },
            "&.Mui-focused fieldset": { borderColor: "#00ffea" },
          },
        }}
      />

      <Button
        variant="contained"
        onClick={handleLogin}
        disabled={isSubmitting}
        sx={{
          background: "#00ffea",
          color: "#000",
          fontWeight: "bold",
          "&:hover": {
            background: "#00ccb8",
            boxShadow: "0 0 15px #00ffea",
          },
        }}
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </Button>

      <Typography variant="body2" textAlign="center" sx={{ opacity: 0.7 }}>
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          style={{
            color: "#00ffea",
            cursor: "pointer",
            textShadow: "0 0 8px #00ffea",
          }}
        >
          Register
        </span>
      </Typography>
    </Box>
  );
};

export default Login;
