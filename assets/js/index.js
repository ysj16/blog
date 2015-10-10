~function(){
	var $colBox = C.getElementsByClass("news")[0];
	C.addHandler($colBox,"click",function(e){
		var e = e||window.event;
		var target = e.target||e.srcElement;
		if(!C.hasClass(target,"collect"))
			return;
		else{
			C.get("/news/collect",{id:target.getAttribute("data-id"),isCollect:target.getAttribute("data-collect")},function(d){
				console.log(d)
			})
			//alert(target.getAttribute("data-id"))
		}
	})
}()