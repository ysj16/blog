var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NewsSchema = new Schema({
	title:String,
	author:String,
	date:Date,
	from:String,
	url:String,
	isCollect:Boolean

})
NewsSchema.statics = {
	fetch:function(cb){
		return this.find({}).sort('date').exec(cb);
	}
}

module.exports = NewsSchema;