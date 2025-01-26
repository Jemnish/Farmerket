import React from "react";
import { Link } from "react-router-dom";
import "./UserSideBar.css";

const UserSideBar = ({ activepage }) => {
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location = "/login";
    }
  };
  return (
    <div className="user__sidebar">
      {activepage === "accountsettings" ? (
        <div className="sidebar__one">
          <i class="ri-account-circle-line"></i>
          <span>Account Setting</span>
        </div>
      ) : (
        <Link to={"/profile/accountsettings"} className="stylenone">
          <div className="sidebar__two">
            <i class="ri-account-circle-line"></i>
            <span>Account Setting</span>
          </div>
        </Link>
      )}

      {activepage === "yourorders" ? (
        <div className="sidebar__one">
          <i class="ri-shopping-basket-2-line"></i>
          <span>Purchase History</span>
        </div>
      ) : (
        <Link to={"/profile/yourorders"} className="stylenone">
          <div className="sidebar__two">
          <i class="ri-shopping-basket-2-line"></i>
            <span>Purchase History</span>
          </div>
        </Link>
      )}

      {activepage === "logout" ? (
        <div className="sidebar__one">
          <i class="ri-logout-box-line"></i>
          <span>Logout </span>
        </div>
      ) : (
        <Link
          to={"/profile/accountsettings"}
          className="stylenone"
          onClick={handleLogout}
        >
          <div className="sidebar__two">
            <i class="ri-logout-box-line"></i>
            <span>Logout </span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default UserSideBar;
