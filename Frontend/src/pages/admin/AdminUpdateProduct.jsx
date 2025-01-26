import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import SiderBar from "../../components/admin/AdminSiderBar/AdminSideBar";
import { useParams } from "react-router-dom";
import AdminCommonSection from "../../shared/AdminCommonSection";
import { getSingleProduct, updateProduct } from "../../api/Api";
import { toast } from "react-toastify";

const AdminUpdateProduct = () => {
  const { id } = useParams();

  // State hooks for managing product details
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");

  // State for managing images
  const [productNewImage, setProductNewImage] = useState(null);
  const [previewNewImage, setPreviewNewImage] = useState(null);
  const [oldImage, setOldImage] = useState("");

  // Fetch the product details when the component mounts
  useEffect(() => {
    getSingleProduct(id)
      .then((res) => {
        const product = res.data.product;
        setProductName(product.productTitle);
        setProductPrice(product.productPrice);
        setProductCategory(product.productCategory);
        setProductDescription(product.productDescription);
        setOldImage(product.productImage);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to fetch product details.");
      });
  }, [id]);

  // Handle image selection
  const handleImage = (event) => {
    const file = event.target.files[0];
    setProductNewImage(file);
    setPreviewNewImage(URL.createObjectURL(file));
  };

  // Handle form submission to update the product
  const handleUpdateProduct = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productPrice", productPrice);
    formData.append("productCategory", productCategory);
    formData.append("productDescription", productDescription);

    if (productNewImage) {
      formData.append("productImage", productNewImage);
    }

    updateProduct(id, formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
        }
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An error occurred while updating the product.");
        }
      });
  };

  return (
    <div className="dashboard-content">
      <Row>
        <AdminCommonSection />

        <Col lg="4" className="admin__col">
          <SiderBar />
        </Col>
        <Col lg="8">
          <h2>
            Update product for{" "}
            <span className="text-danger">'{productName}'</span>
          </h2>

          <div className="d-flex gap-3">
            <form onSubmit={handleUpdateProduct}>
              <label htmlFor="productName">Product Name</label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="form-control"
                type="text"
                placeholder="Enter your product name"
              />

              <label className="mt-2" htmlFor="productPrice">
                Product Price
              </label>
              <input
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="form-control"
                type="number"
                placeholder="Enter your product price"
              />

              <label className="mt-2" htmlFor="productCategory">
                Choose category
              </label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="form-control"
              >
                <option value="beer">Beer</option>
                <option value="wine">Wine</option>
                <option value="whiskey">Whiskey</option>
                <option value="vodka">Vodka</option>
                <option value="rum">Rum</option>
              </select>

              <label className="mt-2" htmlFor="productDescription">
                Enter description
              </label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="form-control"
                placeholder="Enter product description"
              ></textarea>

              <label className="mt-2" htmlFor="productImage">
                Choose product Image
              </label>
              <input
                onChange={handleImage}
                type="file"
                className="form-control"
              />

              <button type="submit" className="btn btn-primary w-100 mt-2">
                Update Product
              </button>
            </form>
            <div className="image section">
              <h6>Previewing old image</h6>
              <img
                src={`http://localhost:5000/products/${oldImage}`}
                alt="product"
                height={"90px"}
                width={"200px"}
                className="img-fluid rounded-4 object-fit-cover"
              />
              {previewNewImage && (
                <>
                  <h6 className="mt-3">New preview image</h6>
                  <img
                    src={previewNewImage}
                    alt="product"
                    height={"150px"}
                    width={"200px"}
                    className="img-fluid rounded-4 object-fit-cover"
                  />
                </>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminUpdateProduct;
