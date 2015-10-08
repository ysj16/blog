var mongoose = require("mongoose");

exports.list = function(req,res){
	var News = require("../models/news");
	var page = req.params.page||1,renderObj={prev:1,next:page};
    var allDates = News.find();
    allDates
      .then(function(data){
      	renderObj.pages = Math.ceil(data.length/20);//获取最大页码
      	if(page>1)
      		renderObj.prev = page-1;
      	if(page<renderObj.pages)
      		renderObj.next = page - 1 +2 ;
      	allDates//分页
	      .sort("date")
	      .skip(20*(page-1))
	      .limit(20)
		  .then(function(news){
		  	renderObj.news = news;
		  })
		  .then(function(){
			res.render("news",renderObj);
		  })
      })
}

exports.collect = function(req,res){
	var id = req.query.id;
	console.log(id)
}