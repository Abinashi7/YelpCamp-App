// all middle ware lives here
var campground = require("../models/campground")
var Comment = require("../models/comment")


var middlewareObj = {}
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                // does the user own the campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
    
}

middlewareObj.checkCommentOwnership  = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // does the user own the comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    } 
}

middlewareObj.isLoggedIn = function(req, res, next){
    // middle ware
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");

}
module.exports = middlewareObj