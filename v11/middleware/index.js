// all middle ware lives here
var campground = require("../models/campground")
var Comment = require("../models/comment")


var middlewareObj = {}
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error", "campground not found");
                res.redirect("back");
            } else {
                // does the user own the campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Premission denied");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "you need to be logged in first!")
        res.redirect("back");
    }
    
}

middlewareObj.checkCommentOwnership  = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // does the user own the comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Premission denied");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "you need to be logged in first!");
        res.redirect("back");
    } 
}

middlewareObj.isLoggedIn = function(req, res, next){
    // middle ware
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in first!");
    res.redirect("/login");
}

module.exports = middlewareObj