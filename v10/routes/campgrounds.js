var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var middleware = require("../middleware")

// -INDEX - show all campgrounds
router.get("/", function(req, res){
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
router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});
// CREATE: add new camground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // res.send("you hit the post route");
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author}


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
router.get("/:id", function(req,res){
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
// EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    // if(req.isAuthenticated()){
        campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground}); 
    });   
});
// Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
// find and update the correc tcampground

campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
        res.redirect("/campgrounds");
    } else {
        res.redirect("/campgrounds/" + req.params.id);
    }
});
// and redirect to a page
});

// Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})




module.exports = router;