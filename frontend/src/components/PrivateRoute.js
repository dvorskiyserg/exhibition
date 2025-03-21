import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ adminOnly = false }) => {
  const { user } = useAuth();

  if (!user || !user.jwt) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
