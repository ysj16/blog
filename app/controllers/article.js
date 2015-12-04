var mongoose = require("mongoose");
var Tag = mongoose.model("Tag");
var Article = mongoose.model("Article");
var Comment = require("../controllers/comment.js");
var moment = require("moment");
// 文章列表
exports.list = function(req,res,next){
	var page = req.params.page||1,renderObj={prev:1,next:page},query={};
	if(!req.session.user||req.session.user.role!=1){
		query.status = 1
	}
	if(+page != page||page==0) {
		next();
	}
	else{
		var Article = require("../models/article");
	    var allDates = Article.find(query).populate("tags").sort({isTop:-1}).sort({"meta.createAt":1});
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
// 按标签查看文章列表
exports.listTag = function(req,res,next){
	var page = req.params.page||1,renderObj={prev:1,next:page},query={};
	if(+page != page||page==0) {
		next();
	}
	var id = req.params.id;
	var Article = require("../models/article");
	var Tag = require("../models/tag");
	Tag.findOne({_id:id}).exec(function(err,tag){
		if(tag)
			renderObj.tagName = tag.name;
	})
    var allDates = Article.find({tags:{$in:[id]}}).populate("tags").sort({isTop:-1}).sort({"meta.createAt":1});
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
			return res.render("tagsList",renderObj);
		  })
      })
}
//文章查看页面
exports.show  = function(req,res){
	var marked = require('marked');
		marked.setOptions({
		  renderer: new marked.Renderer(),
		  gfm: true,
		  tables: true,
		  breaks: true,
		  pedantic: false,
		  sanitize: true,
		  smartLists: true,
		  smartypants: false
	});
	marked.setOptions({
	  highlight: function (code) {
	    return require('highlight.js').highlightAuto(code).value;
	  }
	})
	var id = req.params.id,obj = {};
	//若非管理员访问，访问量加1
	if(!req.session.user||req.session.user.role!=1){
		Article
			.update({_id:id},{$inc:{pv:1}})
			.exec(function(err){
				if(err)
					console.log(err)
			})
	}
	Article
		.findOne({_id:id})
		.populate("tags")
		.then(function(data){
			obj.content = marked(data.content);
			obj.author = data.author;
			obj.title = obj.webTitle = data.title;
			obj.id = data._id;
			obj.tags = data.tags;
			obj.pv = data.pv;
			obj.meta = data.meta;
			obj.moment = moment;
			Comment.get(id).then(function(comments){
				obj.comments = comments;
				return res.render("article",obj);
			})
		})
}
//文章添加页面
exports.newArticle = function(req,res){
	res.render("addArticle")
}
//文章修改页面
exports.editArticle = function(req,res){
	var id = req.params.id,obj = {};
	Article
		.findOne({_id:id})
		.populate("tags")
		.then(function(data){
			obj.content = data.content;
			obj.preface = data.preface;
			obj.author = data.author;
			obj.title = data.title;
			obj.id = data._id;
			obj.tags = "";
			data.tags.forEach(function(item,index){
				obj.tags += item.name + " ";
			})
			obj.tags = obj.tags.trim();
			return res.render("articleEdit",obj);
		})
}
/*发布文章*/
exports.release = function(req,res){
	var id = req.params.id;
	var status = req.params.status;
	Article
		.update({_id:id},{$set:{ status:status }})
		.exec(function(err){
			if(err) console.log(err)
			return res.redirect("/article/list")	
		})
}
/*置顶文章*/
exports.stick = function(req,res){
	var id = req.params.id;
	var isTop = req.params.isTop;
	Article
		.update({_id:id},{$set:{ isTop:isTop }})
		.exec(function(err){
			if(err) console.log(err)
			return res.redirect("/article/list")	
		})
}

/*添加文章*/
exports.add = function(req,res){
	var param = {};
		param.title = req.body.title;
		param.author = req.body.author;
		param.preface = req.body.preface;
		param.content = req.body.contents;
		param.tags = [];
	var article = new Article(param);
	var tags = req.body.tags.split(" ");
	tags.forEach(function(item,index){
		Tag
			.findOne({name:item})
			.exec(function(err,data){
				if(err) console.log(err)
				if(!data){//若标签不存在，添加新标签
					if(item){
						var tag = new Tag({name:item,articles:[article._id]})
						tag.save();
						article.tags.push(tag._id)
					}
				}else{//否则update
					Tag.update({name:item},{$push:{articles:article._id}}).exec(function(err){if(err) console.log(err)})
					article.tags.push(data._id)
				}
				if(tags.length==index+1){
					article.save();
					return res.redirect("/article/list")
				}

			})
	})

}
/*修改文章*/
exports.update = function(req,res){
	var id = req.body.id,param = {};
	param.title = req.body.title;
	param.author = req.body.author;
	param.content = req.body.contents;
	param.tags = [];
	param["meta.modifyAt"] = Date.now();
	Tag
		.update({articles:{$in:[id]}},{$pull:{articles:id}},{multi:true})
		.exec(function(err){
			if(err) console.log(err)
		})
	var tags = req.body.tags.split(" ");
	tags.forEach(function(item,index){
		Tag
			.findOne({name:item})
			.exec(function(err,data){
				if(err) console.log(err)
				if(!data){//若标签不存在，添加新标签
					if(item){
						var tag = new Tag({name:item,articles:[id]})
						tag.save();
						param.tags.push(tag._id)
					}
				}else{//否则update
					Tag.update({name:item},{$push:{articles:id}}).exec(function(err){if(err) console.log(err)})
					param.tags.push(data._id)
				}
				if(tags.length==index+1){
					Article.update({_id:id},{$set:param}).exec()
					return res.redirect("/article/detail/"+id)
				}

			})
	})

}
/*删除文章*/
exports.delete = function(req,res){
	var id = req.params.id;
	Tag
		.update({articles:{$in:[id]}},{$pull:{articles:id}},{multi:true})
		.exec(function(err){
			if(err) console.log(err)
		})
	Article
		.remove({_id:id})
		.exec(function(err){
			if(err) console.log(err);
			return res.redirect("/article/list/");
		})
}
