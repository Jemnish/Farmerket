import React from "react";
import { Container, Row, Col } from "reactstrap";
import farmerImg from "../../assets/images/farmer_1.jpg";
import "./AboutSection.css";

const AboutSection = ({ aboutClass }) => {
  return (
    <section
      className="about__section pt-3 pb-3"
      style={
        aboutClass === "aboutPage"
          ? { marginTop: "0px" }
          : { marginTop: "280px" }
      }
    >
      <Container>
        <Row>
          <Col lg="6" md="6">
            <div className="about__section-content">
              <h4 className="section__subtitle">About Us</h4>
              <h2 className="section__title">Welcome to Kheti Pati</h2>
              <p className="section__description">
                At Kheti Pati, we are dedicated to revolutionizing agriculture
                with innovative solutions and quality products. Our mission is
                to empower farmers by providing them with the tools, resources,
                and support they need to succeed. With a commitment to
                sustainability and excellence, we strive to be your trusted
                partner in farming.
              </p>

              <div className="about__section-item d-flex align-items-center">
                <p className="section__description d-flex align-items-center gap-2">
                  <i className="ri-checkbox-circle-line"></i> Quality products
                  from trusted sources.
                </p>

                <p className="section__description d-flex align-items-center gap-2">
                  <i className="ri-checkbox-circle-line"></i> Expert advice and
                  support for your farming needs.
                </p>
              </div>

              <div className="about__section-item d-flex align-items-center">
                <p className="section__description d-flex align-items-center gap-2">
                  <i className="ri-checkbox-circle-line"></i> Sustainable
                  practices for a better tomorrow.
                </p>

                <p className="section__description d-flex align-items-center gap-2">
                  <i className="ri-checkbox-circle-line"></i> A wide range of
                  tools and resources tailored to your needs.
                </p>
              </div>
            </div>
          </Col>

          <Col lg="6" md="6">
            <div className="about__img">
              <img src={farmerImg} alt="" className="w-100" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;
