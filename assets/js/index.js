~function(){
	var $colBox = C.getElementsByClass("news")[0];
	C.addHandler($colBox,"click",function(e){
		var e = e||window.event;
		var target = e.target||e.srcElement;
		if(!C.hasClass(target,"collect"))
			return;
		else{
			C.get("/news/collect11",{id:11,id2:22},function(){
				console.log(111)
			})
			//alert(target.getAttribute("data-id"))
		}
	})
}()