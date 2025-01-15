import { Navigate, Outlet } from "react-router-dom";

export const AuthMiddleware = () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export const GuestMiddleware = () => {
  const token = localStorage.getItem("authToken");

  if (token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
