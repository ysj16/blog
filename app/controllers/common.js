var mongoose = require("mongoose");
var Tag = mongoose.model("Tag");
var Article = mongoose.model("Article");
var C = require("/blog/app/controllers/custom");

module.exports = function(app){
	Tag
		.find()
		.exec(function(err,tags){
			app.locals.allTags = tags;
		})
	Article
		.find()
		.sort({pv:-1})
		.limit(15)
		.exec(function(err,hots){
			app.locals.hots = hots;
		})
	Article
		.find()
		.sort({"meta.createAt":-1})
		.limit(15)
		.exec(function(err,fresh){
			fresh.forEach(function(item){
				item.createAt = C.DateFormat(item.meta.createAt);
			})
			app.locals.fresh=fresh;
		})
}