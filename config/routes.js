var mongoose = require("mongoose");
var Index = require("../app/controllers/index");
var News = require("../app/controllers/news");

module.exports = function(app){
	app.get("/",Index.index);

	app.get("/news/:page?",News.list);
	app.get("/news/collect",News.collect);
	app.get("*",function(req,res){
		res.writeHead(404);
		res.write("this is 404 page")
		res.end()
	});
}