const mongoose = require("mongoose");
// Defining the schema of document
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"],
    },
    description: {
        type: String,
        required: [true, "Please Enter Description"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Please Enter Price"],
        maxLength: [8, "Price cannot exceed 8 characters"]
    },
    rating: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            }
        },
    ],
    category: {
        type: String,
        required: [true, "Enter Category"],
    },
    stock: {
        type: Number,
        default: 10,
        required: [true, "Please Enter Stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
    },
    numOfReviews: {
        type: Number,
        default: 0,
    }
    ,
    reviews: [
        {
            name: {
                type: Number,
                deafault: 0,
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true,
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }

})
/*
Document and Model are distinct classes in Mongoose. The Model class is a subclass of the Document class. When you use the Model constructor, you create a new document.
Databases, collections, documents are important parts of MongoDB without them you are not able to store data on the MongoDB server. A Database contains a collection, and a collection contains documents and the documents contain data, they are related to each other. 

                                                Collection
Collections are just like tables in relational databases, they also store data, but in the form of documents. A single database is allowed to store multiple collections. 
*/
module.exports = mongoose.model("Product", productSchema);