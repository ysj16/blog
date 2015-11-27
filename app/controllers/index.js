var mongoose = require("mongoose");
exports.index = function(req,res){
	var News = mongoose.model("News");
	var Spider = mongoose.model("Spider");
	var Article = mongoose.model("Article");
	var renderObj = {};
    News
	  .fetch(15)
	  .exec(function(err,news){
	  	if(err) console.log(err)
	  	renderObj.news = news;
	  	Article
	  		.find({isTop:true})
	  		.exec(function(err,tops){
	  			renderObj.tops = tops;
				return res.render("index",renderObj);
	  		})
	  })

}