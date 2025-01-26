import React from "react";
import "./AdminCommonSection.css";
import { Container, Row, Col } from "reactstrap";

const CommonSection = () => {
  return (
    <section className="common__section">
      <Container>
        <Row>
          <Col lg="12">
            <h1>Admin Page</h1>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CommonSection;
