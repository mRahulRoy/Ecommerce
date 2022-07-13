//Mine understanding for this file status: All Good.

const Order = require("../models/ordersModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

/*-------------------------- Creating New Order ------------------------ */
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

/*-------------------------- Get Single Order ------------------------ */

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  /*Here we are finding the order according to the order Id and then we are getting the email and password of the logged user.
  Note: please look at the order Schema and there you will see a filed by the name "user" -->
   user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  }  
  just like this.
 As we can see "user" will hold the object Id and that Id will be of another document called "User". We can understand it like linking a document to another and accesing the data with each other.
 ---> So here after finding the Order we are accessing the user detail like who made this order for that we are using a populate function takes two argument one is target_field and another one is what data do we need from that target field object. in our case we only want name and email.
  */
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

/*-------------------------- Get Logged In User Details ------------------ */

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  //Here we are also doing same but finding the user detail ,here user is a field in OrderSchema that points to the Original User Object.
  const order = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    order,
  });
});

/*-------------------------- Get All Order Details ------------------------ */

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find();

  let totalAmount = 0;
  order.forEach((orders) => {
    totalAmount += orders.totalPrice;
  });

  res.status(200).json({
    success: true,
    order,
    totalAmount,
  });
});

/*-------------------------- Update Order Status ------------------------ */

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  //Here we are finding the product using product id .
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler(`Order not found with this Id`, 404));
  }

  //Handling delevered Status
  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler(`You have already delivered this product`, 400)
    );
  }
  //since orderItems is an array so we are looping and updating the product stocks
  order.orderItems.forEach(async (ordr) => {
    //here ordr.product represents the product id or the id of product that we want to buy. For clear understanding check the products in orderItems in the orderSchema.
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

/*-------------------------- Delete Orders By Admin ------------------------ */

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
