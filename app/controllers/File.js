var fs = require("fs");
exports.walkDir = function(path){
	var dirs = [path];
	var loop = function(p){
		var root = fs.readdirSync(p);
		root.forEach(function(item){
			var stat = fs.statSync(p+item)
			if(stat.isDirectory()){
				loop(p+item+"/")
				dirs.push(p+item+"/")
			}
		})
	}
	loop(path);
	return dirs;
}
exports.getDirFiles = function(req,res){
	var files = [],path = req.body.path;
	var root = fs.readdirSync(path);
	root.forEach(function(item){
		var stat = fs.statSync(path+"/"+item)
		if(stat.isFile()){
			files.push(item)
		}
	})
	res.json({files:files})
	res.end();
}