var mongoose = require("mongoose");

exports.index = function(req,res){
	var News = mongoose.model("News");
	var Spider = mongoose.model("Spider");
	var renderObj = {};
    News
	  .fetch(10)
	  .then(function(news){
	  	renderObj.news = news;
	  })
	  .then(function(){
		res.render("index",renderObj);
	  })
}