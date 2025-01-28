import React, { useRef } from "react";
import { Container, Row, Button } from "reactstrap";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/images/cover.png";
import "./Header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const nav_links = [
  { path: "/", display: "Home" },
  { path: "/about", display: "About" },
  { path: "/marketplace", display: "Marketplace" },
  { path: "/contact", display: "Contact" },
];

const Header = () => {
  const menuRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("userData"));
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.clear();
      window.location = "/login";
    }
  };

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  return (
    <header className="header mb-3">
      <Container>
        <Row>
          <div className="nav_wrapper d-flex align-items-center justify-content-between">
            {/* Logo */}
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>

            {/* Menu */}
            <div className="navigation " ref={menuRef} onClick={toggleMenu}>
              <ul className="menu d-flex align-items-center gap-5">
                {nav_links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "active_link" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Section */}
            <div className="nav__right d-flex align-items-center gap-4">
              {user ? (
                <div className="dropdown">
                  <button
                    className="btn dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.fullname}
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <li>
                      <NavLink
                        to="/profile/accountsettings"
                        className="dropdown-item"
                      >
                        Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/cart" className="dropdown-item">
                        Your cart
                      </NavLink>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item">
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="nav__btns d-flex align-items-center gap-4">
                  <Button className="btn secondary__btn">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button className="btn primary__btn">
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
              <span className="mobile__menu  " onClick={toggleMenu}>
                <i className="ri-menu-line"></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
