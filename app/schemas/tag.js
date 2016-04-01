var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId= Schema.Types.ObjectId;

var tagSchema = new Schema({
	name:{
		unique:true,
		type:String
	},
	articles:[{
		type:ObjectId,
		ref:"Article"
	}]
})
module.exports = tagSchema;