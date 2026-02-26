import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { userContext } from "../../contexts/userContext";

const ProtectedLayout = () => {
  const { Token,loading } = useContext(userContext);
  console.log("Token:", Token);

  if (loading) return null; // Wait for auth check

  if (!Token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;