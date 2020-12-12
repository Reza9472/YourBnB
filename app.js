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
var bodyParser = require("body-parser");
const clientSessions = require("client-sessions");
const _ = require ("underscore");
const PHOTODIRECTORY = "./public/photos/";
const fs = require("fs");


const mongoose = require("mongoose");
const registerModel = require("./models/model");
const houseModel = require("./models/houseModel");
const bookModel = require("./models/bookingModel");
const config = require("./js/config");
const { response } = require('express');
const connectionString = config.database_connection_string;



var HTTP_PORT = process.env.PORT || 8080
function onHTTPStartup(){
    console.log("Express server is running on port " + HTTP_PORT);
}


// making sure the photos folder exists
if (!fs.existsSync(PHOTODIRECTORY)) {
    fs.mkdirSync(PHOTODIRECTORY);
}
// -----------------------------------------------------------
// handle bars




const STORAGE = multer.diskStorage({
    destination: "./public/photos" , 
    filename: function(req , file , cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const UPLOAD = multer({ storage: STORAGE});


//app.set("views" , "./views");
app.engine('.hbs' , hbs({extname: '.hbs'}));
app.set("view engine" , ".hbs");


app.use(express.static("views"));
app.use(express.static("public"));


mongoose.connect(connectionString , {useNewUrlParser: true , useUnifiedTopology: true});

mongoose.connection.on("open" , () => {
    console.log("Database Connection Open.");
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        user: 'rezaseneca@gmail.com',  //your email account
        pass: 'sene5678'  // your password
    }
});


app.use(bodyParser.urlencoded({extended: false }));




function checkLogin(req, res, next) {
    if(!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
};

 
app.use(clientSessions({
    cookieName: "session",
    secret: "web322_yourbnbProject",
    duration: 2*60*1000,
    activeDuration: 1000*60
}));

app.get("/" ,function(req , res){  
    res.render('test' , {layout: false});
})

app.get("/listing" , function(req , res){

    houseModel.find().lean()
    .exec()
    .then((photos) => {
        _.each(photos, (photo) => {
            photo.uploadDate = new Date(photo.createdOn).toDateString();      
    });
        res.render('listing' , {photos: photos, hasPhotos: !!photos.length , user: req.session.user ,layout: false});
    });
});

app.get("/firstListing" , function(req , res){
    
    res.render('firstListing' , {layout: false});
})

app.get("/loginPage" , checkLogin , function(req , res){

    houseModel.find().lean()
    .exec()
    .then((photos) => {
        _.each(photos, (photo) => {
            photo.uploadDate = new Date(photo.createdOn).toDateString();      
    });
        res.render('loginPage' , {photos: photos, hasPhotos: !!photos.length , user: req.session.user ,layout: false});
    });



    
})

app.get("/login" , function(req , res){
    res.render('loginForm' , {user: req.session.user , layout: false});
})

app.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
   
    if (username === "" || password === ""){
        return res.render("loginForm", {errorMsg: "Both fields are required!",user: req.session.user, layout: false});
    }

    registerModel.findOne({username: username})
    .exec()
    .then((usr) => {
        if(!usr){
            res.render("loginForm", {errorMsg: "login does not exist!", layout: false});
        } else{

            if (username === usr.username) {
                req.session.user = {
                    username: usr.username,
                    password: usr.password,
                    email: usr.email , 
                    fname: usr.fname , 
                    lname: usr.lname,
                    isAdmin: usr.isAdmin
                };
                res.redirect("/loginPage");
            } else {
                res.render("loginForm", {errorMsg: "The login or password does not match!", layout: false});
            };
        };
        
    })
    .catch((err) => {console.log(`We have an error: ${err}`)});
});




app.post("/test-form-process", UPLOAD.single("photo"), (req, res) => {
    const FORM_DATA = req.body;
    const FORM_FILE = req.file;

    

    var mailOptions = {
        from: 'rezaseneca@gmail.com',
        to: FORM_DATA.email,
        subject: 'Registration Successful!',
        html: '<p>Hello ' + FORM_DATA.fname + ":</p><p>Thank you for being awesome!</p><p> Your registration has been successful!</p>" + 
        "<p>Here is a copy of the information you provided: </p><br>" + "Name: " + FORM_DATA.fname + " " + FORM_DATA.lname + "<br>" + 
        "Email: " + FORM_DATA.email + "<br>" + "Date of Birth: " + FORM_DATA.birthday + "<br><br>" 
    }

    const registerMetaData = new registerModel({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        fname: req.body.fname,
        lname: req.body.lname,
        birthday: req.body.birthday,
        filename: req.file.filename,
        isAdmin: req.body.isAdmin
    });

    const locals = {
        message: "Your registration was successful",
        layout: false
    };

    registerMetaData.save()
    .then((response) => {
        res.render("dashboard" , locals)
    })

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("ERROR: " + error);
        } else {
            console.log("SUCCESS: " + info.response);
        }
    });

    res.render('dashboard' , {layout: false});
   
});



// ---------------------------------------------------------------------------------------------------------------------------

app.get("/reghouse" , function(req , res){
    res.render('createdListing' , {user: req.session.user , layout: false});
})

app.post("/reghouse", UPLOAD.single("photo"), (req, res) => {
    
    const registerMetaData1 = new houseModel({
        
        
        title: req.body.title , 
        fullname: req.body.fullname,
        price: req.body.price,
        location: req.body.location,
        description: req.body.description,
        filename: req.file.filename,
        createdOn: req.body.createdOn
    });

    const locals = {
        message: "Your listing has been created successfully",
        layout: false
    };

    registerMetaData1.save()
    .then((response) => {
        res.render("createdListing" , locals)
    })

    res.render('createdListing' ,  {layout: false});
    
});

// ---------------------------------------------------------------------------------------------------------

// Confirm Booking

app.get("/confirm" , function(req , res){

    bookModel.find().lean()
    .exec()
    .then((lists) => {
        _.each(lists, (photo) => {
            photo.uploadDate = new Date(photo.createdOn).toDateString();      
    });
        res.render('confirmBook' , {lists: lists, hasBooked: !!lists.length , user: req.session.user ,layout: false});
    });



    //res.render('confirmBook' , {user: req.session.user , layout: false});
});

app.post("/confirm", (req, res) => {

    const FORM_DATA = req.body;
    const FORM_FILE = req.file;


    const registerMetaData2 = new bookModel({
        
        
        email: req.body.email,
        fullname: req.body.fullname,
        indate: req.body.indate,
        outdate: req.body.outdate
        
    });

    var mailOptions1 = {
        from: 'rezaseneca@gmail.com',
        to: req.body.email,
        subject: 'Booking Complete!',
        html: '<p>Hello ' + FORM_DATA.fullname + ":</p><p> Your booking has been successful!</p>" + 
        "<p>Here is a copy of the information about the room you booked: </p><br>" + "<p>Your check in date: </p>" +
        FORM_DATA.indate + "<br><p> Your check out date: </p>" + FORM_DATA.outdate 
    }

    transporter.sendMail(mailOptions1, (error, info) => {
        if (error) {
            console.log("ERROR: " + error);
        } else {
            console.log("SUCCESS: " + info.response);
        }
    });

    const locals = {
        message: "Your listing has been created successfully",
        layout: false
    };

    registerMetaData2.save()
    .then((response) => {
        res.render("confirmBook" , locals)
    })
    res.render("confirmBook" , {user: req.session.user} , {layout: false});
});





//------------------------------------------------------------------------------------------
// Delete

app.get("/Delete/:listingID" , (req,res) => {
    const listingID = req.params.listingID;

    houseModel.deleteOne({_id: listingID})
    .then(() => {
        res.redirect("/listing");
    });
})

//------------------------------------------------------------------------------------------
// Log Out

app.get("/logout", (req,res)=> {
    req.session.reset();
    res.render("loginForm", {errorMsg: "invalid username or password!", layout: false});
});

//------------------------------------------------------------------------------------------
// Edit

app.get("/Edit" , (req,res) => {
    res.render("edit" , {user: req.session.user, layout: false});
})

app.get("/Edit/:listingID" , (req,res) => {
    const listingID = req.params.listingID;

    houseModel.findOne({_id: listingID})
    .lean()
    .exec()
    .then((house) => {
        res.render("edit" , {user: req.session.user, house: house, layout: false})
    })
    .catch((err) => {console.log(`We have an error friend: ${err}`)});
});

app.post("/Edit" , (req,res) => {
    const house = new houseModel({
        _id: req.body.ID,
        title: req.body.title , 
        fullname: req.body.fullname,
        price: req.body.price,
        location: req.body.location,
        description: req.body.description,
        //filename: req.file.filename,
        //createdOn: req.body.createdOn
    });

    if(req.body.edit === "1"){
        houseModel.updateOne({_id: house._id},
        {
            $set: {
                title: house.title,
                fullname: house.fullname,
                price: house.price,
                location: house.location,
                description: house.description,
            }
        })
        .exec()
        .then((err) => {console.log(`We have an error pal: ${err}`)});
    } else {
        house.save((err) => {});
    };

    res.redirect("/loginPage");
});


// app.engine('.hbs' , hbs({
//     extname: '.hbs' , 
//     helpers: {
//         isAdmin: function()
//     }
// }))

app.listen(HTTP_PORT , onHTTPStartup);