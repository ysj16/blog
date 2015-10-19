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
		ref:"Tag"
	}],
	prev:{
		type:ObjectId,
		ref:"Article"
	},
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
	var Article = mongoose.model("Article");
	if(this.isNew){
		var me = this;
		this.meta.createAt = this.meta.updateAt = Date.now();
		Article
			.find()
			.sort({_id:-1})
			.limit(1)
			.exec(function(err,data){
				if(err) console.log(err)
				if(data.length>0)
					me.prev = data[0]._id;
				next();
			})
	}else{
		this.meta.updateAt = Date.now();
		next();
	}
})
ArticleSchema.statics = {
	fetch:function(num){
		return this.find().sort("date").limit(num);
	}
}

module.exports = ArticleSchema;