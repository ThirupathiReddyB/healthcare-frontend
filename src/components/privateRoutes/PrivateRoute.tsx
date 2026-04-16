import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  if (Boolean(token) === true) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
};

export default PrivateRoute;
