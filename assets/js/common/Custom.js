var Custom = {
    ie6:!-[1,]&&!window.XMLHttpRequest,
    addHandler:function(target,event,handler){//事件绑定
        if(window.addEventListener){
            this.addHandler = function(target,event,handler){
                target.addEventListener(event,handler,false);
            }
        }else if(window.attachEvent){
            this.addHandler = function(target,event,handler){
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
    getElementsByClass:function(cls,tag){
        if(document.getElementsByClassName){
            this.getElementsByClass = function(cls){
                return document.getElementsByClassName(cls);
            }
        }
        else{
            this.getElementsByClass = function(cls,tag){
                var eles = [],tags;
                tag = tag||"*";
                tags = document.getElementsByTagName(tag);
                for(var i = 0,length=tags.length;i<length;i++){
                    if(Custom.hasClass(tags[i],cls)){
                        eles.push(tags[i])
                    }
                }
                return eles;
            }
        }
        return this.getElementsByClass(cls,tag);
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
    }

}