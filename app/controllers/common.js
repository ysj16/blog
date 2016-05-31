var mongoose = require("mongoose");
var Tag = mongoose.model("Tag");
var Article = mongoose.model("Article");
var moment = require("moment");

module.exports = function(app){
	app.locals.moment = moment;
	Tag
		.find()
		.exec(function(err,tags){
			app.locals.allTags = tags;
		})
	Article
		.find({"status":1})
		.sort({pv:-1})
		.limit(15)
		.exec(function(err,hots){
			app.locals.hots = hots;
		})
	Article
		.find({"status":1})
		.sort({"meta.createAt":-1})
		.limit(15)
		.exec(function(err,fresh){
			app.locals.fresh=fresh;
		})
}