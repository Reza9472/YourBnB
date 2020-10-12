/* //==============================================
// Name:           Reza Poursafa
// Student Number: 140640194
// Email:          rpoursafa@myseneca.ca
// Section:        NEE
// Date:           11/10/2020
//==============================================
// Assignment:       1
//==============================================  */



var express = require('express');
var app = express();

var path = require('path')

var HTTP_PORT = process.env.PORT || 8080

function onHTTPStartup(){
    console.log("Express server is running on port " + HTTP_PORT);
}
app.use(express.static(path.join(__dirname + '/views')));

app.get("/" ,function(req , res){
    
    res.sendFile(path.join(__dirname , 'views/test.html'));
})

app.get("/listing" , function(req , res){
    res.sendFile(path.join(__dirname , "views/listing.html"));
})

app.get("/firstlisting" , function(req , res){
    res.sendFile(path.join(__dirname , "views/firstlisting.html"));
})

app.listen(HTTP_PORT , onHTTPStartup);