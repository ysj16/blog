var C = Custom = {
    ie6:!-[1,]&&!window.XMLHttpRequest,
    addHandler:function(target,event,handler){//事件绑定
        if(window.addEventListener){
            this.addHandler = function(target,event,handler){
                if(target)
                    target.addEventListener(event,handler,false);
            }
        }else if(window.attachEvent){
            this.addHandler = function(target,event,handler){
                if(target)
                    target.attachEvent("on"+event,handler)
            }
        }
        this.addHandler(target,event,handler);
    },
    /*类处理函数*/
    hasClass:function(ele,cls){
        var reg = new RegExp("(^|\\s)"+cls+"(\\s|$)"),className = ele.className;
        return reg.test(className);
    },
    addClass:function(ele,name){
        var cls = ele.className;
        if(!Custom.hasClass(ele,name)){
            cls += (" " + name);
        }
        ele.className = cls;
    },
    removeClass:function(ele,name){
        var cls = ele.className;
        if(Custom.hasClass(ele,name)){
            cls = cls.replace(name,"")
        }
        cls = Custom.trim(cls);
        ele.className = cls;
    },
    /*由class获取dom*/
    getElementsByClass:function(cls,parent){
        if(document.getElementsByClassName){
            this.getElementsByClass = function(cls,parent){
                var ele = parent || document;
                return ele.getElementsByClassName(cls);
            }
        }
        else{
            this.getElementsByClass = function(cls,parent){
                var eles = [],all;
                parentEle = parent || document;
                all = parentEle.getElementsByTagName("*");
                for(var i = 0,length=all.length;i<length;i++){
                    if(Custom.hasClass(all[i],cls)){
                        eles.push(all[i])
                    }
                }
                return eles;
            }
        }
        return this.getElementsByClass(cls,parent);
    },
    /*字符串处理*/
    //去掉首尾空字符
    trim:function(str){
        var reg = /^\s*|\s*$/g;
        return str.replace(reg,"");
    },

    /*生成间隔一定时间才执行的函数*/
    debounce:function(fn,delay){
        var timeout;
        return function(){
            if(!timeout) {
                timeout = setTimeout(function () {
                    clearTimeout(timeout);
                    timeout = null;
                    fn();
                }, delay)
            }
        }
    },


    /*ajax*/
    createXMLHTTPRequest:function() {     
        var xmlHttpRequest;  
        if (window.XMLHttpRequest) {     
            xmlHttpRequest = new XMLHttpRequest();     
         //针对某些特定版本的mozillar浏览器的BUG进行修正     
            if (xmlHttpRequest.overrideMimeType) {     
             xmlHttpRequest.overrideMimeType("text/xml");     
            }     
        } else if (window.ActiveXObject) {
            xmlHttpRequest = new ActiveXObject("MSXML2.XMLHTTP")||new ActiveXObject("Microsoft.XMLHTTP");     
            // var activexName = [ "MSXML2.XMLHTTP", "Microsoft.XMLHTTP" ];     
            // for ( var i = 0; i < activexName.length; i++) {     
            //     xmlHttpRequest = new ActiveXObject(activexName[i]);   
            //     if(xmlHttpRequest){  
            //         break;  
            //     }  
            // }     
        }     
        return xmlHttpRequest;  
    },
    get:function (url,params,onSuccess,onError){  
        var req = this.createXMLHTTPRequest(),pStr = "";  
        if(req){
            for(var i in params){
                pStr += (i + "=" + params[i]+"&")
            }
            if(pStr)
                pStr = pStr.slice(0,pStr.length-1)
            req.open("GET", url + "?" + pStr, true);  
            req.onreadystatechange = function(){  
                if(req.readyState == 4){  
                    if(req.status == 200){
                        onSuccess&&onSuccess(req.responseText);
                    }else{
                        onError&&onError();
                    }  
                }  
            }  
            req.send(null);  
        }  
    },
    post:function(url,params,onSuccess,onError){
        var req = this.createXMLHTTPRequest(),pStr="";
        if(req){
            for(var i in params){
                pStr += (i + "=" + params[i]+"&")
            }
            if(pStr)
                pStr = pStr.slice(0,pStr.length-1)
            req.open("POST",url, true);
            req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
            req.send(pStr);
            req.onreadystatechange = function(){
                if(req.readyState == 4){
                    if(req.status == 200){
                        onSuccess&&onSuccess(req.responseText);
                    }else{
                        onError&&onError();
                    }
                }
            }
        }
    }

}