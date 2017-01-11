var Direction = function(direction){
	 this.dom = null;
	 this.init(direction);
	 return this.dom;
}
Direction.prototype = {
	directionMap :{
		"up":"up",
		"down":"down",
		"left":"left"
		"right":"right"
	}
	init : function(direction){
		var b = document.createElement('b');
		b.className = this.directionMap[direction];
		b.direction = direction;
		b.bingo = this.bingo;
		this.dom = b;
	}
	bingo : function(){
		this.className += 'bingo';
	}
}
var Panel = function(){
    //背景dom元素
    this.dom = null;
    //生成的方向类集合
    this.directionList = [];
    //目前输入到第几个方向
    this.inputNum = 0;
    //连击数
    this.actcount = 0;
    
    this.init();
}
Panel.prototype = {
    //数字对应方向
    map : {
        1:"up",
        2:"down",
        3:"left",
        4:"right"
    },
    //每次出现多少个方向
    count : 4,
    //初始化
    init : function(){
        
        var _this = this;
        
        this.dom = document.getElementById('panel');
        
        this.dom.focus();
        
        this.dom.onkeydown = function(e){_this.keydown(e);};
    },
    //显示所有方向
    showDirection : function(){
        
        for(var i=1;i <= this.count;i++){
            this.add();
        }
    },
    //清楚所有方向
    clearDirection : function(){
        
        for(var i=0,l=this.directionList.length;i < l;i++){
            var temp = this.directionList.pop();
            
            this.dom.removeChild(temp);
        }
    },
    //添加一个方向
    add : function(){
        
        var random = parseInt(Math.random()*4+1,10);
        
        var dir = new Direction(this.map[random]);
        
        this.directionList.push(dir);
        this.dom.appendChild(dir);
    },
    //按键事件
    keydown : function(e){
        e = e|| window.event;
        //阻止浏览器默认事件
        if(e.keyCode == 32 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){
            if(e.preventDefault)e.preventDefault();
            else e.returnValue = false;
        }
        else return;
        
        var direction;
        switch(e.keyCode){
            case 32:direction = 'space';this.inputNum--;break;
            case 37:direction = 'left';break;
            case 38:direction = 'up';break;
            case 39:direction = 'right';break;
            case 40:direction = 'down';break;
            default:direction = null;break;
        }
        
        this.inputNum++;
        this.checkInput(direction);
    },
    //检测用户输入方向
    checkInput : function(direction){
        //检测是否输入完成
        if (direction == 'space' && this.inputNum == this.directionList.length) {
            this.finish();
        }
        else {
            var dir = this.directionList[this.inputNum - 1];
            //检测是否按键正确
            if (this.inputNum > 0 && direction != null && dir.direction == direction) {
                dir.bingo();
            }
            else this.lose();
        }
    },
    //完成一轮方向输入
    finish : function(){
        
        this.actcount += 1;
        document.getElementById('actcount').innerHTML = this.actcount;
        this.actEffor();
        //随机下轮出现的方向数
        this.count = parseInt(Math.random()*4+5,10);
        //重置
        this.reset();
        //显示方向
        this.showDirection();
        //清理一些手尾
        this.onend();
    },
    //用户输入错误或者时间到
    lose : function(){
        alert('遊戲結束，遊玩了：'+this.actcount+"回合");
        
        this.count = 4;
        this.actcount = 0;
        document.getElementById('actcount').innerHTML = this.actcount;
        this.reset();
        
        this.onend();
        this.onlose();
    },
    //用户正确输入一轮方向后，连击数的效果
    actEffor : function(){
        
        var flag = 0,
        colorMap = {
            0:"Red",
            1:"Blue",
            2:"Orange",
            3:"White"
        };
        
        var process = function(){
            
            document.getElementById('actcount').style.color = colorMap[flag];
            flag++;
            
            if(flag <= 3){
                setTimeout(process,100);
            }
        }
        process();
    },
    //重置
    reset : function(){
        
        this.clearDirection();
        this.inputNum = 0;
    },
    onend : function(){},
    onlose: function(){}
}
var Game = {
    //背景类的dom
    panel : null,
    //时间进度条dom
    range : null,
    //每轮时间，毫秒
    rangetime : 4000,
    //目前进度
    nowrange : 0,
    //时间进度循环ID
    rangid : null,
    //开始按钮
    startbtn : null,
    //初始化
    init : function(){
        //获取进度条
        this.range = document.getElementById('range');
        //新建游戏背景
        this.panel = new Panel();
        //清理手尾事件
        this.panel.onend = function(){
                    
            Game.nowrange = 0;
            Game.range.style.width = 0 + 'px';
        };
        //游戏输了触发事件
        this.panel.onlose = function(){
            clearInterval(Game.rangid);
            
            Game.startbtn.disabled = '';
            Game.startbtn.focus();
        };
        //显示方向
        this.panel.showDirection();
        //开始计时
        this.startTime();
    },
    //计时
    startTime : function(){
        
        var per = 10,ftime = this.rangetime/20,_this = this;
        
        var process = function(){
            
            _this.nowrange += 5;
            if(_this.nowrange <= 100){
                _this.range.style.width = _this.nowrange * 2 + 'px';
            }
            else {
                _this.panel.lose();
            }
        }
        this.rangid = setInterval(process,ftime);
    },
    //开始
    start : function(obj){
        
        this.startbtn = obj;
        this.startbtn.disabled = 'true';
        
        if(!this.panel){
            this.init();
        }
        else {
            this.startTime();
            this.panel.showDirection();
            this.panel.dom.focus();
        }
    }
}