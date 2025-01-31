import React from "react";
import "./Footer.css";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import logo from "../../assets/images/cover.png";
import { Link } from "react-router-dom";

const quick__links = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/about",
    display: "About",
  },
  {
    path: "/products",
    display: "Products",
  },
];
const quick__links2 = [
  {
    path: "/newsAndArticles",
    display: "News and Articles",
  },
  {
    path: "/login",
    display: "Login",
  },
  {
    path: "/register",
    display: "Register",
  },
];

export const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="3">
            <div className="logo">
              <img src={logo} alt="" />
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>

              <div className="social__links d-flex align-items-center gap-4">
                <div>
                  <span>
                    <Link to="#">
                      <i className="ri-youtube-line"></i>
                    </Link>
                    <Link to="#">
                      <i className="ri-github-fill"></i>
                    </Link>
                    <Link to="#">
                      <i className="ri-faceboook-circle-line"></i>
                    </Link>
                    <Link to="#">
                      <i className="ri-instagram-line"></i>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </Col>
          <Col lg="3">
            <h5 className="footer__link-title">Discover</h5>
            <ListGroup className="footer__quick-links">
              {quick__links.map((items, index) => (
                <ListGroupItem key={index} className="ps-0 border-0">
                  <Link to={items.path}>{items.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col lg="3">
            <h5 className="footer__link-title">Quick Link</h5>
            <ListGroup className="footer__quick-links">
              {quick__links2.map((items, index) => (
                <ListGroupItem key={index} className="ps-0 border-0">
                  <Link to={items.path}>{items.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col lg="3">
            <h5 className="footer__link-title">Contact</h5>
            <ListGroup className="footer__quick-links">
              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                <h6 className="mb-0 d-flex align-items-center gap-2">
                  <span>
                    <i class="ri-map-pin-line"> </i>
                    Address: 
                  </span>
                </h6>

                <p className="mb-0">Kathmandu, Nepal</p>
              </ListGroupItem>
              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                <h6 className="mb-0 d-flex align-items-center gap-2">
                  <span>
                    <i class="ri-mail-line"> </i>
                    Email: 
                  </span>
                </h6>

                <p className="mb-0">khetipati@gmail.com</p>
              </ListGroupItem>
              <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-3">
                <h6 className="mb-0 d-flex align-items-center gap-2">
                  <span>
                    <i class="ri-phone-fill"> </i>
                    Phone: 
                  </span>
                </h6>

                <p className="mb-0">+977 9810266969</p>
              </ListGroupItem>
            </ListGroup>
          </Col>

          <Col lg='12'>
          <p className="copyright text-center pt-3"> &copy; {year}, design and developed  by Jemnish Badhadur Nepali. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
