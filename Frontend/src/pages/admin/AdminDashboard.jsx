import React from "react";
import SiderBar from "../../components/admin/AdminSiderBar/AdminSideBar";
import Lottie from "lottie-react";
import animation from "../../assets/json/ani.json";
import { Col, Row } from "reactstrap";
import "../../styles/admin/AdminDashboard.css";
import AdminCommonSection from "../../shared/AdminCommonSection";

function AdminDashboard() {
  return (
    <div className="dashboard-content">
      <Row>
        <AdminCommonSection />

        <Col lg="4" className="admin__col">
          <SiderBar />
        </Col>
        <Col lg="8">
          <div className="admin__welcome-section">
            <h1 className="admin__welcome-text">Welcome to Your Farmerket Admin Dashboard!</h1>
            <p className="admin__welcome-subtext">
              Here, you can manage all aspects of your products, orders, and customers.
            </p>
            <Lottie animationData={animation} className="admin__animation"/>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default AdminDashboard;
