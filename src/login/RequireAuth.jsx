import { Navigate } from "react-router-dom";

const RequireAuth = ({ element }) => {
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    return <Navigate  to="/login" />;
  }
  return element;
};

export default RequireAuth;
