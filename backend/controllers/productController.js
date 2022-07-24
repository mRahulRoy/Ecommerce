//This is the file from where we will handle all products like add , remove, update etc.
//Mine understanding for this file status: All Good.

const Product = require("../models/productModel"); //imported the product model with define schema
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

/* ------------------------------ Create Product by Admin ------------------------------*/

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  //creating the key 'user' in req object and Storing the user's id in it.
  req.body.user = req.user.id; //keeping the id of admin who created the product

  const product = await Product.create(req.body); //storing the body data in the db.

  res.status(201).json({
    success: true,
    product,
  });
});

/* ------------------------------ Get All Product by Admin ------------------------------*/

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  // return next(new ErrorHandler("Product Not Found",500));
  const resultPerPage = 4;
  const productCount = await Product.countDocuments();
  //Filters and search functionality
  const api_Feature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await api_Feature.query;

  let filteredProductsCount = products.length;
  api_Feature.pagination(resultPerPage);

  /*Here assigning  api_Feature.query in :products becouse we are saving all the data in query variabe in the  api_Feature class . using clone function here becouse we are executing a same query twice , at line 34 and 40 , so  mongoose is throwing the error " Query was already executed: Product.find({ price: { '$gte': 0, 
  '$lte': 25000 } })"*/
  
  products = await api_Feature.query.clone();
  res
    .status(200)
    .json({
      message: "Success",
      products,
      productCount,
      resultPerPage,
      filteredProductsCount,
    });
});

/* ------------------------------ Update Product by Admin ------------------------------*/

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

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

  res.status(201).json({
    success: true,
    product,
  });
});

/* ------------------------------ Delete Product by Admin ------------------------------*/

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not found", 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product Deleted Succesfuly",
  });
});

/* ------------------------------ Get Single Product by Admin ------------------------------*/

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

/* ------------------------------ Create And Update Products Review By User ------------------------------*/

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  // review data that will be stored in the reviews arryay in the product document/record
  const review = {
    user: req.user._id, //users' Id
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  //Getting the product for whose reviwes we will created or updated
  const product = await Product.findById(productId);

  //checking if the current logged in user has already made a review for the selected product or not.if we get the reviewed review then will store it in 'isReviewed'.
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  //If the user has already made a review then we will not create the review and will simply update the values. But if there is no past review then will push the review in the reviews.
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  //Finding the average review rate for the Product
  let avg = 0;
  product.reviews.forEach((rev) => {
    // counting the total rating given by all user
    avg += rev.rating;
  });
  //just finding the average and storing it in the document.
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false }); //remember before saving a pre method will be called in proudctSchema file. This is just for my knowledge
  res.status(200).json({
    success: true,
    product,
    message: "reviews Updated/created",
  });
});

/* ------------------------------ Get All Reviews Of Product ------------------------------*/

exports.getAllProductReviews = catchAsyncErrors(async (req, res, next) => {
  //Selecting the target product first
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler(`Product not found`, 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

/* ------------------------------ Delete Review Of Product ------------------------------*/

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  //Selecting the target product first
  let product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler(`Product not found`, 404));
  }

  //here only storing the reviews that is not given by the current user its same as deleting
  const reviews = product.reviews.filter((rev) => {
    //here _id is a review id and .id is the query that we are sending through the request object
    return rev._id.toString() !== req.query.id.toString();
  });

  //after deleting the reviews calculating again the average rating for the product.
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg / reviews.length;
  const numOfReviews = reviews.length;

  //Here we are updating the reviews in the database
  product = await Product.findByIdAndUpdate(
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
