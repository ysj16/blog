var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var crypto = require("crypto");

var UserSchema = new Schema({
	name:{
		type:String,
		unique:true
	},
	password:String,
	role:{
		type:Number,
		default:0
	},
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

UserSchema.pre("save",function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})
UserSchema.methods = {
	comparePassword:function(password,cb){
		var md5 = crypto.createHash('md5');
		md5.update(password);
		var _password = md5.digest('hex');
		if(this.password==_password){
			cb(true);
		}else{
			cb(false);
		}

	}
}
module.exports = UserSchema