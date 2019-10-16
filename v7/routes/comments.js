var express = require("express");
var router = express.Router({mergeParams: true});
var campground = require("../models/campground");
var Comment = require("../models/comment");


// ===============
// Comments Route
// ===============

// comments new
router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground})
        }
    });
});

// comments create
router.post("/",isLoggedIn, function(req, res){
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

// middle ware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;