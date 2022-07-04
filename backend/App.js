const express = require("express");
const app = express();
const errMiddleware = require("./middleware/error")

//This is used to send response tp postman in json format
app.use(express.json());

// Route imports
const product = require("./routes/productRoute");
app.use("/api/v1", product);

// Middleware for err
app.use(errMiddleware);




module.exports = app;