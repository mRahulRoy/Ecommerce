const mongoose = require("mongoose");
const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then((data) => {
        console.log("MongoDb connected to the server ", data.connection.host);
    })
    //here catch is not written becouse we already have written a code for all promise rejection in server.js.
};
module.exports = connectDatabase;