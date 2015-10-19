var mongoose = require("mongoose");
var Tag = mongoose.model("Tag");
var Article = mongoose.model("Article");

var DateFormat = function(date){
	var str = "";
	str += date.getFullYear() + "年" + (date.getMonth()+ 1) + "月" + date.getDay() + "日";
	return str;
}
exports.list = function(req,res){
	var page = req.params.page||1,renderObj={prev:1,next:page};
	if(+page != page||page==0) {
		next();
	}
	else{
		var Article = require("../models/article");
	    var allDates = Article.find();
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
		      .skip(20*(page-1))
		      .limit(20)
	      	  .exec(function(err){if(err) console.log(err)})
			  .then(function(articles){
			  	renderObj.articles = articles;
				return res.render("articleList",renderObj);
			  })
	      })
  	}
}
exports.show  = function(req,res){
	var id = req.params.id,obj = {};
	Article
		.findOne({_id:id})
		.populate("tags")
		.exec(function(err,data){
			obj.content = data.content;
			obj.author = data.author;
			obj.title = data.title;
			obj.id = data._id;
			obj.tags = data.tags;
			obj.createAt = DateFormat(data.meta.createAt);
			obj.modifyAt = DateFormat(data.meta.modifyAt);
			return res.render("article",obj);
		})
}
exports.newArticle = function(req,res){
	res.render("addArticle")
}

exports.add = function(req,res){
	var markdown = require("markdown").markdown;
	var param = {};
		param.title = req.body.title;
		param.author = req.body.author;
		param.content = markdown.toHTML(req.body.contents);
		param.tags = [];
	var article = new Article(param);
	var tags = req.body.tags.split("，");
	tags.forEach(function(item,index){
		Tag
			.find({name:item})
			.exec(function(err,data){
				if(err) console.log(err)
				if(!data.length){//若标签不存在，添加新标签
					if(item){
						var tag = new Tag({name:item,articles:[article._id]})
						tag.save();
						article.tags.push(tag._id)
					}
				}else{//否则update
					Tag.update({name:item},{$push:{articles:article._id}}).exec(function(err){if(err) console.log(err)})
					article.tags.push(data[0]._id)
				}
				if(tags.length==index+1){
					article.save();
					//return res.redirect("")
				}

			})
	})

}