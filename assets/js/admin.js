
var File = document.getElementById("File"),file,reader;
C.addHandler(File,"change",function(e){
	var panel = document.getElementById("imgPanel");
	panel.innerHTML = "";
	for(var i=0;i<File.files.length;i++){
		file=File.files[i];
		reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(e){
			var imgData  = this.result,
				img = document.createElement("img");
			img.src = imgData;
			var div = document.createElement("div");
			panel.appendChild(img)

		}
	}
})
var ImgUpload = document.getElementById("ImgUpload");
C.addHandler(ImgUpload,"submit",function(e){
	if(File.files.length){
		var formData = new FormData(ImgUpload);
	    var xhr = new XMLHttpRequest();
	    xhr.open("post", "/images/upload?path="+ImgUpload.path.value, true);
	    xhr.onload = function (result) {
	        alert("上传完成!");
	    };
	    xhr.send(formData);
	}
	e.preventDefault();
	return false;
})

var SelRoot = document.getElementById("SelRoot"),panel = document.getElementById("imgPanel"),path = document.getElementById("Path");
C.addHandler(SelRoot,"change",function(e){
	path.value = SelRoot.value;
	if(SelRoot.value!=0){
		C.post("/files/getFiles",{path:SelRoot.value},function(result){
			var files = JSON.parse(result).files,
				host = location.host,container;
				container = document.createElement("div")
			files.forEach(function(file){
				img = document.createElement("img");
				img.src = "http://"+host + "/" + SelRoot.value + file;
				container.appendChild(img)
			})
			panel.innerHTML = container.innerHTML;
		},function(){
			alert("获取文件出错")
		})
	}
})

var $colBox = C.getElementsByClass("news")[0];
C.addHandler($colBox,"click",function(e){
	var e = e||window.event;
	var target = e.target||e.srcElement;
	if(!C.hasClass(target,"collect")||!C.hasClass(target,"admin"))
		return;
	else{
		var params = {id:target.getAttribute("data-id"),isCollect:target.getAttribute("data-collect")};
		C.get("/news/collect",params,function(d){
			var d = JSON.parse(d);
			if(d.msg=="ok"){
				if(params.isCollect=="false"){
					target.innerHTML = "已收藏";
					target.setAttribute("data-collect","true");
				}else{
					target.innerHTML = "添加收藏";
					target.setAttribute("data-collect","false");
				}
			}
		})
	}
})