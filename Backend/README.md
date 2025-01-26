## Kheti Pati - Backend

#### Overview

Kheti Pati is a comprehensive platform designed to empower farmers and sellers by providing a streamlined online marketplace. The backend of Kheti Pati is built with Node.js, offering robust functionality for managing agricultural transactions. It handles data management, user authentication, and various API endpoints for product listing, order management, and query support. This ensures that farmers and sellers can efficiently showcase their products, manage sales, and address any queries they may have.

## API Reference

**Cart Api**

#### Add item to cart

```http
POST /api/add_to_cart
```

#### Remove single item from cart

```http
POST /api/remove_from_cart
```

#### Remove all items from cart

```http
POST /api/remove_all_from_cart
```

**Product API**

#### Create product

```http
POST /api/products/create
```

#### Get all products

```http
GET /api/products
```

#### Get single product

```http
GET /api/products/:id
```

#### Pagination products

```http
GET /api/products/pagination
```

#### Add review

```http
PUT /api/products/:id/add_review
```

#### Delete product

```http
DELETE /api/products/:id
```

#### Get page count

```http
GET /api/products/pageCount
```

**User API**

#### Create User

```http
POST /api/users/create
```

#### Login User

```http
POST /api/users/login
```

#### Update User Details

```http
PUT /api/users/update
```

#### Delete User

```http
DELETE /api/users/delete
```

#### Get User Details

```http
GET /api/users/details
```

#### Get User Orders

```http
POST /api/users/orders
```

#### Forgot Password

```http
POST /api/users/forgot_password
```

#### Verify OTP and Set Password

```http
POST /api/users/verify_otp
```

#### Get Current User Details

```http
GET /api/users/getMe
```

## Technologies

- Node.js: Server-side runtime environment.
- Express.js: Backend framework for building web applications.
- MongoDB: NoSQL database for storing data.
- Mongoose: Object Data Modeling (ODM) library for MongoDB and Node.js.

## Tech Stack

**Node.js:** Server-side runtime environment.

**Express.js:** Backend framework for building web applications.

**MongoDB:** NoSQL database for storing data.

**Mongoose:** Object Data Modeling (ODM) library for MongoDB and Node.js.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_CLOUD`: MongoDB connection string.

`JWT_SECRET`: Secret key for JWT authentication.

`PORT`: Port on which the server will run.

## Authors

- [@Jenish](https://github.com/Jemnish)
