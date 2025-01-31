// Import required modules
const path = require("path");
const productModel = require("../models/productModel");
const fs = require("fs");

// Function to create a new product
const createProduct = async (req, res) => {
  // Log the incoming request data for debugging
  console.log(req.body);
  console.log(req.files);

  // Destructure the incoming data from the request body
  const {
    productTitle,
    productType,
    productPrice,
    productDescription,
    productReviews,
    averageRating,
    userId,
  } = req.body;

  // Validate the incoming data
  if (!productTitle || !productType || !productPrice || !productDescription) {
    return res.status(400).json({
      success: false,
      message: "Please enter all the fields!!!",
    });
  } else if (!req.files || !req.files.productImage) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image!!!",
    });
  }

  // Get the uploaded image
  const { productImage } = req.files;

  // Generate a unique name for the image based on the current timestamp
  const imageName = `${Date.now()}-${productImage.name}`;

  // Set the path where the image will be saved
  const imageUploadPath = path.join(
    __dirname,
    `../public/products/${imageName}`
  );

  try {
    // Save the image to the specified path
    await productImage.mv(imageUploadPath);

    // Create a new product with the provided data
    const NewProduct = new productModel({
      userId: userId,
      productTitle: productTitle,
      productType: productType,
      productPrice: productPrice,
      productDescription: productDescription,
      productReviews: productReviews,
      averageRating: averageRating,
      productImage: imageName,
    });

    // Save the new product to the database
    const product = await NewProduct.save();

    // Respond with success message and the created product
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: product,
    });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const updateProduct = async (req, res) => {
  console.log(req.body);

  try {
    // if there is image
    if (req.files && req.files.productImage) {
      // destructuring
      const { productImage } = req.files;

      // upload image to /public/products folder
      // 1. Generate new image name (abc.png) -> (213456-abc.png)
      const imageName = `${Date.now()}-${productImage.name}`;

      // 2. Make a upload path (/path/uplad - directory)
      const imageUploadPath = path.join(
        __dirname,
        `../public/products/${imageName}`
      );

      // Move to folder
      await productImage.mv(imageUploadPath);

      // req.params (id), req.body(updated data - pn,pp,pc,pd), req.files (image)
      // add new field to req.body (productImage -> name)
      req.body.productImage = imageName; // image uploaded (generated name)

      // if image is uploaded and req.body is assingned
      if (req.body.productImage) {
        // Finding existing product
        const existingProduct = await productModel.findById(req.params.id);

        // Searching in the directory/folder
        const oldImagePath = path.join(
          __dirname,
          `../public/products/${existingProduct.productImage}`
        );

        // delete from filesystem
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update the data
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Product updated!",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: error,
    });
  }
};

// Function to add a user review to a product
const addReview = async (req, res) => {
  // Log the incoming request data for debugging
  console.log(req.body);

  // Destructure the incoming review data from the request body
  const { productId, userId, reviewId, comment, rating, username } = req.body;

  // Validate the review data
  if (!userId || !reviewId || comment === "" || rating <= 0 || !username) {
    return res.json({
      success: false,
      message: "Please enter all the fields correctly!",
    });
    // return res.status(401).json({
    //   success: false,
    //   message: "Please enter all the fields correctly!",
    // });
  }

  try {
    // Find the product by its ID
    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
      // return res.status(404).json({
      //   success: false,
      //   message: "Product not found",
      // });
    }

    // Create a new review object
    const review = {
      reviewId,
      comment,
      rating,
      userId,
      username,
      createdAt: new Date(),
    };

    // Add the review to the product's review array
    product.productReviews.push(review);

    // Calculate the new average rating for the product
    const totalRating = product.productReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    product.averageRating =
      product.productReviews.length > 0
        ? parseFloat((totalRating / product.productReviews.length).toFixed(1))
        : 0;
    // Save the updated product to the database
    await product.save();

    // Respond with success message and the updated product
    res.status(200).json({
      success: true,
      message: "Review added successfully",
      product: product,
    });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Function to fetch a single product by its ID
const getSingleProduct = async (req, res) => {
  // Log the incoming request data for debugging
  console.log(req.body);

  // Get the product ID from the URL parameters
  const productId = req.params.id;

  try {
    // Find the product by its ID
    const product = await productModel.findById(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Respond with success message and the fetched product
    res.status(201).json({
      success: true,
      message: "Product fetched successfully",
      product: product,
    });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Function to fetch all products from the database
const getAllProducts = async (req, res) => {
  try {
    // Find all products in the database
    const products = await productModel.find({});

    console.log(products);
    // Respond with success message and the fetched products
    res.status(201).json({
      success: true,
      message: "Products fetched successfully",
      products: products,
    });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// Function to delete a product by its ID
const deleteProduct = async (req, res) => {
  try {
    // Find and delete the product by its ID
    await productModel.findByIdAndDelete(req.params.id);

    // Respond with success message
    res.status(201).json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// Function to fetch products with pagination
const paginationProducts = async (req, res) => {
  // Parse the page number from the request body, or default to 1 if not provided
  const page = parseInt(req.body.page) || 1;
  const limit = 3;

  // Calculate the start index for the current page
  const startIndex = (page - 1) * limit;

  try {
    // Fetch the total number of products in the database
    const totalProducts = await productModel.countDocuments();

    // Fetch products with pagination
    const products = await productModel
      .find()
      .skip(startIndex) // Skip the appropriate number of documents
      .limit(limit) // Limit the results to the specified number
      .exec(); // Execute the query

    // Calculate the remaining number of products
    const remainingProducts = totalProducts - (startIndex + products.length);
    const pages = Math.ceil(totalProducts / limit);

    // Respond with success message, fetched products, and total pages
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products: products,
      pages: pages,
    });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Function to count the total number of products
const pageCount = async (req, res) => {
  try {
    // Count the total number of products in the database
    const count = await productModel.countDocuments();

    // Respond with success message and the total product count
    res.status(201).json({
      success: true,
      message: "Total Number of Products",
      data: count,
    });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const mobilePaginationProducts = async (req, res) => {
  // Parse the page number from the request body, or default to 1 if not provided
  const page = parseInt(req.query.page) || 1;
  const limit = 6;

  // Calculate the start index for the current page
  const startIndex = (page - 1) * limit;

  try {
    // Fetch the total number of products in the database
    const totalProducts = await productModel.countDocuments();

    // Fetch products with pagination
    const products = await productModel
      .find()
      .skip(startIndex) // Skip the appropriate number of documents
      .limit(limit) // Limit the results to the specified number
      .exec(); // Execute the query

    // Calculate the remaining number of products
    const remainingProducts = totalProducts - (startIndex + products.length);
    const pages = Math.ceil(totalProducts / limit);

    // Respond with success message, fetched products, and total pages
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products: products,
      pages: pages,
    });
  } catch (error) {
    // Handle any errors and respond with an error message
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Export all the functions so they can be used in other files
module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  paginationProducts,
  pageCount,
  deleteProduct,
  addReview,
  updateProduct,
  mobilePaginationProducts,
};
