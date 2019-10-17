var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    localStrategy = require("passport-local"),
    User          = require("./models/user"),
//     passportLocalMongoose = require("passport-local-mongoose")
    campground  = require("./models/campground.js"),
    Comment     = require("./models/comment"),
    seedDb      = require("./seeds")

    // requiring routes
    var commentRoutes = require("./routes/comments"),
        campgroundRoutes = require("./routes/campgrounds"),
        indexRoutes       = require("./routes/index")
// seed the database
    // seedDb();

    
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
// mongoose.connect("mongo://localhost/yelp_camp_v7");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs"); 

// PASSPort configuration
app.use(require("express-session")({
    secret: "Abi",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next ){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// campground.create({
//     name: " granite hill",
//     image:"https://www.campmanitowa.com/wp-content/uploads/2015/01/green_yurts.png",
//     description: " this is a huge granite hill but no bathroom, no water. But beauitful granite "

// }, function(err, campground){
//     if(err){
//         console.log(err);
//     }else {
//         console.log("Newly created campground: ");
//         console.log(campground);
//     }
// });


var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Yelp server has started at port" + port);
});
