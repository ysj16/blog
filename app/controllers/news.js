var mongoose = require("mongoose");

exports.list = function(req,res,next){
	var page = req.params.page||1,renderObj={prev:1,next:page};
	if(+page != page||page==0) {
		next();
	}
	else{
		var News = require("../models/news");
	    var allDates = News.find();
	    allDates
	      .exec(function(err){if(err) console.log(err)})
	      .then(function(data){
	      	renderObj.pages = Math.ceil(data.length/20);//获取最大页码
	      	renderObj.page = page - 0;
	      	if(page>1)
	      		renderObj.prev = page-1;
	      	if(page<renderObj.pages)
	      		renderObj.next = page - 1 +2 ;
	      	allDates//分页
		      .sort("date")
		      .skip(20*(page-1))
		      .limit(20)
	      	  .exec(function(err){if(err) console.log(err)})
			  .then(function(news){
			  	renderObj.news = news;
				return res.render("news",renderObj);
			  })
	      })
  	}
}

exports.collect = function(req,res){
	var id = req.query.id,isCollect = req.query.isCollect=="true"?true:false;
	var News = require("../models/news");
	News
	  .update({_id:id},{$set:{isCollect:!isCollect}})
	  .exec(function(err){
	  	if(err) {
	  		return res.json({msg:err})
	  	}
	  })
	  .then(function(){
	  	return res.json({msg:"ok"});
	  })
}