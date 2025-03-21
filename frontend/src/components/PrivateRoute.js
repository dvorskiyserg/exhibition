// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const PrivateRoute = ({ adminOnly = false }) => {
//   const { user } = useAuth();

//   if (!user || !user.jwt) {
//     return <Navigate to="/login" />;
//   }

//   if (adminOnly && user.role !== "admin") {
//     return <Navigate to="/profile" />;
//   }

//   return <Outlet />;
// };

// export default PrivateRoute;

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (!user || !user.jwt) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/profile" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
