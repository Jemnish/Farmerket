import React, { useState } from "react";

import "./Buying.css";
import { Button } from "reactstrap";
import { toast } from "react-toastify";
import { FormGroup, ListGroup, ListGroupItem } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { addReview, addtoCart } from "../../api/Api";

const Buying = ({ product }) => {
  const [buyingName, setBuyingName] = useState("");
  const [buyingPhone, setBuyingPhone] = useState("");
  const [buyingAddress, setBuyingAddress] = useState("");

  const handleBuyingName = (e) => {
    setBuyingName(e.target.value);
  };
  const handleBuyingPhone = (e) => {
    setBuyingPhone(e.target.value);
  };
  const handleBuyingAddress = (e) => {
    setBuyingAddress(e.target.value);
  };


  const data = JSON.parse(localStorage.getItem("userData"));
  const userId = data._id;
  const serviceFee = 100;
  const totalAmount = serviceFee + parseInt(product.productPrice);
  const { id } = useParams();


  const handleSubmit = () => {
    if (buyingName === "" || buyingPhone === "" || buyingAddress === "") {
      toast.error("Please fill all the fields");
      return;
    }
    console.log(id);

    const buyingData = {
      userId,
      productId: id,
    };
    addtoCart(buyingData).then((res) => {
      if (res.data.success === true) {
        toast.success("Product added to cart");
      }else{
        toast.error(res.data.message);
      }
    }
    );

  };
  return (
    <div className="buying">
      <div className="buying__top d-flex align-items-center justify-content-between">
        <h3>
          Rs.{product.productPrice} <span>/per item</span>
        </h3>
      </div>
      {/* ===================== Buying form  end ====================== */}
      <div className="buying__form">
        <h5>Information</h5>
        <div className="buying__info-form">
          <FormGroup>
            <input
              onChange={handleBuyingName}
              type="text"
              className="form-control"
              placeholder="Full Name"
            />
          </FormGroup>
          <FormGroup>
            <input
              onChange={handleBuyingPhone}
              type="text"
              className="form-control"
              placeholder="Phone"
            />
          </FormGroup>
          <FormGroup>
            <input
              onChange={handleBuyingAddress}
              type="text"
              className="form-control"
              placeholder="Address"
            />
          </FormGroup>
        </div>
      </div>
      {/* ===================== Buying form start ====================== */}

      {/* ===================== Buying bottom start ====================== */}
      <div className="buying__bottom mt-2">
        <ListGroup>
          <ListGroupItem className="border-0 px-0 d-flex align-items-center justify-content-between">
            <h5 className="d-flex align-items-center gap-1">
              Rs.{product.productPrice}
              <i class="ri-close-line"></i>
              per item
            </h5>
            <span>Rs.{product.productPrice}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 d-flex align-items-center justify-content-between">
            <h5>Service Charge</h5>
            <span>Rs.100</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 d-flex align-items-center justify-content-between total">
            <h5>Total</h5>
            <span>{totalAmount}</span>
          </ListGroupItem>
        </ListGroup>
        <Button className="btn primary__btn w-100 mt-4" onClick={handleSubmit}>
          Add to Cart
        </Button>
      </div>

      {/* ===================== Buying bottom start ====================== */}
    </div>
  );
};

export default Buying;
