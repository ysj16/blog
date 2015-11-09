var mongoose = require("mongoose");
var Tag = mongoose.model("Tag")

module.exports = function(app){
	Tag
		.find()
		.exec(function(err,tags){
			console.log(tags)
		})
	
}