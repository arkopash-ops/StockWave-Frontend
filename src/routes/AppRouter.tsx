import BaseBackground from "../component/BaseBackground";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";

import Navbar from "../component/Navbar";

import Login from "../pages/Login";
import Register from "../pages/Register";

import AdminDashboard from "../pages/admin/AdminDashboard";
import TraderDashboard from "../pages/trader/TraderDashboard";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <BaseBackground>
        <Navbar />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoutes allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/trader-dashboard"
            element={
              <ProtectedRoutes allowedRoles={["trader"]}>
                <TraderDashboard />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </BaseBackground>
    </BrowserRouter>
  );
};

export default AppRouter;
