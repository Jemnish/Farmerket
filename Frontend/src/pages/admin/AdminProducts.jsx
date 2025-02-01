import React, { useState, useEffect } from "react";
import SiderBar from "../../components/admin/AdminSiderBar/AdminSideBar";
import { createProductApi, deleteProduct, getAllProducts } from "../../api/Api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { Col, Row } from "reactstrap";

import "../../styles/admin/AdminProducts.css";
import AdminCommonSection from "../../shared/AdminCommonSection";

function MyProduct() {
  // 1. State for all fetched products
  const [products, setProducts] = useState([]); // array

  const userId = JSON.parse(localStorage.getItem("userData"));

  // 2. Call API initially (Page Load) - Set all fetch products to state (1)
  useEffect(() => {
    getAllProducts()
      .then((res) => {
        // response : res.data.products (All Products)
        setProducts(res.data.products);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // State for input fields
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productType, setProductType] = useState("");
  const [productDescription, setProductDescription] = useState("");

  // State for image
  const [productImage, setProductImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  // image upload handler
  const handleImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type! Please upload a PNG or JPEG image.");
        return;
      }
      setProductImage(file); // for backend
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // make a form data (txt, file)
    const formData = new FormData();
    formData.append("productTitle", productTitle);
    formData.append("productPrice", productPrice);
    formData.append("productType", productType);
    formData.append("productDescription", productDescription);
    formData.append("productImage", productImage);
    formData.append("userId", userId._id);

    // make a api call
    createProductApi(formData)
      .then((res) => {
        // For successful api
        if (res.status === 201) {
          toast.success(res.data.message);
          // reload
          window.location.reload();
        }
      })
      .catch((error) => {
        // for error status code

        if (error.response) {
          if (error.response.status === 400) {
            toast.warning(error.response.data.message);
          } else if (error.response.status === 500) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
        } else {
          toast.error("Something went wrong!");
        }
      });
  };

  // handle delete product
  const handleDelete = (id) => {
    const confirmDialog = window.confirm("Are you sure want to delete?");
    if (confirmDialog) {
      // calling api
      deleteProduct(id)
        .then((res) => {
          if (res.status === 201) {
            toast.success(res.data.message);
            // reload
            window.location.reload();
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            toast.error(error.response.data.message);
          }
        });
    }
  };

  return (
    <div className="dashboard-content">
      <Row>
        <AdminCommonSection />
        <Col lg="4" className="admin__col">
          <SiderBar />
        </Col>
        <Col lg="8" style={{ height: "100vh", overflowY: "scroll" }}>
          <div className="admin__product_container mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Your Products</h3>

              <button
                type="button"
                className="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                style={{ backgroundColor: "green" }}
              >
                Add Product
              </button>

              <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        Create a new product!
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <form>
                        <div className="mb-3">
                          <label className="form-label">Product Name</label>
                          <input
                            onChange={(e) => setProductTitle(e.target.value)}
                            type="text"
                            className="form-control"
                            placeholder="Enter product name"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Product Price</label>
                          <input
                            onChange={(e) => setProductPrice(e.target.value)}
                            type="number"
                            className="form-control"
                            placeholder="Enter product price"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Choose category</label>
                          <select
                            onChange={(e) => setProductType(e.target.value)}
                            className="form-control"
                          >
                            <option value="plants">Rental</option>
                            <option value="electronics">
                              Fruits & Veggies
                            </option>
                            <option value="gadgets">Milk Product</option>
                            <option value="furniture">Crops</option>
                            <option value="furniture">Tractor</option>
                            <option value="furniture">Fertilizers</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            Enter description
                          </label>
                          <textarea
                            onChange={(e) =>
                              setProductDescription(e.target.value)
                            }
                            className="form-control"
                            rows="3"
                          ></textarea>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            Choose product Image
                          </label>
                          <input
                            onChange={handleImage}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            className="form-control"
                          />
                        </div>
                        {/* Preview Image */}
                        {previewImage && (
                          <div className="mb-3">
                            <img
                              src={previewImage}
                              alt="preview"
                              className="img-fluid rounded"
                            />
                          </div>
                        )}
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        onClick={handleSubmit}
                        type="button"
                        className="btn btn-primary"
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <table className="table table-striped justify-content-center">
              <tr>
                <th width={120}>Product Image</th>
                <th>Product Name</th>
                <th width={2}>Product Price</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
              <tbody>
                {products.map((singleProduct) => {
                  if (singleProduct.userId === userId._id) {
                    return (
                      <tr key={singleProduct._id}>
                        <td width={20}>
                          <img
                            width="60"
                            height="60"
                            src={`${singleProduct.productImage}`}
                            alt={singleProduct.productTitle}
                            className="img-thumbnail"
                          />
                        </td>
                        <td>{singleProduct.productTitle}</td>
                        <td width={2}>{singleProduct.productPrice}</td>
                        <td>{singleProduct.productType}</td>
                        <td width={50}>{singleProduct.productDescription}</td>
                        <td>
                          <Link
                            style={{ backgroundColor: "green" }}
                            to={`/admin/update/${singleProduct._id}`}
                            className="btn btn-primary btn-sm "
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(singleProduct._id)}
                            className="btn btn-danger btn-sm ms-2"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default MyProduct;
