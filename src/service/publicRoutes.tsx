import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface PublicRouteProps {
  children: React.ReactNode; 
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useSelector((state: any) => state.auth);


  console.log("Public Route: currentGuide =", currentUser);

  
  if (currentUser) {
    return <Navigate to="/auditorium/dashboard" replace />;
  }

  
  return <>{children}</>;
};

export default PublicRoute;
