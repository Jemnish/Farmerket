import React from "react";
import { useParams } from "react-router-dom";
import UserSideBar from "../components/UserProfile/UserSideBar";
import AccountSettings from "../components/UserProfile/AccountSettings";
import UserOrders from "../components/UserProfile/UserOrders";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../shared/CommonSection";

import "../styles/UserProfile.css";

const Profile = () => {
  const { activepage } = useParams();

  return (
    <>
      <CommonSection title="Profile" />
      <section className="profile__section">
        <Container>
          <Row>
            <Col lg="4" className="left__bar">
              <UserSideBar activepage={activepage} />
            </Col>
            <Col lg="7" className="right__bar">
              {activepage === "accountsettings" && <AccountSettings />}
              {activepage === "yourorders" && <UserOrders />}
              {console.log(activepage)}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Profile;
