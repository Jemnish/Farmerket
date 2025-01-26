import React from "react";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../shared/CommonSection";
import StartSellingSection from "../components/About/StartSelling";
import Newsletter from "../shared/Newsletter";
import servicesImg from "../assets/images/services.jpg";
import AboutSection from "../components/About/AboutSection";
const About = () => {
  return (
    <>
      <CommonSection title="About Us" />
      <AboutSection aboutClass="aboutPage" />
      <StartSellingSection />
      <section className="about__page-section pt-1 pb-1">
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12">
              <div className="about__page-img">
                <img src={servicesImg} alt="" className="w-100 rounded-3" />
              </div>
            </Col>

            <Col lg="6" md="6" sm="12">
              <div className="about__page-content">
                <h2 className="section__title">
                  We Are Committed to Providing the Best Services
                </h2>

                <p className="section__description">
                  At Kheti Pati, our dedication to serving farmers goes beyond
                  just offering products. We are here to provide comprehensive
                  support, expert advice, and innovative solutions to help you
                  achieve your farming goals. Your success is our priority.
                </p>

                <p className="section__description">
                  We understand the challenges faced by farmers and strive to
                  address them with tailored services and resources. Whether you
                  need assistance with product selection, farming techniques, or
                  anything else, our team is here to support you every step of
                  the way.
                </p>

                <div className="d-flex align-items-center gap-3 mt-4">
                  <span className="fs-4">
                    <i className="ri-phone-line"></i>
                  </span>

                  <div>
                    <h6 className="section__subtitle">Need Any Help?</h6>
                    <h4>+977 9888888888</h4>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default About;
