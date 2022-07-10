const Order = require("../models/ordersModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// creating new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//get single order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(`Order not found with this Id`, 404);
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//get logged in user orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    order,
  });
});

//get all orders  --Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find();

  let totalAmount;
  order.forEach((orders) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    order,
    totalAmount,
  });
});

//update order status--Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler(`Order not found with this Id`, 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler(`You have already delivered this product`, 400)
    );
  }
  order.orderItems.forEach(async (ordr) => {
    await updateStock(ordr.product, ordr.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.Stock = quantity;
  await product.save({ validateBeforeSave: false });
}

//delete Orders --Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler(`Order not found with this Id`, 404));

  }

  await order.remove();

  res.status(200).json({
    success: true,
    message:"Orderde deleted Succesfully",
  });
});
