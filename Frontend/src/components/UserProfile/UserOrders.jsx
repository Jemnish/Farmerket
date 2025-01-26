import React, { useEffect, useState } from "react";
import "./UserOrders.css";
import { toast } from "react-toastify";
import { userDetailsApi } from "../../api/Api";

const UserOrders = () => {
  const [currentUser, setCurrentUser] = useState({});
  const userId = JSON.parse(localStorage.getItem("userData"));
  const data = {
    userId: userId._id,
  };

  useEffect(() => {
    userDetailsApi(data)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          setCurrentUser(res.data.userData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [data]);

  return (
    <div className="user-orders">
      <h2>Your Orders</h2>
      <div className="orders-list">
        {currentUser.orders && Array.isArray(currentUser.orders) && currentUser.orders.length > 0 ? (
          currentUser.orders.map((order, index) => (
            <div key={index} className="order-item">
              <h4>Order ID: {order.orderId}</h4>
              <p><strong>Total Cost:</strong> Rs.{order.productCost}</p>
              <p><strong>Payment Status:</strong> {order.paidStatus ? "Success" : "Pending"}</p>
              
            </div>
          ))
        ) : (
          <p>No orders history found.</p>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
