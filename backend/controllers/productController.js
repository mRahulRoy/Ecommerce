//This is the file from where we will handle all products like add , remove, update etc.

const Product = require("../models/productModel"); //imported the product model with define schema
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

// Create Product --Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;//keeping the id of admin who created the product
  const product = await Product.create(req.body);
  console.log(product);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const api_Feature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await api_Feature.query;
  res.status(200).json({ message: "Success", products, productCount });
});

// Update Products --Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  console.log("Product Before Update: ", product);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product Not Found",
    });
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  console.log("Product After Update : ", product);

  res.status(201).json({
    success: true,
    product,
  });
});
// Delete Product --Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not found", 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Deleted Succesfuly",
  });
});

// Get Single Product  --Admin
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not found", 404));

    // return res.status(404).json({
    //     success: false,
    //     message: "Product Not Found",
    // })
  }

  res.status(200).json({
    success: true,
    product,
  });
});
