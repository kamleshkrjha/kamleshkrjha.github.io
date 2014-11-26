/*$(function(){
   

});*/

var canvas = document.getElementById("myCanvas");
    canvas.width=360;
    canvas.height=300;  
var count;
var ctx = myCanvas.getContext("2d");
var coins, bullets;
var catcher;
var radiusOfCoin=10;
var gapBetweenCoins=4;
var isPaused=false;
var level=0;
var levelTimer;
var levelInterval=30000 //30 sec
var levelTarget=0;
var start=$("#start"), exit=$("#exit");

var getRandom=function(k){
//get a random number here
/*console.log(Math.random(i));
return Math.random(i);*/
return Math.floor(Math.random()*k+1);
};



var bindEvents=function(){
    start.on("click", function(e){  
        initalizeGame(ctx, radiusOfCoin);
        for (var i = 0; i < coins.length; i++) {
            var _this=coins[i];
            _this.create();
            _this.move();
        }
        $(this).addClass("hide");        
        exit.removeClass("hide");
        level=0;
        levelTarget=0;
       checkLevel();
    });

    function checkLevel(){
    	if(levelTimer)clearTimeout(levelTimer);
        levelTarget += 30 + level*10;
        levelTimer=setTimeout(function(){
        	if(levelTarget > count){
        		//level failed
        		exit.trigger('click',['level failed']);
        	}else{
        		//level complete
        		level +=1;
        		checkLevel();
        	}
        },levelInterval);
    }

    exit.on("click", function(e,param1){
        for (var i = 0; i < coins.length; i++) {
            coins[i].removeTimers();
            
        }
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].removeTimers();
            
        }
        ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.font="50px Georgia";
        ctx.fillStyle="red";
        if(param1){
        ctx.fillText("Game Over! "+param1,20,100);	
        }else{
        ctx.fillText("Game Over! ",20,100);	
        }
        
        coins=[];
        $('body').off("keydown");
        $(this).addClass("hide");
        start.removeClass("hide");
        if(levelTimer)clearTimeout(levelTimer);
    }); 

}
bindEvents(); 
var initalizeGame=function(ctx, r){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        count=0;
        coins=[];
        bullets=[];
        //var r=10;
        var noOfCoins=canvas.width/(2*(r+gapBetweenCoins));
        for (var i = 0; i < noOfCoins; i++) {
            coins.push(new Coin({x:(r+gapBetweenCoins)*(i*2+1), y:-30}, r, getRandom(20)/2, ctx,getRandom(10)%3?false:true));
        }
      
    
        //create catcher
    
        catcher=new Catcher();
        catcher.create();
    
         $(".count").text(count);
         //bind event for catcher 
    bindGameControls();
};

var bindGameControls=function(){
    $('body').on("keydown",function (evt) {
        evt.preventDefault();
        //console.log(evt.keyCode);
            switch (evt.keyCode) {
                // Left arrow. 
                case 37:
                    
                    if(catcher.x-catcher.dx>0){
                        catcher.clear();
                        catcher.x=catcher.x-catcher.dx;
                        catcher.create();
                    }
                    
                    break;
                // up arrow
                case 38:
                    if(catcher.y === canvas.height-catcher.h){
                        catcher.clear();
                        catcher.y=catcher.y-2*catcher.dx;
                        catcher.create();
                        var jumpTimer=setTimeout(function(){
                            catcher.clear();
                            catcher.y=catcher.y+2*catcher.dx;
                            catcher.create();
                            //clearTimeout(jumpTimer);
                        },200);

                    }
                   
                    break;

                // Right arrow. 
                case 39:
                    if(catcher.x+catcher.w+catcher.dx<canvas.width){
                        catcher.clear();
                        catcher.x=catcher.x+catcher.dx;
                        catcher.create();
                    }
                   
                    break;
                case 32:
                    //space bar for shoot                    
                    var bullet=new Bullet(catcher.x+catcher.w/2, catcher.y);
                    bullets.push(bullet);
                    bullet.create();
                    bullet.move();
                    break;
                case 13:
                    //enter key play/pause
                    if(isPaused){
                    //resume
                        isPaused=false;
                        for (var i = 0; i < coins.length; i++) {            
                            coins[i].move();

                        }
                        for (var i = 0; i < bullets.length; i++) {
                            bullets[i].move();

                        }
                    }else{
                    //pause
                        isPaused=true;
                        for (var i = 0; i < coins.length; i++) {
                            coins[i].removeTimers();
            
                        }
                        for (var i = 0; i < bullets.length; i++) {
                            bullets[i].removeTimers();
            
                        }
                    }
                    break;
            }
    });
};
//player
var Catcher=function(){    
    this.w=2*(radiusOfCoin+gapBetweenCoins);
    this.h=3*(radiusOfCoin+gapBetweenCoins);
    this.x=canvas.width/2-this.w/2,
    this.y=canvas.height-this.h,
    this.dx=20, //can be equal to this.w
    this.create=function(){
        ctx.fillStyle="#3399FF";

        //ctx.fillRect(catcher.x, catcher.y, catcher.w, catcher.h);  
        ctx.beginPath();
        ctx.rect(this.x,this.y,radiusOfCoin/2,this.h/3); //left hand
        ctx.arc(this.x+this.w/2, this.y+gapBetweenCoins+radiusOfCoin/2,radiusOfCoin/2,0, 2*Math.PI); //head
        ctx.rect(this.x+this.w-radiusOfCoin/2,this.y,radiusOfCoin/2,this.h/3); //right hand
        ctx.rect(this.x+radiusOfCoin/2, this.y+this.h/3, radiusOfCoin+2*gapBetweenCoins,this.h/3); //body
        ctx.rect(this.x+radiusOfCoin/2, this.y+2*this.h/3, radiusOfCoin/2,this.h/3); //left leg
        ctx.rect(this.x+radiusOfCoin+2*gapBetweenCoins, this.y+2*this.h/3, radiusOfCoin/2,this.h/3); //right leg
        ctx.closePath();
        ctx.fill();
    },
    this.clear=function(){ 
        ctx.clearRect(catcher.x, catcher.y, catcher.w, catcher.h);
    }
};

//object of game
var Coin=function(initialPos, r, delay, ctx, isBomb){
    this.initialPos=initialPos;
    this.r=r;
    this.delay=delay;
    this.ctx=ctx;
    this.lastPos;
    this.timer;
    this.isBomb=isBomb;
};

Coin.prototype.clear=function(){
    if(!this.lastPos)this.lastPos={},this.lastPos.x=this.initialPos.x, this.lastPos.y=this.initialPos.y;
    ctx.clearRect(this.lastPos.x-this.r-gapBetweenCoins,this.lastPos.y-this.r-gapBetweenCoins,2*(this.r+gapBetweenCoins),2*(this.r+gapBetweenCoins));
};

Coin.prototype.create=function(){
        if(!this.lastPos)this.lastPos={}, this.lastPos.x=this.initialPos.x, this.lastPos.y=this.initialPos.y;       
        ctx.beginPath();
        ctx.arc(this.lastPos.x,this.lastPos.y,this.r,0,2*Math.PI);
    this.isBomb?ctx.fillStyle="red":ctx.fillStyle="gold";
        ctx.fill();
    
    };
Coin.prototype.init=function(){
    //ctx.clearRect(this.lastPos.x-this.r-5,this.lastPos.y-1-this.r-5,2*(this.r+5),2*(this.r+5));
    if(typeof Object.create === "function"){
        this.lastPos=Object.create(this.initialPos); 
    }
    else{
        this.lastPos.x=this.initialPos.x;
        this.lastPos.y=this.initialPos.y;
    }
    //bomb or coin and different delay
    getRandom(20)%3?this.isBomb=false:this.isBomb=true; // this should also be decided randomly
    this.delay=getRandom(10)/2;
    //need to find a random delay
    clearInterval(this.timer);
    this.create();
    this.move();
};

Coin.prototype.move=function(){
    //var that=this;
        this.timer=setInterval(function(){
            this.clear();
            this.lastPos.y=this.lastPos.y+1;
            if(this.lastPos.y-this.r-1 > canvas.height){//if the coin has crossed the bottom line 
                //console.log(this.initialPos); 
                this.init();

                
            }else if(this.lastPos.y+this.r-1>=catcher.y && (this.lastPos.x+this.r>=catcher.x && this.lastPos.x-this.r<=catcher.x+catcher.w)){//if coin has contact with catcher, increase count and reset coins position
                if(this.isBomb){
                //GameOver
                   // alert("bomb explodede.. Game Over !!");
                    exit.trigger("click");                    
                    return;
                }                   
                catcher.clear();
                catcher.create();
                count=count+1;
                $(".count").text(count);
                this.init();
                /*if(typeof Object.create === "function"){
                this.lastPos=Object.create(this.initialPos); 
                }
                else{
                    this.lastPos.x=this.initialPos.x;
                    this.lastPos.y=this.initialPos.y;
                }
                //bomb or coin and different delay
                getRandom(20)%3?this.isBomb=false:this.isBomb=true; // this should also be decided randomly
                this.delay=getRandom(10)/2;
                //need to find a random delay
                clearInterval(this.timer);
                this.create();
                this.move();*/
             
            
            }
            else{                
                //this.lastPos.y=this.lastPos.y+1;
                this.create();
            }           
            }.bind(this),this.delay);
    };

Coin.prototype.removeTimers=function(){
        if(this.timer)clearInterval(this.timer);
    };

// bullet object
var Bullet=function(posX, posY){
    var width=6;
    var height=6;
    this.x=posX,
    this.y=posY;
    this.timer;
    this.getWidth=function(){return width};
    this.getHeight=function(){return height};
    this.coinIndex=Math.floor(posX/(2*(radiusOfCoin+gapBetweenCoins)));    
};

Bullet.prototype.create=function(){
    ctx.fillStyle="black";
    ctx.fillRect(this.x,this.y,this.getWidth(), this.getHeight());
};
Bullet.prototype.clear=function(){
    ctx.clearRect(this.x,this.y, this.getWidth(), this.getHeight());
};

Bullet.prototype.removeTimers=function(){
    if(this.timer)clearInterval(this.timer);
};
 
Bullet.prototype.move=function(){
    this.timer=setInterval(function(){
        this.clear();        
        this.y=this.y-1;
        if(this.y==0){
            this.removeTimers();
        }else if(this.y<=coins[this.coinIndex].lastPos.y+2*radiusOfCoin){
            //kill this bullet and initialize that coin againcoins[this.coinIndex] add 2 points
            count=count+2;
            $(".count").text(count);
            coins[this.coinIndex].clear();
            coins[this.coinIndex].init();
            this.removeTimers();
        }else
        this.create();
    }.bind(this),0);
};



    




	
	
