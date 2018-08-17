var game={
	DIVCOUNT:9,//保存div总数
	container:null,//保存装9个div的容器
	position:[],//保存9个div的初始位置
	divs:null,//保存9个div的集合
	moveDivTarget:null,//保存当下被鼠标按下的div,也就是需要跟着鼠标移动的div
	targetTop:null,//保存当下被鼠标按下的div的top,
	targetLeft:null,//保存当下被鼠标按下的div的left,
	exchangeDiv:null,//保存鼠标松开时需要交换位置的div
	mask:null,//保存游戏开始或者结束时的遮罩层
	isDivDown:false,//判断div是否按下

	timer:null,//保存div移动时动画序号
	STEPS:10,//保存总步数为100步
	INTERVAL:300,//保存div移动的总时间
	moved:0,//保存已经移动的步数
	interval:0,//保存每步移动的时间
	
	moveArr:[],//保存要移动的div

	leftWidth:0,

	init:function()
	{
		var me=this;
		this.position=[{'top':'0px','left':'0px'},//初始化定义每个div的position，也就是游戏结束时，每个div的位置
					   {'top':'0px','left':'200px'},
						{'top':'0px','left':'400px'},
						{'top':'200px','left':'0px'},
						{'top':'200px','left':'200px'},
						{'top':'200px','left':'400px'},
						{'top':'400px','left':'0px'},
						{'top':'400px','left':'200px'},
						{'top':'400px','left':'400px'}];
		this.container=document.getElementsByClassName('container')[0];
		this.interval=this.INTERVAL/this.STEPS;
		//动态生成DIVCOUNT个div
		this.mask=document.getElementsByClassName('mask')[0];
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.DIVCOUNT;i++)
		{
			var div=document.createElement('div');
			div.className='div'+(i+1);
			frag.appendChild(div);
		}
		this.container.appendChild(frag);

		this.divs=document.querySelectorAll('.container div');

		//游戏开始之前，初始化每个div的位置
		this.inPosition();

		//鼠标按下
		this.container.addEventListener('mousedown',this.mousedownDIV.bind(this));
		//document.body.addEventListener('mousedown',this.mousedownDIV.bind(this));

		//鼠标松开
		//this.container.addEventListener('mouseup',this.mouseupDIV.bind(this));
		//document.body.addEventListener('mouseup',this.mouseupDIV.bind(this));
		window.addEventListener('mouseup',this.mouseupDIV.bind(this));

		//button按下时开始游戏
		document.getElementsByTagName('button')[0].addEventListener('click',function(e){
			me.randomPosition();
		})
	},
	inPosition:function()
	{
		for(var i=0;i<this.divs.length;i++)
		{
			this.divs[i].style.top=this.position[i].top;
			this.divs[i].style.left=this.position[i].left;
		}
	},
	randomPosition:function()
	{
		this.mask.style.display="none";
		var di=0;
		
		var arr=[];
		while(arr.length!=9)
		{
			//生成0-8的整数
			var pi=parseInt(Math.random()*(8+1));
			if(arr.indexOf(pi)==-1&&di!=pi&&this.position[pi].top!=this.divs[di].top&&this.position[pi].left!=this.divs[di].left)
			{
				arr.push(pi);
				var finalTop=this.position[pi].top;
				var finalLeft=this.position[pi].left;
				var initialDiv=this.divs[di];
				this.moveArr[this.moveArr.length]=[finalTop,finalLeft,initialDiv];

				this.divs[di].style.zIndex=1;
				di++;
			}
		}
		this.animate();
	},
	mousedownDIV:function(e)
	{
		var me=this;
		e=window.event||event;
		me.moveDivTarget=e.target;
		me.targetTop=me.moveDivTarget.style.top;
		me.targetLeft=me.moveDivTarget.style.left;
		me.isDivDown=true;
		me.leftWidth=(window.innerWidth-600)/2;
		var origX=e.clientX-me.leftWidth-parseFloat(me.targetLeft);
		var origY=e.clientY-8-parseFloat(me.targetTop);
		
		//鼠标滑动
		//this.container.onmousemove=function()
		document.body.onmousemove=function()
		{
			var x=event.clientX-me.leftWidth;
			var y=event.clientY-8;
			
			/*更改target的position*/
			me.moveDivPosition(x,y,origX,origY);
			

			//清除所有的opacity为0.5
			for(var i=0;i<me.divs.length;i++)
			{
				me.divs[i].style.opacity='1';
			}

			/*找到鼠标对应位置的div，设为opacity为0.5*/
			if(x>0&&x<200&&y>0&&y<200&&(me.targetTop!='0px'||me.targetLeft!='0px'))//top=0px,left=0px
			{
				for(var i=0;i<me.divs.length;i++)
				{
					if(me.divs[i].style.top=='0px'&&me.divs[i].style.left=='0px')
					{
						me.exchangeDiv=me.divs[i];
						me.divs[i].style.opacity='.5';
						break;
					}
				}
			}
			if(x>200&&x<400&&y>0&&y<200&&(me.targetTop!='0px'||me.targetLeft!='200px'))//top=0px,left=200px
			{
				for(var i=0;i<me.divs.length;i++)
				{
					if(me.divs[i].style.top=='0px'&&me.divs[i].style.left=='200px')
					{
						me.exchangeDiv=me.divs[i];
						me.divs[i].style.opacity='.5';
						break;
					}
				}
			}
			if(x>400&&x<600&&y>0&&y<200&&(me.targetTop!='0px'||me.targetLeft!='400px'))//top=0px,left=400px
			{
				for(var i=0;i<me.divs.length;i++)
				{
					if(me.divs[i].style.top=='0px'&&me.divs[i].style.left=='400px')
					{
						me.exchangeDiv=me.divs[i];
						me.divs[i].style.opacity='.5';
						break;
					}
				}
			}
			if(x>0&&x<200&&y>200&&y<400&&(me.targetTop!='200px'||me.targetLeft!='0px'))//top=200px,left=0px
			{
				for(var i=0;i<me.divs.length;i++)
				{
					if(me.divs[i].style.top=='200px'&&me.divs[i].style.left=='0px')
					{
						me.exchangeDiv=me.divs[i];
						me.divs[i].style.opacity='.5';
						break;
					}
				}
			}
			if(x>200&&x<400&&y>200&&y<400&&(me.targetTop!='200px'||me.targetLeft!='200px'))//top=200px,left=200px
			{
				for(var i=0;i<me.divs.length;i++)
				{
					if(me.divs[i].style.top=='200px'&&me.divs[i].style.left=='200px')
					{
						me.exchangeDiv=me.divs[i];
						me.divs[i].style.opacity='.5';
						break;
					}
				}
			}
			if(x>400&&x<600&&y>200&&y<400&&(me.targetTop!='200px'||me.targetLeft!='400px'))//top=200px,left=400px
			{
				for(var i=0;i<me.divs.length;i++)
				{
					if(me.divs[i].style.top=='200px'&&me.divs[i].style.left=='400px')
					{
						me.exchangeDiv=me.divs[i];
						me.divs[i].style.opacity='.5';
						break;
					}
				}
			}
			if(x>0&&x<200&&y>400&&y<600&&(me.targetTop!='400px'||me.targetLeft!='0px'))//top=400px,left=0px
			{
				for(var i=0;i<me.divs.length;i++)
				{
					if(me.divs[i].style.top=='400px'&&me.divs[i].style.left=='0px')
					{
						me.exchangeDiv=me.divs[i];
						me.divs[i].style.opacity='.5';
						break;
					}
				}
			}
			if(x>200&&x<400&&y>400&&y<600&&(me.targetTop!='400px'||me.targetLeft!='200px'))//top=400px,left=200px
			{
				for(var i=0;i<me.divs.length;i++)
				{
					if(me.divs[i].style.top=='400px'&&me.divs[i].style.left=='200px')
					{
						me.exchangeDiv=me.divs[i];
						me.divs[i].style.opacity='.5';
						break;
					}
				}
			}
			if(x>400&&x<600&&y>400&&y<600&&(me.targetTop!='400px'||me.targetLeft!='400px'))//top=400px,left=400px
			{
				for(var i=0;i<me.divs.length;i++)
				{
					if(me.divs[i].style.top=='400px'&&me.divs[i].style.left=='400px')
					{
						me.exchangeDiv=me.divs[i];
						me.divs[i].style.opacity='.5';
						break;
					}
				}
			}
		};
	},
	mouseupDIV:function(e)
	{
		if(this.isDivDown==true)
		{
			this.moveDivTarget.style.zIndex=1;//鼠标松开时将zIndex恢复为初始值
			this.isDivDown=false;
			//移除鼠标滑动事件
			document.body.onmousemove=function(){};

			//清除所有的opacity为0.5
			for(var i=0;i<this.divs.length;i++)
			{
				this.divs[i].style.opacity='1';
			}

			//当鼠标松开时交换位置
			this.exchange();
		}
	},
	showCongra:function()
	{
		var me=this;
		this.mask.style.display='block';
		document.getElementsByTagName('button')[0].style.display="none";
		document.querySelector('.gameover').style.display="block";;
		var span=document.querySelector('.mask span');
		span.onclick=function()
		{
			document.querySelector('.gameover').style.display="none";
			me.randomPosition();
		};
	},
	exchange:function()
	{
		if(this.exchangeDiv)
		{
			var finalTop=this.targetTop;
			var finalLeft=this.targetLeft;
			var initialDiv=this.exchangeDiv;
			this.moveArr[this.moveArr.length]=[finalTop,finalLeft,initialDiv];

			finalTop=this.exchangeDiv.style.top;
			finalLeft=this.exchangeDiv.style.left;
			initialDiv=this.moveDivTarget;
			this.moveArr[this.moveArr.length]=[finalTop,finalLeft,initialDiv];
			
			//调用动画函数,移动exchageDiv,moveDivTarget
			this.animate();
		}else {
			//调用动画函数,移动moveDivTarget
			var finalTop=this.targetTop;
			var finalLeft=this.targetLeft;
			var initialDiv=this.moveDivTarget;
			this.moveArr[this.moveArr.length]=[finalTop,finalLeft,initialDiv];
			this.animate();
		}
	},
	isGameOver:function()
	{
		for(var i=0;i<this.divs.length;i++)
		{
			if(this.divs[i].style.top!=this.position[i].top||this.divs[i].style.left!=this.position[i].left)
			{
				return false;
			}
		}
		return true;
	},
	moveDivPosition:function(x,y,origX,origY)
	{
		this.moveDivTarget.style.zIndex=10;
		if(x<origX)
		{
			this.moveDivTarget.style.left='0';
		}
		else if(x>400+origX)
		{
			this.moveDivTarget.style.left='400px';
		}else {
			this.moveDivTarget.style.left=x-origX+"px";
		}

		if(y<origY)
		{
			this.moveDivTarget.style.top='0';
		}
		else if(y>400+origY)
		{
			this.moveDivTarget.style.top='400px';
		}else {
			this.moveDivTarget.style.top=y-origY+"px";
		}
	},
	animate:function()
	{
		for(var i=0;i<this.moveArr.length;i++)
		{
			var finalTop=this.moveArr[i][0];
			var finalLeft=this.moveArr[i][1];
			var initialDiv=this.moveArr[i][2];
			initialDiv.style.zIndex=5;

			var distancesTop=parseFloat(finalTop)-parseFloat(initialDiv.style.top);
			var distancesLeft=parseFloat(finalLeft)-parseFloat(initialDiv.style.left);
			
			var stepTop=distancesTop/this.STEPS;
			var stepLeft=distancesLeft/this.STEPS;

			this.moveArr[i][3]=stepTop;
			this.moveArr[i][4]=stepLeft;
		}
		this.timer=setTimeout(this.moveStep.bind(this),this.interval);
	},
	moveStep:function()//移动一步
	{
		
		for(var i=0;i<this.moveArr.length;i++)
		{
			var initialDiv=this.moveArr[i][2];
			
			initialDiv.style.top=parseFloat(initialDiv.style.top)+this.moveArr[i][3]+"px";
			initialDiv.style.left=parseFloat(initialDiv.style.left)+this.moveArr[i][4]+"px";
		}
		this.moved++;
		
		if(this.moved==this.STEPS)//移动完成之后清除所有的临时数据
		{
			clearTimeout(this.timer);
			this.timer=null;
			this.moved=0;
			this.moveDivTarget=null;
			this.exchangeDiv=null;
			for(var i=0;i<this.moveArr.length;i++)
			{
				this.moveArr[i][2].style.zIndex=1;//移动完成后将zIndex恢复为初始值
			}
			this.moveArr=[];
			if(this.isGameOver())//每次移动完成之后都判断是否gameover
			{
				this.showCongra();
			}
		}else {
			this.timer=setTimeout(this.moveStep.bind(this),this.interval);
		}
	}
}
game.init();