var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ArticleSchema = new Schema({
	title:String,
	author:String,
	content:String,
	isTop:{
		type:Boolean,
		default:false
	},
	tags:[{
		type:ObjectId,
		ref:"tag"
	}],
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		modifyAt:{
			type:Date,
			default:Date.now()
		}
	}

})
ArticleSchema.pre("save",function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})
ArticleSchema.statics = {
	fetch:function(num){
		return this.find().sort("date").limit(num);
	}
}

module.exports = ArticleSchema;