import React, { useState, useEffect } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/MarketPlace.css";
import { Col, Container, Row, Card, CardBody } from "reactstrap";
import { getAllProducts } from "../api/Api";
import { Link } from "react-router-dom";
import "../shared/product-card.css";
import Newsletter from "../shared/Newsletter";
import { useMediaQuery } from "react-responsive";

const MarketPlace = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  // Determine screen size
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  // Adjust the number of products per page based on screen size
  const productsPerPage = isSmallScreen ? 2 : 3;

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        setProducts(res.data.products);
        setTotalProducts(res.data.products.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const startIndex = page * productsPerPage;
  const selectedProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const maxPageNumbersToShow = 3;
  const startPage = Math.max(0, page - Math.floor(maxPageNumbersToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPageNumbersToShow);

  return (
    <>
      <CommonSection title="All Products" />
      <section className="">
        <Container>
          <Row>
            <Col lg="12" className="mb-4">
              {products.length === 0 ? (
                <div className="thankyou d-flex flex-md-column align-items-center">
                  <span>
                    <i className="ri-emotion-sad-line"></i>
                  </span>
                  <h1 className="mb-3 fw-semibold">No Products available!!!</h1>
                </div>
              ) : (
                <div className="product__card">
                  {selectedProducts.map((singleProduct) => (
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
                          <span className="product__type">
                            {singleProduct.productType}
                          </span>
                          <span className="product__rating d-flex align-items-center gap-1">
                            <i className="ri-star-fill"></i>
                            {singleProduct.averageRating === 0 ? (
                              "Not Rated"
                            ) : (
                              <>
                                {singleProduct.averageRating}{" "}
                                <span>
                                  ({singleProduct.productReviews.length})
                                </span>
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
                            <span>/per item</span>
                          </h5>
                          <button className="btn buying__btn">
                            <Link to={`/products/${singleProduct._id}`}>
                              View Details
                            </Link>
                          </button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </Col>

            <Col lg="12">
              <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                {page > 0 && (
                  <span
                    onClick={() => setPage(page - 1)}
                    className="prev__page"
                  >
                    Previous
                  </span>
                )}

                {[...Array(endPage - startPage).keys()].map((number) => (
                  <span
                    key={startPage + number}
                    onClick={() => setPage(startPage + number)}
                    className={
                      page === startPage + number ? "active__page" : ""
                    }
                  >
                    {startPage + number + 1}
                  </span>
                ))}

                {page < totalPages - 1 && (
                  <span
                    onClick={() => setPage(page + 1)}
                    className="next__page"
                  >
                    Next
                  </span>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default MarketPlace;
