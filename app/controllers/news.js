var mongoose = require("mongoose");

exports.list = function(req,res){
	var News = require("../models/news");
	var page = req.params.page, renderObj = {};
    News
      .find()
      .sort("date")
      .skip(20*(page-1))
      .limit(20)
	  .then(function(news){
	  	renderObj.news = news;
	  })
	  .then(function(){
		res.render("news",renderObj);
	  })
}