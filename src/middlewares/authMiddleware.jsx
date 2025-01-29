import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { checkToken } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";

export const AuthMiddleware = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("authToken"));

  const { data, isLoading, isError } = useQuery({
    queryKey: ["authToken", token],
    queryFn: () => (token ? checkToken({ token }) : Promise.reject("No token")),
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!token, // لا تبدأ التحقق إذا لم يكن هناك توكن
  });

  useEffect(() => {
    if (!isLoading && (isError || !data?.success)) {
      localStorage.removeItem("authToken");
      setToken(null); 
      navigate("/login", { replace: true });
    }
  }, [isError, data, isLoading, navigate]);

  if (isLoading) return <p>جارٍ التحقق من البيانات...</p>;

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
