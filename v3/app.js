var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    campground  = require("./models/campground.js"),
    seedDb      = require("./seeds")
    // Comment = require("./models/comment")
    // User = require("./models/user")
    seedDb();
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
// mongoose.connect("mongo://localhost/yelp_camp_v3");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 


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
    //get all campgrounds from db
    campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                res.render("index", {campgrounds: allCampgrounds});
            }
    });
    //temp camp ground array
});

app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
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
            res.render("shows", {campground: foundCampground});
        }
    });
    //render show template with that campground
});


var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Yelp server has started at port" + port);
});
