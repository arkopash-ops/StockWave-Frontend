import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  Alert,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

const AUTH_TOKEN_KEY = "token";
const PROFILE_API_URL = "/api/auth/profile";
const SOCKET_SERVER_URL = "http://localhost:5000";

const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,
});

interface IUser {
  id: string;
  name: string;
  email: string;
}

interface UserListResponse {
  data?: IUser[];
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    const loadUsers = async () => {
      try {
        const response = await axios.get<UserListResponse>(PROFILE_API_URL, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        setUsers(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error("Failed to load users:", error);
        setErrorMessage("Unable to load users right now.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();

    socket.connect();

    const handleNewUser = (user: IUser) => {
      setUsers((previousUsers) => {
        const alreadyExists = previousUsers.some(
          (existingUser) => existingUser.id === user.id,
        );

        return alreadyExists ? previousUsers : [user, ...previousUsers];
      });
    };

    socket.on("newUser", handleNewUser);

    return () => {
      socket.off("newUser", handleNewUser);
      socket.disconnect();
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 960,
        mt: { xs: 12, md: 14 },
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          backdropFilter: "blur(14px)",
          background: "rgba(0, 0, 0, 0.62)",
          border: "1px solid rgba(0, 255, 234, 0.18)",
          boxShadow: "0 0 30px rgba(0, 255, 234, 0.16)",
          color: "#00ffea",
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8, mb: 3 }}>
          Monitor registered users and watch new accounts appear in real time.
        </Typography>

        {errorMessage ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        ) : null}

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            background: "rgba(0, 255, 234, 0.05)",
            border: "1px solid rgba(0, 255, 234, 0.14)",
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Users
          </Typography>

          {isLoading ? (
            <Box
              sx={{
                py: 5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress sx={{ color: "#00ffea" }} />
            </Box>
          ) : users.length === 0 ? (
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              No users available yet.
            </Typography>
          ) : (
            <List disablePadding>
              {users.map((user, index) => (
                <ListItem
                  key={user.id}
                  divider={index !== users.length - 1}
                  sx={{
                    px: 0,
                    borderColor: "rgba(0, 255, 234, 0.1)",
                  }}
                >
                  <ListItemText
                    primary={user.name}
                    secondary={user.email}
                    primaryTypographyProps={{
                      sx: { color: "#00ffea", fontWeight: 600 },
                    }}
                    secondaryTypographyProps={{
                      sx: { color: "rgba(0, 255, 234, 0.72)" },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
