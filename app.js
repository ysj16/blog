var express = require("express");
var http = require("http");
var cheerio = require("cheerio");
var iconv = require('iconv-lite');
var app = new express();
var port = process.env.PORT||3000;

app.get("/",function(req,res){
	res.send("hello yushangjiang");
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
				console.log($(this).find("h2 a").html())
				//console.log($(this).find("h2").html())
				//artData.name = item.find("h2");
				//console.log(artData.name)

			})
		})
	})
})
app.listen(port);
console.log("start blog on port " + port)