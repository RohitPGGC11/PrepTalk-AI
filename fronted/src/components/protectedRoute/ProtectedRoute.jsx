import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { userContext } from "../../contexts/userContext";
import { toast } from "react-toastify";

const ProtectedLayout = () => {
  const { Token,loading } = useContext(userContext);
  if (loading) return null; // Wait for auth check

  if (!Token || Token==="null" || Token ==="undefined") {
    toast.error("login first");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;