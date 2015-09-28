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
module.exports = SpiderSchema;