import { useState, type ChangeEvent } from "react";
import axios from "axios";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const REGISTER_API_URL = "/api/auth/register";
const AUTH_TOKEN_KEY = "token";
const USER_ROLE_KEY = "role";

interface RegisterResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    token: string;
    role?: "admin" | "trader";
  };
}

interface RegisterErrorResponse {
  message?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
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
    (field: "name" | "email" | "password") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((currentFormData) => ({
        ...currentFormData,
        [field]: event.target.value,
      }));
    };

  const handleRegister = async () => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await axios.post<RegisterResponse>(
        REGISTER_API_URL,
        formData
      );
      const { token, role } = response.data.data;

      localStorage.setItem(AUTH_TOKEN_KEY, token);

      if (role) {
        localStorage.setItem(USER_ROLE_KEY, role);
      } else {
        localStorage.removeItem(USER_ROLE_KEY);
      }

      navigate(getDashboardPath(role));
    } catch (error) {
      if (axios.isAxiosError<RegisterErrorResponse>(error)) {
        setErrorMessage(
          error.response?.data?.message || "Registration failed. Please try again."
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
        width: 380,
        padding: 4,
        borderRadius: 3,
        backdropFilter: "blur(12px)",
        background: "rgba(0, 0, 0, 0.6)",
        boxShadow: "0 0 30px rgba(0, 255, 234, 0.25)",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      <Typography variant="h5" textAlign="center">
        Create Account
      </Typography>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      <TextField
        label="Name"
        fullWidth
        value={formData.name}
        onChange={handleChange("name")}
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
        label="Email"
        type="email"
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
        onClick={handleRegister}
        disabled={isSubmitting}
        sx={{
          background: "#00ffea",
          color: "#000",
          fontWeight: "bold",
          paddingY: 1.2,
          "&:hover": {
            background: "#00ccb8",
            boxShadow: "0 0 15px #00ffea",
          },
        }}
      >
        {isSubmitting ? "Registering..." : "Register"}
      </Button>

      <Typography
        variant="body2"
        textAlign="center"
        sx={{
          opacity: 0.7,
        }}
      >
        Already have an account?{" "}
        <span
          onClick={() => navigate("/")}
          style={{
            color: "#00ffea",
            cursor: "pointer",
            textShadow: "0 0 8px #00ffea",
          }}
        >
          Login
        </span>
      </Typography>
    </Box>
  );
};

export default Register;
