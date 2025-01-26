import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const UserRoutes = () => {
  // get user data form local storage
  const user = JSON.parse(localStorage.getItem("userData"));

  // check user if yes then check if admin or not
  return user != null && !user.isAdmin ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default UserRoutes;
