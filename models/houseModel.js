const mongoose = require("mongoose");
const { stringify } = require("querystring");
const Schema = mongoose.Schema;

mongoose.Promise = require("bluebird");

const houseSchema = new Schema({

    // "_id": {
    //     type: String
    // }, 
    "title" : String,
    "fullname": String,
    "price": Number,
    "location": String,
    "description": String,
    "filename": {
        type: String,
        unique: true
    },
    "createdOn": {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Listings" , houseSchema);
