//This is the file from where we will handle all products like add , remove, update etc.

const Product = require("../models/productModel"); //imported the product model with define schema
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

// Create Product --Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id; //keeping the id of admin who created the product
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
    // both works same
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

// create Product reviews
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  console.log("productc is", product);

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "reviews Updated/created",
  });
});

// get All reviews of a product
exports.getAllProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler(`Product not found`, 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete review of a product
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler(`Product not found`, 404));
  }
  const reviews = product.reviews.filter((rev) => {
    return rev._id.toString() !== req.query.id.toString();
  });
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg / reviews.length;
  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, numOfReviews },
    {
      new: true,
      runValidators: false,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "product review deleted",
  });
});
