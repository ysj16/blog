var mongoose = require("mongoose");
var Article = mongoose.model("Article");
exports.newArticle = function(req,res){
	res.render("addArticle")
}