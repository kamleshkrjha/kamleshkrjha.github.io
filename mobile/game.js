/*$(function(){
   

});*/

var canvas = document.getElementById("myCanvas");
    canvas.width=360;
    canvas.height=300;  
var count;
var ctx = myCanvas.getContext("2d");
var coins;
var catcher;
var radiusOfCoin=10;
var gapBetweenCoins=4;
var start=$("#start"), pause=$("#pause"),resume=$("#resume"), exit=$("#exit");

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
        pause.removeClass("hide");
        exit.removeClass("hide");
    });

    pause.on("click", function(e){
        for (var i = 0; i < coins.length; i++) {
            var _this=coins[i];
            _this.removeTimers();
            
        }
        $(this).addClass("hide");
        resume.removeClass("hide");
        exit.removeClass("hide");
    });

    resume.on("click", function(e){
        for (var i = 0; i < coins.length; i++) {
            var _this=coins[i];
            _this.move();
            $(this).addClass("hide");
            pause.removeClass("hide");
            exit.removeClass("hide");
        }
    });

    exit.on("click", function(e){
        for (var i = 0; i < coins.length; i++) {
            var _this=coins[i];
            _this.removeTimers();           
        }
        ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.font="50px Georgia";
        ctx.fillStyle="red";
        ctx.fillText("Game Over!",20,100);
        coins=[];
        $('body').off("keydown");
        $(this).addClass("hide");
        pause.addClass("hide");
        resume.addClass("hide");
        start.removeClass("hide");
        
    });
    
   

}

var initalizeGame=function(ctx, r){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        count=0;
        coins=[];
        //var r=10;
        var noOfCoins=canvas.width/(2*(r+gapBetweenCoins));
        for (var i = 0; i < noOfCoins; i++) {
            coins.push(new Coin({x:(r+gapBetweenCoins)*(i*2+1), y:-30}, r, getRandom(20)/2, ctx,getRandom(10)%3?false:true));
        }
        /*coins.push(new Coin({x:30, y:-30}, r, 9, ctx,true)); // true for bombs
        coins.push(new Coin({x:90, y:-30}, r, 10, ctx));
        coins.push(new Coin({x:150, y:-30}, r, 5, ctx, true));
        coins.push(new Coin({x:210, y:-30}, r, 4, ctx));
        coins.push(new Coin({x:270, y:-30}, r, 0, ctx, true));
        coins.push(new Coin({x:330, y:-30}, r, 5, ctx));*/
    
        //create catcher
    
        catcher=new Catcher();
        catcher.create();
    
         $(".count").text(count);
         //bind event for catcher
         catcherNavEvents();
};

function catcherNavEvents(){
        $('canvas').on("swipeleft", function(){
            if(catcher.x-catcher.dx>0){
                        catcher.clear();
                        catcher.x=catcher.x-catcher.dx;
                        catcher.create();
                    }
        });

        $('canvas').on("swiperight", function(){
             if(catcher.x+catcher.w+catcher.dx<canvas.width){
                        catcher.clear();
                        catcher.x=catcher.x+catcher.dx;
                        catcher.create();
                    }
        });
     /*  $('body').on("keydown",function (evt) {
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
            }
    });*/
}


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
    this.isBomb?ctx.fillStyle="red":ctx.fillStyle="#E8BF19";
        ctx.fill();
    
    };
Coin.prototype.move=function(){
    //var that=this;
        this.timer=setInterval(function(){
            this.clear();
            this.lastPos.y=this.lastPos.y+1;
            if(this.lastPos.y-this.r-1 > canvas.height){//if the coin has crossed the bottom line 
                //console.log(this.initialPos); 
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

                
            }else if(this.lastPos.y+this.r-1>=catcher.y && (this.lastPos.x+this.r>=catcher.x && this.lastPos.x-this.r<=catcher.x+catcher.w)){//if coin has contact with catcher, increase count and reset coins position
                if(this.isBomb){
                //GameOver
                   // alert("bomb explodede.. Game Over !!");
                    exit.trigger("click");                    
                    return;
                }
                   ctx.clearRect(this.lastPos.x-this.r-5,this.lastPos.y-1-this.r-5,2*(this.r+5),2*(this.r+5));
                catcher.clear();
                catcher.create();
                count=count+1;
                $(".count").text(count);
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

    bindEvents(); 




	
	