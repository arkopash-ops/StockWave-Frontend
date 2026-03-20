import axios from "axios";
import { useEffect, useState } from "react";
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
const ASSET_API_URL = "/api/asset";
const SOCKET_SERVER_URL =
  import.meta.env.VITE_SOCKET_SERVER_URL ?? "http://localhost:8080";

const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,
});

interface IAssets {
  id: string;
  name: string;
  symbol: string;
  type: string;
  price: number;
  change: number;
}

interface AssetListResponse {
  assets?: IAssets[];
}

const TraderDashboard = () => {
  const [assets, setAssets] = useState<IAssets[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    const loadAssets = async () => {
      try {
        const response = await axios.get<AssetListResponse>(ASSET_API_URL, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        setAssets(
          Array.isArray(response.data.assets) ? response.data.assets : [],
        );
      } catch (error) {
        console.error("Failed to load assets:", error);
        setErrorMessage("Unable to load assets right now.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();

    socket.connect();

    const handleNewAssets = (asset: IAssets) => {
      setAssets((previousAssets) => {
        const assetIndex = previousAssets.findIndex(
          (existingAsset) => existingAsset.id === asset.id,
        );

        if (assetIndex === -1) {
          return [asset, ...previousAssets];
        }

        return previousAssets.map((existingAsset) =>
          existingAsset.id === asset.id ? asset : existingAsset,
        );
      });
    };

    socket.on("asset", handleNewAssets);

    return () => {
      socket.off("asset", handleNewAssets);
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
        Trader Dashboard
      </Typography>
      <Typography
        variant="body2"
        textAlign="center"
        sx={{ opacity: 0.7, mb: 2 }}
      >
        Track live stock and crypto prices as market updates stream in.
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
          Stocks/Crypto
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
        ) : assets.length === 0 ? (
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            No assets available yet.
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
                    Symbol
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#00ffea",
                      fontWeight: 700,
                      borderColor: "rgba(0, 255, 234, 0.14)",
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#00ffea",
                      fontWeight: 700,
                      borderColor: "rgba(0, 255, 234, 0.14)",
                    }}
                    align="right"
                  >
                    Price
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#00ffea",
                      fontWeight: 700,
                      borderColor: "rgba(0, 255, 234, 0.14)",
                    }}
                    align="right"
                  >
                    Change
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow
                    key={asset.id}
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
                      {asset.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "rgba(0, 255, 234, 0.8)",
                        fontWeight: 600,
                        borderColor: "rgba(0, 255, 234, 0.1)",
                      }}
                    >
                      {asset.symbol}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "rgba(0, 255, 234, 0.8)",
                        textTransform: "capitalize",
                        borderColor: "rgba(0, 255, 234, 0.1)",
                      }}
                    >
                      {asset.type}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#00ffea",
                        fontWeight: 600,
                        borderColor: "rgba(0, 255, 234, 0.1)",
                      }}
                      align="right"
                    >
                      {asset.price.toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{
                        color:
                          asset.change >= 0 ? "#79fd6d" : "#ff7878",
                        fontWeight: 700,
                        borderColor: "rgba(0, 255, 234, 0.1)",
                      }}
                      align="right"
                    >
                      {asset.change >= 0
                        ? `+${asset.change.toFixed(2)}%`
                        : `${asset.change.toFixed(2)}%`}
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

export default TraderDashboard;
