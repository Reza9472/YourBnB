const mongoose = require("mongoose");
const { stringify } = require("querystring");
const Schema = mongoose.Schema;

mongoose.Promise = require("bluebird");

const mySchema = new Schema({
    "username": {
        type: String,
        unique: true
    },
    "filename": {
        type: String , 
    },
    "email": String , 
    "fname": String , 
    "lname": String , 
    "password": String , 
    "birthday": Date , 
    "createdOn" : {
        type: Date , 
        default: Date.now
    },
    "isAdmin": Boolean
});

module.exports = mongoose.model("Users" , mySchema);
