var express = require("express");
var http = require("http");
var mongoose = require('mongoose')
//var mongoStore = require('connect-mongo')(express)
var cheerio = require("cheerio");
var iconv = require('iconv-lite');
var fs = require("fs");
var app = new express();
var port = process.env.PORT||3000;

//var n1 = require("./app/models/news");

var dbUrl = 'mongodb://localhost/blog'

mongoose.connect(dbUrl)

var addModels = function(path){
	fs
	  .readdirSync(path)
	  .forEach(function(file){
	  	var tPath = path + "/" +file;
	  	var stat = fs.statSync(tPath);
	  	if(stat.isFile()){
	  		if(/.*(\.js)$/.test(file)){
	  			require(tPath);
	  		}
	  	}else if(stat.isDirectory()){
	  		addModels(tPath)
	  	}
	  })
}
addModels("./app/models");//加载路径下的所有模块

var News = mongoose.model("News");
var New = new News({title:1111})
// New.save(function(){
// 	console.log(22)
// })

app.get("/",function(req,res2){
	res2.send("hello yushangjiang");
	http.get("http://isux.tencent.com/",function(res){
		var html = "",artDatas = [];
		res.on("data",function(data){
			html += data;
		})
		res.on("end",function(){
			var $ = cheerio.load(html);
			var articles = $("article");
			articles.each(function(){
				var artData = {};
				//var str = iconv.decode($(this).find("h2").html(), 'GBK'); //return unicode string from GBK encoded bytes
				//console.log($(this).find("h2").html())
				//artData.name = item.find("h2");
				//console.log(artData.name)

			})
		})
	})
})
app.listen(port);
console.log("start blog on port " + port)