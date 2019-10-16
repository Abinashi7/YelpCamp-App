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

    var commentRoutes = require("./routes/comments")
    // Comment = require("./models/comment")
    // User = require("./models/user")
    seedDb();
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
// mongoose.connect("mongo://localhost/yelp_camp_v3");
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
})




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
//landi ng page
app.get("/", function(req, res){
    res.render("landing");
});

// -INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
    req.user 
    //get all campgrounds from db
    campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds});
            }
    });
    //temp camp ground array
});
// NEW - show form to create new campground
app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
});
// CREATE: add new camground to DB
app.post("/campgrounds", function(req, res){
    // res.send("you hit the post route");
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;

    var newCampground = {name: name, image: image, description: desc}

//create a new campground and save to DB
campground.create(newCampground, function(err,newlyCreated ){
    if(err){
        console.log(err)
    }else{
        //redirect back to ccampgrounds page
        res.redirect("/campgrounds");
    }
})
    
})
// show- shows more info about a campground
app.get("/campgrounds/:id", function(req,res){
    // find the campground with the provided ID
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        }else {
            console.log(foundCampground);
            res.render("campgrounds/shows", {campground: foundCampground});
        }
    });
    //render show template with that campground
});

// ===============
// Comments Route
// ===============

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // find campground by id
    campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground})
        }
    });
});

app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
    // lookup campground using ID
    campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds");
        } else {
        // create new comment
        Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                campground.comments.push(comment);
                campground.save();
                res.redirect("/campgrounds/" + campground._id);
            }
        });
        }
    }); 
});
// ============
//  AUTH ROUTES
// ============

// show the register form
app.get("/register", function(req, res){
    res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res){
    // req.body.username
    // req.body.password
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// show login form
app.get("/login", function(req,res){
    res.render("login");
});

// handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});
// logout route
app.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Yelp server has started at port" + port);
});
