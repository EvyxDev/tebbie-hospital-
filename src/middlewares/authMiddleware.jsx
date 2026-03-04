import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { checkToken } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import LoaderComponent from "../components/LoaderComponent";

export const AuthMiddleware = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const is_medical_service = localStorage.getItem("is_medical_service");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["authToken", token],
    queryFn: () => (token ? checkToken({ token }) : Promise.reject("No token")),
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!token && is_medical_service === "false",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (is_medical_service === "false") {
      if (!isLoading && (isError || (data && !data.success))) {
        localStorage.removeItem("authToken");
        navigate("/login", { replace: true });
      }
    }
  }, [isError, data, isLoading, navigate, is_medical_service, token]);

  if (token && is_medical_service === "false" && isLoading) {
    return <LoaderComponent />;
  }

  if (!token) return null;

  return <Outlet />;
};

export const GuestMiddleware = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  return <Outlet />;
};
