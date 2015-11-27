var express = require("express");
var http = require("http");
var mongoose = require('mongoose');
var session = require("express-session");
var compress = require("compression");
var cheerio = require("cheerio");
var iconv = require('iconv-lite');
var fs = require("fs");
var bodyParser = require("body-parser");
var mongoStore = require('connect-mongo')(session)
var schedule = require("node-schedule");
var morgan = require("morgan");
var app = new express();
var port = process.env.PORT||3000;
var dbUrl = 'mongodb://localhost/blog'
mongoose.connect(dbUrl)

app.set("env","production")

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
app.set("views","./app/views");//设置模板引擎以及目录
app.set("view engine","jade");
app.use(session({
    resave: true,
    saveUninitialized: true,
	secret:"blog", 
	cookie: {maxAge: 100*60*60*24*15 },
	store:new mongoStore({
		url:'mongodb://localhost/blog',
		db:"blog",
		collection:"sessions"
	})
}))

app.use(compress());
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({extended:false}));

if(app.get("env")=="development"){
  app.set('showStackError', true)
  app.use(morgan(':method :url :status'))
  app.locals.pretty = true
}

var spider = function(option,cb){//文章爬虫
	http.get(option.site,function(res){
		var html = "",artDatas = [];
		res.on("data",function(data){
			html += data;
		})
		res.on("end",function(){
			var $ = cheerio.load(html);
			var articles = $(option.article);
			articles.each(function(){
				var artData = {},$me = $(this);
				artData.title = $me.find(option.title).text().trim();
				artData.author = $me.find(option.author).text().trim();
				if(option.date){
					artData.date = $me.find(option.date).text();
				}
				artData.from = option.from;
				artData.fromSite = option.site;
				artData.url = $me.find(option.url).attr("href");
				artDatas.push(artData);
			})
			cb(artDatas);
		})
	})
}

var rule = new schedule.RecurrenceRule();//定时爬虫任务
rule.hour = 23
rule.minute = 50;

var job = schedule.scheduleJob(rule,function(){
	var Spider = mongoose.model("Spider");
	var News = mongoose.model("News");
	Spider
		.find()
		.exec(function(err,spiders){
			if(err) {
				console.log(err);
			}
			spiders.forEach(function(item){
				spider({
					site:item.site,
					article:item.article,
					title:item.title,
					author:item.author,
					from:item.name,
					url:item.url 
				},function(artDatas){
					artDatas.forEach(function(item){
						var New = new News(item);
						New.save();
					})
				})
			})
		})
})

require("./config/routes")(app);

app.listen(port);