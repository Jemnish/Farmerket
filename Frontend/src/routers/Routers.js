import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import MarketPlace from "../pages/MarketPlace";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Thankyou from "../pages/Thankyou";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ProductDetails from "../pages/ProductDetails";

import UserProfile from "../pages/UserProfile";
import AdminOrder from "../pages/admin/AdminOrder";
import AdminDashboard from "../pages/admin/AdminDashboard";
import NoThankyou from "../pages/NoThankyou";
import AdminMyAccount from "../pages/admin/AdminMyAccount";
import AdminProducts from "../pages/admin/AdminProducts";
import Cart from "../pages/Cart";
import UserRoutes from "../protected/UserRoutes";
import AdminRoutes from "../protected/AdminRoutes";
import NormalRoutes from "./NormalRoutes";
import UnAuthorized from "../pages/UnAuthorized";
import AdminUpdateProduct from "../pages/admin/AdminUpdateProduct";
const Routers = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<UnAuthorized />} />

      <Route element={<NormalRoutes />}>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/marketplace" element={<MarketPlace />} />
      </Route>

      <Route element={<UserRoutes />}>
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/thankyou" element={<Thankyou />} />
        <Route path="/nothankyou" element={<NoThankyou />} />
        <Route path="/profile/:activepage" element={<UserProfile />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      <Route element={<AdminRoutes />}>
        <Route path="/admin/update/:id" element={<AdminUpdateProduct />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/order" element={<AdminOrder />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/myaccount" element={<AdminMyAccount />} />
      </Route>
    </Routes>
  );
};

export default Routers;
