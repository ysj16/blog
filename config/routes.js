var mongoose = require("mongoose");
var fs = require("fs");
var multer = require("multer");
var Index = require("../app/controllers/index");
var News = require("../app/controllers/news");
var User = require("../app/controllers/user");
var Article = require("../app/controllers/article");
var Comment = require("../app/controllers/comment")
var File = require("../app/controllers/File")
var Common = require("../app/controllers/common")

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	var path = req.query.path;
  	if(!fs.existsSync(path))
  		fs.mkdirSync(path);
    cb(null, path)
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname)
  }
})


var upload = multer({ storage: storage })
module.exports = function(app){
	app.use(function(req,res,next){
		var user = req.session.user;
		app.locals.user = user||null;
		Common(app);
		next();
	})
	
	app.get("/",Index.index)

	app.post("/user/login",User.login)
	app.get("/user/logout",User.logout)
	app.get("/login",User.loginPage)

	app.get("/news/:page?",News.list)
	app.get("/news/collect/list",News.collectList)
	app.get("/news/collect",User.loginRequired,News.collect)


	app.get("/article/list/:page?",Article.list)
	app.get("/article/list/tag/:id?",Article.listTag)
	app.get("/article/detail/:id",Article.show)
	app.get("/article/edit/:id",Article.editArticle)
	app.get("/article/add",User.loginRequired,Article.newArticle)
	app.get("/article/release/:id/:status",User.loginRequired,Article.release)
	app.get("/article/stick/:id/:isTop",User.loginRequired,Article.stick)
	app.post("/article/add",User.loginRequired,Article.add)
	app.post("/article/update",User.loginRequired,Article.update)
	app.get("/article/delete/:id",User.loginRequired,Article.delete)
	
	app.post("/comment/add",Comment.add)

	app.post("/images/upload",User.loginRequired,upload.array('pictures',10),Article.showPic)
	app.post("/files/getfiles",User.loginRequired,File.getDirFiles)
	app.get("/ILoveCharlotte",function(req,res){
		console.log("有用户访问"+new Date())
		res.render("Charlotte")
	})
	app.get("*",function(req,res){
		res.writeHead(404);
		res.write("this is 404 page")
		res.end()
	});

}
