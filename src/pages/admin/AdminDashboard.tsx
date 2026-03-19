import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const AUTH_TOKEN_KEY = "token";
const PROFILE_API_URL = "/api/auth/profile";
const SOCKET_SERVER_URL =
  import.meta.env.VITE_SOCKET_SERVER_URL ?? "http://localhost:8080";

const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,
});

interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
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
        width: "70%",
        padding: 4,
        borderRadius: 3,
        backdropFilter: "blur(12px)",
        background: "rgba(0, 0, 0, 0.6)",
        boxShadow: "0 0 30px rgba(0, 255, 234, 0.2)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mx: "auto",
        mt: { xs: 12, md: 14 },
      }}
    >
      <Typography variant="h5" textAlign="center" sx={{ fontWeight: 700 }}>
        Admin Dashboard
      </Typography>
      <Typography
        variant="body2"
        textAlign="center"
        sx={{ opacity: 0.7, mb: 2 }}
      >
        Monitor registered users and watch new accounts appear in real time.
      </Typography>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          background: "rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(0, 255, 234, 0.18)",
          boxShadow: "0 0 20px rgba(0, 255, 234, 0.15)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#00ffea", fontWeight: 600, mb: 2 }}
        >
          Users
        </Typography>

        {isLoading ? (
          <Box
            sx={{
              py: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ color: "#00ffea" }} />
          </Box>
        ) : users.length === 0 ? (
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            No users available yet.
          </Typography>
        ) : (
          <TableContainer
            sx={{
              borderRadius: 2,
              border: "1px solid rgba(0, 255, 234, 0.14)",
              background: "rgba(0, 255, 234, 0.04)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "#00ffea",
                      fontWeight: 700,
                      borderColor: "rgba(0, 255, 234, 0.14)",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#00ffea",
                      fontWeight: 700,
                      borderColor: "rgba(0, 255, 234, 0.14)",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#00ffea",
                      fontWeight: 700,
                      borderColor: "rgba(0, 255, 234, 0.14)",
                    }}
                  >
                    Role
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        color: "#00ffea",
                        fontWeight: 600,
                        borderColor: "rgba(0, 255, 234, 0.1)",
                      }}
                    >
                      {user.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "rgba(0, 255, 234, 0.8)",
                        borderColor: "rgba(0, 255, 234, 0.1)",
                      }}
                    >
                      {user.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "rgba(0, 255, 234, 0.8)",
                        textTransform: "capitalize",
                        borderColor: "rgba(0, 255, 234, 0.1)",
                      }}
                    >
                      {user.role}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
