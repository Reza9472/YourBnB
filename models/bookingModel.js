const mongoose = require("mongoose");
const { stringify } = require("querystring");
const Schema = mongoose.Schema;

mongoose.Promise = require("bluebird");

const bookSchema = new Schema({

    
    
    "fullname": String,
    "email": String,
    "indate": Date,
    "outdate": Date

});

module.exports = mongoose.model("Bookings" , bookSchema);
