
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useSelector((state: any) => state.auth);

 
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;

