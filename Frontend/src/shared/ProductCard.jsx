import React, { useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./product-card.css";
import { pagination } from "../api/Api";

const ProductCard = ({ page }) => {
  // 1. State for all fetched products
  const [products, setProducts] = useState([]);

  // 2. Call API initially (Page load) - Set all fetched products to state (1)
  useEffect(() => {
    pagination(page)
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);

  return (
    <div className="product__card_home">
      {products.map((singleProduct) => (
        <Card key={singleProduct._id}>
          <div className="product__img">
            <img
              src={`http://localhost:5000/products/${singleProduct.productImage}`}
              alt="Product"
              className="product-img"
            />
          </div>
          <CardBody>
            <div className="card__top d-flex align-items-center justify-content-between">
              <span className="product__type">{singleProduct.productType}</span>
              <span className="product__rating d-flex align-items-center gap-1">
                <i className="ri-star-fill"></i>
                {singleProduct.averageRating === 0 ? (
                  "Not Rated"
                ) : (
                  <>
                    {singleProduct.averageRating}{" "}
                    <span>({singleProduct.productReviews.length})</span>
                  </>
                )}
              </span>
            </div>

            <h5 className="product__title">
              <Link to={`/products/${singleProduct._id}`}>
                {singleProduct.productTitle}
              </Link>
            </h5>

            <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
              <h5>
                Rs.{singleProduct.productPrice}{" "}
                <span> /per {singleProduct.productType === "food" ? "unit" : "day"}</span>
              </h5>
              <button className="btn buying__btn">
                <Link to={`/products/${singleProduct._id}`}>View Details</Link>
              </button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ProductCard;
