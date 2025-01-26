import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Test API
export const testApi = () => Api.get("/test");

// Register API
export const registerUserApi = (data) => Api.post("/api/user/create", data);

export const loginUserApi = (data) => Api.post("/api/user/login", data);

export const userDetailsApi = (data) =>
  Api.get("/api/user/details", { params: data });

export const deleteUserApi = (data) =>
  Api.delete("/api/user/delete", { params: data });

export const updateUserApi = (data) => Api.put("/api/user/update", data);

// create prodcuct API
export const createProductApi = (data) => Api.post("/api/product/create", data);

export const deleteProduct = (id) =>
  Api.delete(`/api/product/delete_product/${id}`);

// get all products APi
export const getAllProducts = () => Api.get("/api/product/get_all_products");

export const getSingleProduct = (id) =>
  Api.get(`api/product/get_single_product/${id}`);

export const addtoCart = (data) => Api.post("/api/cart/add_to_cart", data);

export const removeFromCart = (data) =>
  Api.post("/api/cart/remove_from_cart", data);

export const addReview = (data) => Api.post("/api/product/add_review", data);

export const pagination = (page) => Api.get("api/product/pagination", page);

export const booking = (data) => Api.post("/api/booking/create", data);

export const orders = (data) => Api.post("api/user/orders", data);

export const pageCount = () => Api.get("/api/product/pageCount");

export const forgotPasswordApi = (data) =>
  Api.post("/api/user/forgot_password", data);

export const verifyOtpApi = (data) => Api.post("/api/user/verify_otp", data);

export const removeAllCart = (data) =>
  Api.post("/api/cart/remove_all_from_cart", data);

export const khaltiPay = (data) => Api.post("/api/cart/initiate-payment", data);

export const updateProduct = (id, data) =>
  Api.put(`/api/product/update_product/${id}`, data);
