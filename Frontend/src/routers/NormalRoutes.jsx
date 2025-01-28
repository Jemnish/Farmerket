import React from "react";
import { Outlet, Navigate } from "react-router-dom";


const NormalRoutes = () => {
  
    // create a router code here
    const user = JSON.parse(localStorage.getItem("userData"));
    
    
    return user != null && user.isAdmin ? <Navigate to="/unauthorized" /> : <Outlet />;
};

export default NormalRoutes;
