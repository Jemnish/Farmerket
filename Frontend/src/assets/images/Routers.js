import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MarketPlace from "../pages/MarketPlace";
import About from "../pages/About";
import Contact from "../pages/Contact";
import News from "../pages/News";
import ProductDetails from "../pages/ProductDetails";
import SearchResultList from "../pages/SearchResultList";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<Register />} />
      <Route path="/marketplace" element={<MarketPlace />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/news" element={<News />} />
      
      <Route path="/product/search" element={<SearchResultList />} />
    </Routes>
  );
};

export default Routers;
