import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Thankyou.css";
const Thankyou = () => {
  // I want a toast message when entered this page
  useEffect(() => {
    toast.success("Your order is placed successfully");
  }, []);

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="pt-5 text-center">
            <div className="thankyou">
              <span>
                <i class="ri-checkbox-circle-line"></i>
              </span>
              <h1 className="mb-3 fw-semibold">Thank You</h1>
              <h3 className="mb-4"> your order is placed.</h3>

              <Button className="btn primary__btn w-25">
                <Link to="/home"> Back to home</Link>
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Thankyou;
