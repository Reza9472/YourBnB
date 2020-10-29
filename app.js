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
var nodemailer = require("nodemailer");
const multer = require('multer');
const hbs = require('express-handlebars');


// var FormData = require('form-data');


var HTTP_PORT = process.env.PORT || 8080

// -----------------------------------------------------------
// handle bars

app.engine('.hbs' , hbs({extname: '.hbs'}));
app.set('view engine' , '.hbs');

const STORAGE = multer.diskStorage({
    destination: "./public/photos" , 
    filename: function(req , file , cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const UPLOAD = multer({ storage: STORAGE});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        user: 'rezaseneca@gmail.com',  //your email account
        pass: 'sene5678'  // your password
    }
});



function onHTTPStartup(){
    console.log("Express server is running on port " + HTTP_PORT);
}

// app.use(express.static(path.join(__dirname + '/views')));
app.use(express.static("views"));
app.use(express.static("public"));

app.get("/" ,function(req , res){
    
    // res.sendFile(path.join(__dirname , 'views/test.html'));
    res.render('test' , {layout: false});
})

app.get("/listing" , function(req , res){
    // res.sendFile(path.join(__dirname , "views/listing.html"));
    res.render('listing' , {layout: false});
})

app.get("/firstlisting" , function(req , res){
    // res.sendFile(path.join(__dirname , "views/firstlisting.html"));
    res.render('firstlisting' , {layout: false});
})




// let fm = new FormData(document.querySelector('form'));
// fname = fm.get("fname");
// lname = fm.get("lname");
// email = fm.get("email");

app.post("/test-form-process", UPLOAD.single("photo"), (req, res) => {
    const FORM_DATA = req.body;
    const FORM_FILE = req.file;

    // const DATA_RECEIVED = "Your submission was received: <br/><br/>" +
    //     "Your form data was:<br/>" + JSON.stringify(FORM_DATA) + "<br/><br/>" +
    //     "Your file data was:<br/>" + JSON.stringify(FORM_FILE) + 
    //     "<br/><p>This was the image just uploaded:<br/>" +
    //     "<img src='/photos/" + FORM_FILE.filename + "'/>" +
    //     "<br/><br/>Welcome <strong>" + FORM_DATA.fname + " " + FORM_DATA.lname + "</strong>" +
    //     " to the world of form processing.";

    var mailOptions = {
        from: 'rezaseneca@gmail.com',
        to: FORM_DATA.email,
        subject: 'Test email from NODE.js using nodemailer',
        html: '<p>Hello ' + FORM_DATA.fname + ":</p><p>Thank-you for being awesome!</p><p> Your registration has been successful!</p>"
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("ERROR: " + error);
        } else {
            console.log("SUCCESS: " + info.response);
        }
    });

    res.render('dashboard' , {layout: false});
    //res.sendFile(path.join(__dirname , "views" , "dashboard"));

    //res.send(DATA_RECEIVED);
});





app.listen(HTTP_PORT , onHTTPStartup);