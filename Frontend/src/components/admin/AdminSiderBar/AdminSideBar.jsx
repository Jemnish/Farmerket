import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./AdminSIdebar.css";
import LogoutIcon from "../../../assets/icons/logout.svg";
import DashboardIcon from "../../../assets/icons/dashboard.svg";
import ShippingIcon from "../../../assets/icons/shipping.svg";
import ProductIcon from "../../../assets/icons/product.svg";
import UserIcon from "../../../assets/icons/user.svg";

function SideBar() {
  const sidebar_menu = [
    {
      id: 1,
      icon: DashboardIcon,
      path: "/admin/dashboard",
      title: "Dashboard",
    },
    {
      id: 2,
      icon: ProductIcon,
      path: "/admin/order",
      title: "Orders",
    },
    {
      id: 3,
      icon: ShippingIcon,
      path: "/admin/products",
      title: "Products",
    },
    {
      id: 4,
      icon: UserIcon,
      path: "/admin/myaccount",
      title: "My account",
    },
  ];
  const location = useLocation();

  const [active, setActive] = useState(1);
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.clear();
      window.location = "/login";
    }
  };

  useEffect(() => {
    sidebar_menu.forEach((element) => {
      if (location.pathname === element.path) {
        setActive(element.id);
      }
    });
  }, [location.pathname]);

  const __navigate = (id) => {
    setActive(id);
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-items">
          {sidebar_menu.map((item, index) => (
            <div key={index} onClick={() => __navigate(item.id)}>
              <Link
                to={item.path}
                className={
                  item.id === active ? "sidebar-item-active" : "sidebar-item"
                }
              >
                <img
                  src={item.icon}
                  alt={`icon-${item.icon}`}
                  className="sidebar-item-icon"
                />
                <span className="sidebar-item-label">{item.title}</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="sidebar-footer" onClick={handleLogout}>
          <span className="sidebar-item-label" onClick={handleLogout}>
            Logout
          </span>
          <img
            src={LogoutIcon}
            alt="icon-logout"
            className="sidebar-item-icon"
          />
        </div>
      </div>
    </nav>
  );
}

export default SideBar;
