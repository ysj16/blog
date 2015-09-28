var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NewsSchema = new Schema({
	title:String,
	author:String,
	date:{
		type:String,
		default:Date.now().toString()
	},
	from:String,
	fromSite:String,
	url:{
		type:String,
		unique:true
	},
	isCollect:{
		type:Boolean,
		default:false
	}

})
NewsSchema.statics = {
	fetch:function(cb){
		return this.find({}).sort('date').exec(cb);
	}
}

module.exports = NewsSchema;