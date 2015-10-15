~function(){
	var $colBox = C.getElementsByClass("news")[0];
	C.addHandler($colBox,"click",function(e){
		var e = e||window.event;
		var target = e.target||e.srcElement;
		if(!C.hasClass(target,"collect"))
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
			//alert(target.getAttribute("data-id"))
		}
	})
}()