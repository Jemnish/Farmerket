import React from "react";
import { Container, Row, Col } from "reactstrap";
import farmerImg from "../../assets/images/farmer_2.jpg";
import "./StartSelling.css";
import Login from "../../pages/Login/Login";

const StartSellingSection = () => {
  return (
    <section className="become__seller">
      <Container>
        <Row>
          <Col lg="6" md="6" sm="12" className="become__seller-img">
            <img src={farmerImg} alt="" className="w-100" />
          </Col>

          <Col lg="6" md="6" sm="12">
            <h2 className="section__title become__seller-title">
              Do You Want to Earn With Us? So Don't Be Late
            </h2>

            <button
              className="btn become__seller-btn mt-4"
              onClick={() => (window.location.href = "/login")}
            >
              Start Selling
            </button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default StartSellingSection;
