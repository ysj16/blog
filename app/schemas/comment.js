var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId= Schema.Types.ObjectId;

var CommentSchema = new Schema({
	name:String,
	email:String,
	webSite:String,
	content:String,
	articleId:{
		type:ObjectId,
		ref:"Article"
	},
	to:{
		type:ObjectId,
		ref:"Comment"
	},
	replies:[{
		type:ObjectId,
		ref:"Comment"
	}],
	createAt:Date,
	isRead:{
		type:Boolean,
		default:false
	}
})
CommentSchema.pre("save",function(next){
	if(this.isNew){
		var me = this;
		this.createAt = Date.now();
		next();
	}
})
module.exports = CommentSchema;