var mongoose    = require("mongoose");
//SCHEMA SETUP
var campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String, 
    description: String, 
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Campgrounds", campgroundsSchema);
