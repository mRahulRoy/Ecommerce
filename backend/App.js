const express = require("express");
const app = express();
const bodyparser = require("body-parser")
const errMiddleware = require("./middleware/error");
const fileupload = require("express-fileupload")
// routes imports
const user = require("./routes/userRoute");
const product = require("./routes/productRoute");
const order = require("./routes/orderRoutes");

const cookieParser = require("cookie-parser");
//This is used to send response tp postman in json format
app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.urlencoded({extended:true}))
app.use(fileupload());
// Route imports
app.use("/api/v1", product); //to use products routes
app.use("/api/v1", user); //to use user routes
app.use("/api/v1", order); //to use order routes

// Middleware for err
app.use(errMiddleware);

module.exports = app;
