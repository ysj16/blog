var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SpiderSchema = new Schema({
	site:{
		type:String,
		unique:true
	},
	name:String,
	article:String,
	title:String,
	author:String,
	url:String,
	date:String
})
SpiderSchema.statics = {
	fetch:function(){
		return this.find();
	}
}
module.exports = SpiderSchema;