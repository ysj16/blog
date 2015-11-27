var mongoose = require("mongoose");
var Comment = mongoose.model("Comment")
exports.add = function(req,res){
	var params = {
		articleId:req.body.id,
		name:req.body.name,
		email:req.body.email,
		webSite:req.body.url,
		content:req.body.content
	}
	if(req.body.to)
		params.to = req.body.to;
	var comment = new Comment(params);
	if(params.name&&params.email&&params.content){
		comment
			.save(function(){
			 	Comment
			 		.update({_id:params.to},{$push:{replies:comment._id}})
			 		.exec(function(err){
			 			if(err) console.log(err)
			 		})
			})

	}
	return res.redirect("/article/detail/" + req.body.id)

}
exports.get = function(articleId){
	return Comment
			.find({articleId:articleId,to:null})
			.populate("replies")
}