const express = require("express");
//Importing all functions that will perform the Crud operation on products.
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} = require("../controllers/productController");
const {isAuthenticatedUser,authorizedRoles}  = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticatedUser,authorizedRoles("admin"),isAuthenticatedUser, createProduct);
router.route("/product/:id").put(isAuthenticatedUser,authorizedRoles("admin"),isAuthenticatedUser, updateProduct);
router.route("/product/:id").delete(isAuthenticatedUser,authorizedRoles("admin"),isAuthenticatedUser, deleteProduct);
router.route("/product/:id").get(getSingleProduct);

module.exports = router;
