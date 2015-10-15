var mongoose = require("mongoose");
var Index = require("../app/controllers/index");
var News = require("../app/controllers/news");
var User = require("../app/controllers/user");

module.exports = function(app){
	app.get("/",Index.index);

	app.post("/user/login",User.login);
	app.get("/user/logout",User.logout);
	app.get("/login",User.loginPage);

	app.get("/news/:page?",News.list);
	app.get("/news/collect",User.loginRequired,News.collect);
	app.get("*",function(req,res){
		res.writeHead(404);
		res.write("this is 404 page")
		res.end()
	});
}