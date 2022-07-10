const express = require("express");
//Importing all functions that will perform the Crud operation on products.
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  createProductReview,
  getAllProductReviews,
  deleteReview,
} = require("../controllers/productController");
const {isAuthenticatedUser,authorizedRoles}  = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedUser,authorizedRoles("admin"),isAuthenticatedUser, createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizedRoles("admin"),isAuthenticatedUser, updateProduct);
router.route("/admin/product/:id").delete(isAuthenticatedUser,authorizedRoles("admin"),isAuthenticatedUser, deleteProduct);
router.route("/product/:id").get(getSingleProduct);
router.route("/review").put(isAuthenticatedUser,createProductReview);
router.route("/reviews").get(getAllProductReviews);
router.route("/review").delete(isAuthenticatedUser,deleteReview);

module.exports = router;
