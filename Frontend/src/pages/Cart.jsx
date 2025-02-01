import React, { useEffect, useState } from "react";
import "../styles/Cart.css";
import CommonSection from "../shared/CommonSection";
import {
  userDetailsApi,
  removeFromCart,
  khaltiPay,
  orders,
  removeAllCart,
} from "../api/Api";
import { toast } from "react-toastify";

const Cart = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [cart, setCart] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  let paidStatus = false;

  const userId = JSON.parse(localStorage.getItem("userData"))?._id;

  function generateTimestampBasedId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 6);
    return timestamp + randomPart;
  }

  useEffect(() => {
    if (userId) {
      const data = { userId };

      userDetailsApi(data)
        .then((res) => {
          if (!res.data.success) {
            toast.error(res.data.message);
          } else {
            setCurrentUser(res.data.userData);
            setCart(
              res.data.userData.cart.map((product) => ({
                ...product,
                quantity: 1,
              }))
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userId]);

  useEffect(() => {
    setProductIds(cart.map((item) => item.productId));
  }, [cart]);

  const handleQuantityChange = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === id ? { ...item, quantity: Number(quantity) } : item
      )
    );
  };

  const handlePayment = async (orderD) => {
    const paymentData = {
      amount: parseInt(orderD.productCost, 10) * 100,
      purchase_order_id: orderD.orderId + "123ads",
      purchase_order_name: "test_user123",
      return_url: "https://localhost:3000/thankyou",
      website_url: "https://localhost:3000/nothankyou",
    };

    try {
      const response = await khaltiPay(paymentData);
      if (response.data.payment_url) {
        const okey = response.data;
        navigator.clipboard.writeText(JSON.stringify(okey));
        removeAllCart({ userId });
        window.location.href = response.data.payment_url;
      } else {
        toast.error("Payment URL is not available.");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Payment initiation failed. Please try again.");
    }
  };

  const handleCheckout = (method) => {
    setPaymentMethod(method);
    setShowPopup(false);

    if (method === "COD") {
      paidStatus = false;
    } else {
      paidStatus = true;
    }


    const orderData = {
      userId,
      productCost: total,
      paidStatus,
      orderId: generateTimestampBasedId(),
      productIds,
    };

    orders(orderData).then((res) => {
      if (!res.data.success) {
        toast.error(res.data.message);
      } else {
        if (method === "Khalti") {
          handlePayment(res.data.orderD);
        } else {
          removeAllCart({ userId });
          window.location.href = "/thankyou";
        }
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handleRemoveProduct = (productId) => {
    const data = { userId, productId };

    removeFromCart(data)
      .then((res) => {
        if (!res.data.success) {
          toast.error(res.data.message);
        } else {
          setCart((prevCart) =>
            prevCart.filter((item) => item.productId !== productId)
          );
          toast.success("Product removed from cart successfully!");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );
  const tax = (subtotal * 0.1).toFixed(2);
  const total = (subtotal + Number(tax)).toFixed(2);

  return (
    <>
      <CommonSection title="Shopping Cart" />
      <div className="cart-page">
        <div className="cart-table-container">
          <table className="cart-table">
            <thead>
              <tr className="w100">
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.productId} className="cart__items">
                  <td>
                    <img
                      src={`http://localhost:5000/products/${item.productImage}`}
                      alt={item.productTitle}
                      className="cart-image"
                    />
                  </td>
                  <td>{item.productTitle}</td>
                  <td>Rs.{Number(item.productPrice).toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.productId, e.target.value)
                      }
                      className="quantity-input"
                    />
                  </td>
                  <td>Rs.{(item.productPrice * item.quantity).toFixed(2)}</td>
                  <td className="delete__btns">
                    <i
                      className="ri-delete-bin-2-fill"
                      onClick={() => handleRemoveProduct(item.productId)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>Rs.{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (10%):</span>
            <span>Rs.{tax}</span>
          </div>
          <div className="summary-row">
            <span>Total:</span>
            <span>Rs.{total}</span>
          </div>
          <button className="checkout-button" onClick={handleSubmit}>
            Checkout
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="payment-popup">
          <div className="popup-content">
            <h3>Select Payment Method</h3>
            <div className="d-flex flex-lg-row">
              <button onClick={() => handleCheckout("Khalti")}>Khalti</button>
              <button onClick={() => handleCheckout("COD")}>
                Cash on Delivery
              </button>
            </div>
            <button onClick={() => setShowPopup(false)} className="btn__false">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
