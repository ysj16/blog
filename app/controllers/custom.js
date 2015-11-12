exports.DateFormat = function(date){
	var str = "";
	str += date.getFullYear() + "年" + (date.getMonth()+ 1) + "月" + date.getDay() + "日";
	return str;
}