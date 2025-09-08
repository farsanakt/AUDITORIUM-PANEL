
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


type ProtectedRouteProps = {
  children: React.ReactNode;
};

const VendorProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useSelector((state: any) => state.auth);

 
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

export default VendorProtectedRoute;

