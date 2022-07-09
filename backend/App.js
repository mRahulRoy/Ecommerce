const express = require("express");
const app = express();
const errMiddleware = require("./middleware/error");
let user = require("./routes/userRoute");
const product = require("./routes/productRoute");
const cookieParser = require("cookie-parser");
//This is used to send response tp postman in json format
app.use(express.json());
app.use(cookieParser());

// Route imports
app.use("/api/v1", product); //to use products routes
app.use("/api/v1", user); //to use user routes

// Middleware for err
app.use(errMiddleware);

module.exports = app;
