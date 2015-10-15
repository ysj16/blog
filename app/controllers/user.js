var mongoose = require("mongoose");
var User = mongoose.model("User");
exports.loginPage = function(req,res,next){
	return res.render("login")
}
exports.login = function(req,res){
	var name=  req.body.name;
	var password = req.body.password;
	User
	  .findOne({name:name})
	  .exec(function(err){
	  	if(err)
	  		console.log(err)
	  })
	  .then(function(user){
	  	if(!user)
	  		return res.redirect("/login")
	  	user.comparePassword(password,function(isMatch){
	  		if(isMatch){
	  			req.session.user = user;
	  			return res.redirect("/")
	  		}else{
	  			return res.redirect("/login")
	  		}
	  	})
	  })
}
exports.logout = function(req,res){
	delete req.session.user;
	return res.redirect("/")
}
exports.loginRequired = function(req,res,next){
	var user = req.session.user;
	if(!user){
	console.log(22)
		return res.redirect("/");
	}
	next();
}