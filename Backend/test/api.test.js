// superteset requests from api
const request = require("supertest");

const jwt = require("jsonwebtoken");
// importing server files from index
const app = require("../index");

// describing the list of test cases
describe("Testing API ", () => {
  //  Registration testing
  it("POST /api/user/create | Response with body", async () => {
    const response = await request(app).post("/api/user/create").send({
      fullname: "Ramu",
      phone: "9800000023",
      username: "Ramu",
      password: "Ramu123",
      usertype: "SELLER",
    });

    // if condition
    if (!response.body.success) {
      expect(response.body.message).toEqual("Username already in use!!!");
    } else {
      expect(response.body.message).toEqual("User created successfully");
    }
  });

  //  Login testing
  it("POST /api/user/login | Response with body", async () => {
    const response = await request(app).post("/api/user/login").send({
      // login with email and password
      username: "Ramu",
      password: "Ramu123",
    });

    if (!response.body.success) {
      // expect incorrect password)
      expect(response.body.message).toEqual("Password not matched!");
    } else if (!response.body.success) {
      // expect no u
      expect(response.body.message).toEqual("User not exists!");
    } else {
      // expect message
      expect(response.body.message).toEqual("User logged in successfully");

      // expect userData.first name - John
      expect(response.body.userData.fullname).toEqual("Ramu");
    }
  });

  // forgotpassword testing
  it("POST /api/user/forgot_password | Response with body", async () => {
    const response = await request(app).post("/api/user/forgot_password").send({
      // login with email and password
      phone: "9800000123",
    });

    if (!response.body.success) {
      // expect incorrect password)
      expect(response.body.message).toEqual("Phone not found!");
    } else {
      // expect message
      expect(response.body.message).toEqual("OTP sent successfully");
    }
  });

  //   create product testing
  it("POST /api/product/create | Response with body", async () => {
    const response = await request(app).post("/api/product/create").send({
      productTitle: "Basmati Rice",
      productType: "Rice",
      productPrice: "1200",
      productDescription: "Grocery Item",
    });

    if (!response.body.success) {
      // expect incorrect password)
      expect(response.body.message).toEqual("Please upload an image!!!");
    } else {
      // expect message
      expect(response.body.message).toEqual("Product created successfully");
    }
  });

  //   get all products testing
  it("GET /api/product/get_all_products | Response with body", async () => {
    const response = await request(app).get("/api/product/get_all_products");

    if (!response.body.success) {
      // expect incorrect password)
      expect(response.body.message).toEqual("Internal server error");
    } else {
      // expect message
      expect(response.body.message).toEqual("Products fetched successfully");
    }
  });

  //   get me
  it("GET /api/user/getMe | Response with body", async () => {
    const response = await request(app).get("/api/user/getMe").send({
      userId: "60f4b9f1e5c4c00015e5b7ca",
    });

    if (!response.body.success) {
      expect(response.body.message).toEqual("No token provided");
    } else {
      expect(response.body.message).toEqual("User fetched successfully");
    }
  });

  //  delete product by id
  it("DELETE /api/product/delete_product/:id | Response with body", async () => {
    const response = await request(app).delete(
      "/api/product/delete_product/60f4b9f1e5c4c00015e5b7c4"
    );

    if (!response.body.success) {
      // expect incorrect password)
      expect(response.body.message).toEqual("Internal server error");
    } else {
      // expect message
      expect(response.body.message).toEqual("Product deleted successfully!");
    }
  });
  //   add to cart
  it("POST /api/cart/add_to_cart | Response with body", async () => {
    const response = await request(app).post("/api/cart/add_to_cart").send({
      userId: "60f4b9f1e5c4c00015e5b7c2",
      productId: "60f4b9f1e5c4c00015e5b7c4",
    });

    if (!response.body.success) {
      expect(response.body.message).toEqual("User does not exist!");
    } else {
      expect(response.body.message).toEqual(
        "Product added to cart successfully"
      );
    }
  });

  // remove from cart
  it("POST /api/cart/remove_from_cart | Response with body", async () => {
    const response = await request(app)
      .post("/api/cart/remove_from_cart")
      .send({
        userId: "60f4b9f1e5c4c00015e5b7c2",
      });

    if (!response.body.success) {
      expect(response.body.message).toEqual("All fields are required!");
    } else {
      expect(response.body.message).toEqual(
        "Product removed from cart successfully"
      );
    }
  });

  // remove all from cart
  it("POST /api/cart/remove_all_from_cart | Response with body", async () => {
    const response = await request(app)
      .post("/api/cart/remove_all_from_cart")
      .send({
        userId: "60f4b9f1e5c4c00015e5b7c2",
      });

    if (!response.body.success) {
      expect(response.body.message).toEqual("User does not exist!");
    } else {
      expect(response.body.message).toEqual(
        "All products removed from cart successfully"
      );
    }
  });
});
