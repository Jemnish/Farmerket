import React from "react";
import { useLocation } from "react-router-dom";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Routers from "../../routers/Routers";

const Layout = () => {
  const location = useLocation();

  const excludedRoutes = [
    "/admin/order",
    "/admin/products",
    "/admin/myaccount",
    "/admin/dashboard",
    "/admin/update/:id",
  ];

  const shouldExcludeHeaderFooter = excludedRoutes.some((route) => {
    // Replace :id with a regular expression that matches any string of characters
    const routePattern = route.replace(":id", "[^/]+");
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(location.pathname);
  });

  return (
    <>
      {!shouldExcludeHeaderFooter && <Header />}
      <Routers />
      {!shouldExcludeHeaderFooter && <Footer />}
    </>
  );
};

export default Layout;
