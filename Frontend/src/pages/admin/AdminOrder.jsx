import React, { useState, useEffect } from "react";
import SiderBar from "../../components/admin/AdminSiderBar/AdminSideBar";
import { getAllProducts } from "../../api/Api";
import { Col, Row, Card, CardBody, CardTitle, CardText } from "reactstrap";
import "../../styles/admin/AdminOrder.css";
import AdminCommonSection from "../../shared/AdminCommonSection";

function AdminOrders() {
  const userId = JSON.parse(localStorage.getItem("userData"));
  
  const [products, setProducts] = useState([]);
  const adminUserId = userId._id; 

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Filter products to get the admin's orders
  const adminOrders = products
    .filter((product) => product.userId === adminUserId)
    .flatMap((product) => product.adminOrders);

  return (
    <div className="admin_dashboard-content">
      <Row>
        <AdminCommonSection />
        <Col lg="4" className="admin__col">
          <SiderBar />
        </Col>
        <Col lg="8">
          <h2 className="admin__order-h2">Your Orders</h2>
          <div className="admin__orders-container">
            {adminOrders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              adminOrders.map((order, index) => (
                <Card key={index} className="admin__order__card">
                  <CardBody>
                    <CardTitle tag="h5">Order ID: {order.orderId}</CardTitle>
                    <CardText>
                      <strong>User ID:</strong> {order.userId}<br />
                      <strong>Product Cost:</strong> Rs.{order.productCost}<br />
                      <strong>Paid Status:</strong> {order.paidStatus ? "Paid" : "Pending"}
                    </CardText>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default AdminOrders;
