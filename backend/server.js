const app = require("./App"); //importing necessary configurations from App file/module
const dotenv = require("dotenv"); //importing 'dotenv'  third party modules
const connectDatabase = require("./config/database"); // importing database connection function
dotenv.config({ path: "backend/config/config.env" }) //  for using envoronmental variables we are using dotenv
const cloudinary  = require("cloudinary");

//-----Handling uncaught Exception
/*This process object is an instance of the EventEmitter class. It does it contain its own pre-defined events such as exit which can be used to know when a program in Node.js has completed its execution.
The ‘uncaughtException’ is an event of class Process within the process module which is emitted when an uncaught JavaScript exception bubbles all the way back to the event loop.
Parameters: This event does not accept any argument as a parameter.
Return Value: This event returns nothing but a callback function for further operation.
this will thorw err when a variable/object is made but trying to use.
*/
process.on("uncaughtException", (err) => {
    console.log("Exception: ", err.message);
    console.log("Shutting down the server due to uncaught Exception");
    process.exit(1);
})



// connecting to the database
connectDatabase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME ,
    api_key:  process.env.CLOUDINARY_API_KEY,
    api_secret:  process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen(process.env.PORT, () => {
    console.log("Server is Running", process.env.PORT)
})

//----unhandled promise rejection
/*
The unhandledRejection event is emitted whenever a promise rejection is not handled. NodeJS warns the console about UnhandledPromiseRejectionWarning and immediately terminates the process. The NodeJS process global has an unhandledRejection event. This event is fire when unhandledRejection occurs and no handler to handle it in the promise chain. 
Parameters: This method takes the following two parameters.
unhandledRejection: It is the name of the emit event in the process.
callbackfunction: It is the event handler of the event.
Return Type: The return type of this method is void.
*/
process.on("unhandledRejection", (err) => {
    console.log("Error : ", err);
    console.log("Shutting down the server due to unhandled Promise Rejection");

    server.close(() => {
        process.exit(1);
    })
})
