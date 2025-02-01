import React, { useEffect, useState } from "react";
import "../styles/ProductDetails.css";
import { useParams } from "react-router-dom";
import { getSingleProduct } from "../api/Api";
import DOMPurify from "dompurify";
import avatar from "../assets/images/avatar.jpg";
import { Col, Row, Container, Form, ListGroup } from "react-bootstrap";
import Newsletter from "../shared/Newsletter";
import { addReview } from "../api/Api";
import { toast } from "react-toastify";
import Buying from "../components/Buying/Buying";

const ProductDetails = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("userData"));

  const userId = user._id;
  const username = user.fullname;

  const [product, setProduct] = useState({});
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // validation with a pop up message
  var validate = () => {
    var isValid = true;
    if (rating === 0) {
      isValid = false;
    }
    if (comment.trim() === "") {
      isValid = false;
    }
    return isValid;
  };

  function generateTimestampBasedId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 6);
    return timestamp + randomPart;
  }

  const reviewId = generateTimestampBasedId();

  useEffect(() => {
    console.log(id);
    getSingleProduct(id.toString())
      .then((res) => {
        setProduct(res.data.product);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  let avgRating = 0;
  let numRatings = 0;
  const params = useParams();
  const productId = params.id;

  if (product.productReviews && product.productReviews.length > 0) {
    const sum = product.productReviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    numRatings = product.productReviews.length;
    avgRating = sum / numRatings;
  }

  const handleRating = (value) => {
    setRating(value);
  };

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const submitReview = (e) => {
    e.preventDefault();

    var isValidated = validate();
    if (!isValidated) {
      // pop up message saying enter all the fields
      toast.error("Please enter all the fields");
      return;
    }
    const sanitizedComment = DOMPurify.sanitize(comment);

    const data = {
      productId,
      userId,
      reviewId,
      sanitizedComment,
      rating,
      username,
    };

    addReview(data).then((res) => {
      console.log(data);
      if (res.data.success == false) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        getSingleProduct(id.toString())
          .then((res) => {
            setProduct(res.data.product);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <div className="product__content">
                <img src={`${product.productImage}`} alt="" />
                <div className="product__info">
                  <h1>{product.productTitle}</h1>
                  <div className="d-flex align-items-center gap-5">
                    <span className=" product__info_i ">
                      <i className="ri-equalizer-line "></i>{" "}
                      {product.productType}
                    </span>
                    <span> Rs.{product.productPrice}</span>

                    <span className="tour__rating d-flex align-items-center gap-1">
                      <i className="ri-star-s-fill"></i>
                      <span>
                        {avgRating === 0
                          ? "Not rated yet"
                          : `${avgRating} (${numRatings})`}
                      </span>
                    </span>
                  </div>
                  <h6 className="product__h6">Description</h6>
                  <div className="tour__extra-details">
                    <span>
                      {DOMPurify.sanitize(product.productDescription)}
                    </span>
                  </div>
                </div>

                <div className="product__reviews mt-4">
                  <h4>Reviews</h4>

                  <Form>
                    <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => handleRating(star)}
                          className={
                            star <= rating ? "filled-star" : "outlined-star"
                          }
                        >
                          {star} <i className="ri-star-s-fill"></i>
                        </span>
                      ))}
                    </div>

                    <div className="review__input">
                      <input
                        type="text"
                        placeholder="Share your thoughts"
                        onChange={handleComment}
                      />
                      <button
                        className="btn primary__btn text-white"
                        type="submit"
                        onClick={submitReview}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>

                  <ListGroup className="user_reviews mt-3">
                    {product.productReviews &&
                      product.productReviews.map((review) => (
                        <div className="review__item" key={review._id}>
                          <img src={avatar} alt="" />

                          <div className="w-100">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h5>{review.username}</h5>
                                <p>
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              <span className="d-flex align-items-center">
                                {review.rating}{" "}
                                <i className="ri-star-s-fill"></i>
                              </span>
                            </div>

                            <h6>{DOMPurify.sanitize(review.comment)}</h6>
                          </div>
                        </div>
                      ))}
                  </ListGroup>
                </div>
              </div>
            </Col>

            <Col lg="4">
              <Buying product={product}></Buying>
            </Col>
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default ProductDetails;
