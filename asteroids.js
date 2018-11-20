var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");



var screenWidth = c.width;
var screenHeight = c.height;

//rotation point around an origin
function rotate(origin, point, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians);
        sin = Math.sin(radians);
        var result = {x: 0,y: 0};
        result.x = (cos * (point.x - origin.x)) + (sin * (point.y - origin.y)) + origin.x;
        result.y = (cos * (point.y - origin.y)) - (sin * (point.x - origin.x)) + origin.y;
    return result;
}
function sameSign(n1, n2){
    return n1*n2 > 0;
}
var eps = 0.0001;
function between(a, b, c) {
            return a-eps <= b && b <= c+eps;
        }
function intersect(point1, point2, point3, point4){
        var x1 = point1.x , y1 = point1.y;
        var x2 = point2.x , y2 = point2.y;
        var x3 = point3.x , y3 = point3.y;
        var x4 = point4.x , y4 = point4.y;

        /*
        console.log(point1);
        console.log(point2);      
        console.log(point3);
        console.log(point4);
        */

            var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4)) /
                    ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));

            var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4)) /
                    ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));

            //console.log("x: "+x+",y: "+y);
            if (isNaN(x)||isNaN(y)) {
                console.log("error");

                return false;
            } else {
                if (x1>=x2) {
                    if (!between(x2, x, x1)) {return false;}
                } else {
                    if (!between(x1, x, x2)) {return false;}
                }
                if (y1>=y2) {
                    if (!between(y2, y, y1)) {return false;}
                } else {
                    if (!between(y1, y, y2)) {return false;}
                }
                if (x3>=x4) {
                    if (!between(x4, x, x3)) {return false;}
                } else {
                    if (!between(x3, x, x4)) {return false;}
                }
                if (y3>=y4) {
                    if (!between(y4, y, y3)) {return false;}
                } else {
                    if (!between(y3, y, y4)) {return false;}
                }
            }
            return {x: x, y: y};
        }


function collision(polygon1, polygon2) {
    //console.log(polygon1);
    //console.log(polygon2);
    
    for(var i = 0;i < polygon1.length - 1;i++){
        for(var j = 0;j < polygon2.length - 1;j++){
            if(intersect(polygon1[i], polygon1[i+1], polygon2[j], polygon2[j+1])){
                console.log(intersect(polygon1[i], polygon1[i+1], polygon2[j], polygon2[j+1]));
                return true;
            }
        }  
    }    
    return false;
    
};


class Player{
    constructor(){
        this.move = this.move.bind(this);

        this.location = {x: screenWidth/2, y: screenHeight/2};
        this.direction = 0;
        this.maxspeed = 10;
        this.length = 10;
        this.rotationspeed = 20 ;
        this.movespeedX = 0;
        this.movespeedY = 0;
        this.maxspeed = 10;
        this.bullets = [];
        this.score = 0;
        this.lives = 3;

        this.d = new Date();
        this.lastshot = this.d.getTime();
        this.reloadDelay = 500;

        this.invincibleTime = 1000;
        this.deadTime = this.d.getTime();
        this.lastTick = this.d.getTime();
        this.isTurning = 0;
        this.isTrusting = false;
    }
    move(){
        this.movespeedX += Math.sin((Math.PI / 180) * this.direction) * 0.2;
        this.movespeedY += Math.cos((Math.PI / 180) * this.direction) * 0.2;
        if(Math.abs(this.movespeedX) > this.maxspeed ){
            this.movespeedX = this.maxspeed*Math.sign(this.movespeedX);
        }
        if(Math.abs(this.movespeedY) > this.maxspeed ){
            this.movespeedY = this.maxspeed*Math.sign(this.movespeedY);
        }


    }

    draw(){
        //initial triangle
        var point1 = {x: this.location.x ,                  y: this.location.y - this.length*2};
        var point2 = {x: this.location.x - this.length ,    y: this.location.y + this.length};
        var point3 = {x: this.location.x + this.length ,    y: this.location.y + this.length};
        var origin = {x: this.location.x,                   y: this.location.y};

        var point4 = {x:this.location.x - 5,                    y: this.location.y + this.length};
        var point5 = {x:this.location.x,                        y: this.location.y + this.length + 10};
        var point6 = {x:this.location.x + 5,                    y: this.location.y + this.length };
        


        //rotated triangle
        point1 = rotate(origin, point1, this.direction);
        point2 = rotate(origin, point2, this.direction);
        point3 = rotate(origin, point3, this.direction);
        point4 = rotate(origin, point4, this.direction);
        point5 = rotate(origin, point5, this.direction);
        point6 = rotate(origin, point6, this.direction);


        //drawing the triangle
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.lineTo(point3.x, point3.y);
        ctx.lineTo(point1.x, point1.y);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        if((this.d.getTime()-this.deadTime < this.invincibleTime)){
            ctx.stroke();
        }else{
            ctx.fill();
        }
        if(this.isTrusting === true){
            this.d = new Date();
            if((this.d.getTime()%100) > 50){
               ctx.moveTo(point4.x,point4.y);
                ctx.lineTo(point5.x,point5.y);
                ctx.lineTo(point6.x,point6.y);
           
                ctx.stroke(); 
            }
            
        }
        
        ctx.setTransform(1, 0, 0, 1, 0, 0);


    
        //draw bullets
        for(var i in this.bullets){
            this.bullets[i].draw();
        }
    }
    turn(sign){
        this.isTurning = sign;

    }
    collision(astroidspoly,astroidorigin){
        //calculating asteroids coordinates
        var points  = [];
        for(var i = 0;i< astroidspoly.length;i++){
            points.push({x: astroidspoly[i].x +astroidorigin.x,
                y: astroidspoly[i].y +astroidorigin.y});
        }

        var point1 = {x: this.location.x ,                  y: this.location.y - this.length*2};
        var point2 = {x: this.location.x - this.length ,    y: this.location.y + this.length};
        var point3 = {x: this.location.x + this.length ,    y: this.location.y + this.length};
        var origin = {x: this.location.x,                   y: this.location.y};

        point1 = rotate(origin, point1, this.direction);
        point2 = rotate(origin, point2, this.direction);
        point3 = rotate(origin, point3, this.direction);

        if( collision(points,[point1,point2,point3])){
            this.d = new Date();

            if((this.d.getTime()-this.deadTime > this.invincibleTime)){
                this.deadTime = this.d.getTime();
                this.lives -= 1;  
                console.log("colision");
            }
        }

        /*
        var distance = Math.sqrt (Math.pow((this.location.x - point.x),2)  +
                                  Math.pow((this.location.y - point.y),2) );
        if(distance < radius ){
            
            this.d = new Date();

            if((this.d.getTime()-this.deadTime > this.invincibleTime)){
                this.deadTime = this.d.getTime();
                this.lives -= 1;  
                console.log("colision");
            }
            
        }
        */
    }
    update(){
        //updateting bullets
        for(var i in this.bullets){
            if(!this.bullets[i]){
                continue;
            }
            this.bullets[i].update();
            //out of bound bullets
            let b = this.bullets[i]
            if(b.location.x < 0 || b.location.x > screenWidth || b.location.y < 0 ||b.location.y > screenHeight){
                this.bullets.splice(i,1);
            }
        }
        this.d = new Date();
        var elapsedTime = (this.d.getTime() - this.lastTick)/100;
        this.lastTick = this.d.getTime();

        this.location.x -=  this.movespeedX * elapsedTime;
        this.location.y -= this.movespeedY * elapsedTime;
        this.direction += this.rotationspeed * this.isTurning * elapsedTime;

        if(this.location.x < 0){
            this.location.x = screenWidth;
        }else if(this.location.x > screenWidth){
            this.location.x = 0;
        }
        if(this.location.y < 0){
            this.location.y = screenHeight;
        }else if(this.location.y > screenHeight){
            this.location.y = 0;
        }   

    }
    addbullet(){
       // this.bullets.push(new Bullet({x: 0,y: 50},{x: 20, y:0}))
       this.d = new Date();
        if((this.d.getTime() - this.lastshot) > this.reloadDelay){
            this.lastshot = this.d.getTime();

            this.bullets.push(new Bullet(rotate(this.location, {x: this.location.x -1, y: this.location.y - this.length*2 }, this.direction),
            {x: -Math.sin((Math.PI / 180) * this.direction), y: -Math.cos((Math.PI / 180) * this.direction) }) );
           
        }
         
    }
}

class Bullet{
    constructor(location, direction){
        this.location = {x:location.x,y:location.y};
        this.direction = {x:direction.x,y:direction.y};
        this.speed = 50;

        this.d = new Date();
        this.lastTick = this.d.getTime();
    }
    update(){
        this.d = new Date();
        var elapsedTime = (this.d.getTime() - this.lastTick)/100;
        this.lastTick = this.d.getTime();
        this.location.x += this.direction.x * elapsedTime * this.speed;
        this.location.y += this.direction.y * elapsedTime * this.speed;
    }
    draw(){
        ctx.fillRect(this.location.x, this.location.y, 3, 3);
    }
}

class Game{
    constructor(){
        

        this.gameloop = this.gameloop.bind(this);
        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);

        this.myPlayer = new Player();
        this.asteroids = [];
        this.explosions = [];
      //  this.asteroids.push(new Asteroid({x: 0, y: 300},{x: 5, y: 0}));
      //  this.asteroids.push(new Asteroid({x: 600, y: 0},{x: -10, y: 3}));

        this.leftKey = false;   //keycode 37
        this.rightKey = false;  //keycode 39
        this.upKey = false;     //keycode 38
        this.spaceKey = false;  //keycode 32

        this.lvl = 1;

        document.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp);

        this.gui = new Gui();
        this.startlvl(1);
    }
    startlvl(lvl){
        for(var i = 0; i <lvl*2; i++){


            this.asteroids.push(new Asteroid({x: Math.random()*screenWidth, y: Math.random()*screenHeight},
                                             {x: Math.random()*20 - 10, y: Math.random()*20 - 10},60));

        }
        this.d = new Date();
        this.myPlayer.deadTime = this.d.getTime();
    }
    keyDown(event){
        if(event.keyCode       === 37){
            this.leftKey = true;
        }else if(event.keyCode === 39){
            this.rightKey = true;
        }else if(event.keyCode === 38){
            this.upKey = true;
        }else if(event.keyCode === 32){
            this.spaceKey = true;
        }
    }
    keyUp(event){

        if(event.keyCode       === 37){
            this.leftKey = false;
        }else if(event.keyCode === 39){
            this.rightKey = false;
        }else if(event.keyCode === 38){
            this.upKey = false;
        }else if(event.keyCode === 32){
            this.spaceKey = false;
        }
    }
    gameloop(){

        if(this.myPlayer.lives === 0){
            this.gui.setDead(this.myPlayer.score);
        }else{
            //keyboard input logic
            if(this.leftKey === true){ 
                this.myPlayer.turn(1);  
            }
            if(this.rightKey === true){  
                this.myPlayer.turn(-1); 
            }
            if((this.leftKey && this.rightKey) ||(!this.leftKey && !this.rightKey) ){
                this.myPlayer.turn(0);
            }
            if(this.upKey === true){
                this.myPlayer.move();
                this.myPlayer.isTrusting = true;
                
            }
            if(this.upKey === false){
                this.myPlayer.isTrusting = false;
            }
            if(this.spaceKey === true){

                this.myPlayer.addbullet();
            }

            this.myPlayer.update();
            //updating astroids
            for (var a in this.asteroids){
                this.asteroids[a].update();
                this.myPlayer.collision(this.asteroids[a].points, this.asteroids[a].location);
            }

            //checking if astroid is hit
            for(var i in this.myPlayer.bullets){

                
                for (var j in this.asteroids){
                    if(!this.asteroids[j] || !this.myPlayer.bullets[i]){
                        continue;
                    }
                    
                    if(this.asteroids[j].collision(this.myPlayer.bullets[i].location)){
                        console.log("hit");
                        var astroid = this.asteroids[j];
                        if(astroid.size > 20){
                            this.asteroids.push(new Asteroid({x: astroid.location.x, y: astroid.location.y}, 
                                {x:  Math.random()*20 - 10, y: Math.random()*20 - 10} ,astroid.size - 20));
                            this.asteroids.push(new Asteroid({x: astroid.location.x, y: astroid.location.y}, 
                                    {x:  Math.random()*20 - 10, y:  Math.random()*20 - 10} ,astroid.size - 20));
                        }
                        this.explosions.push(new Explosion(astroid.location.x,astroid.location.y));
                        astroid.audio.play();
                        this.myPlayer.bullets.splice(i,1);
                        this.asteroids.splice(j,1);
                        this.myPlayer.score+=10;
                    
                    }
                }
            }

            if(this.asteroids.length === 0){
                this.lvl++;
                this.startlvl(this.lvl);
            }


            //drawing
            ctx.fillStyle="black";
            ctx.fillRect(0, 0, screenWidth, screenHeight);
            for (var a in this.asteroids){
                
                this.asteroids[a].draw();
            }
            //explotions
            for(var i = 0;i< this.explosions.length;i++){
                if(!this.explosions[i]){
                    continue;
                }
                this.explosions[i].draw();
                if(this.explosions[i].isDead()){
                    this.explosions.splice(i,1);
                }
            }

            //gui

            this.gui.update(this.myPlayer.score, this.myPlayer.lives, this.lvl);
            
            this.myPlayer.draw();
    }
    }
}

class Gui{
    constructor(){
    
    //this.html = document.getElementById("gui");
    //this.html.innerHTML = "score: 10 lives: lvl:";
    }
    update(score, lives, lvl){
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(score,50,20);
        var livesplayer = new Player();
        livesplayer.location = {x: 50,y: 50};
        for(var i = 0;i<lives;i++){
            livesplayer.draw();
            livesplayer.location.x +=30;
        }

        //this.html.innerHTML = "score: "+score + " lives: " + lives + " lvl: " + lvl;
    }
    setDead(score){
        //this.html.innerHTML = "DEAD Score: "+score;
        ctx.fillStyle = "white";
        ctx.font = "50px Arial";
        ctx.fillText("you died",screenWidth/2 -150,screenHeight/2);
    }
 }

class Asteroid{
    constructor(startPosition, movement, size){
        

       this.location = startPosition;
        this.moveDirection = movement;
        this.size = size ;

        this.audio = new Audio('./Explosion.wav');
        

        this.points = [];


        this.d = new Date();
        this.lastTick = this.d.getTime();

        var points = Math.random()*10 + 5;
        for(var i = 0; i< points; i++){
            var point = {x: 0, y:0};
            var angle = Math.PI *2 /(points)*i;
            point.x = Math.cos(angle) * this.size * (Math.random()+ 0.5);
            point.y = Math.sin(angle) * this.size * (Math.random()+ 0.5);
            this.points.push(point);
        }
    }
    draw(){
        /* round asteroids
        ctx.beginPath();
        ctx.arc(this.location.x,this.location.y,this.size,0,2*Math.PI);
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        */
       ctx.beginPath();
       ctx.moveTo(this.location.x + this.points[0].x, this.location.y + this.points[0].y);
       for(var i = 1; i< this.points.length; i++){
        ctx.lineTo(this.location.x + this.points[i].x, this.location.y + this.points[i].y);

       }
       ctx.lineTo(this.location.x + this.points[0].x, this.location.y + this.points[0].y)

       ctx.strokeStyle = '#ffffff';
       ctx.stroke();


    }
    update(){
        
        this.d = new Date();
        var elapsedTime = (this.d.getTime() - this.lastTick)/100;
        this.lastTick = this.d.getTime();


        this.location.x += this.moveDirection.x * elapsedTime;
        this.location.y += this.moveDirection.y * elapsedTime;
        


        //
        if(this.location.x  > screenWidth + this.size){
            this.location.x = - this.size;
        }else if(this.location.x < - this.size){
            this.location.x = screenWidth + this.size;
        }
        if(this.location.y  > screenHeight + this.size){
            this.location.y = - this.size;
        }else if(this.location.y < - this.size){
            this.location.y = screenHeight + this.size;
        }
    }
    collision(point){
        
        var distance = Math.sqrt (Math.pow((this.location.x - point.x),2)  +
                                  Math.pow((this.location.y - point.y),2) );
        if(distance < this.size ){
            return true;
        }
        
       return false;
    }
}
class Explosion{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.d = new Date();
        this.created = this.d.getTime();
        this.lifespan = 2000;
    }
    isDead(){
        this.d = new Date();
        var elapsedTime = this.d.getTime() - this.created;
        if( elapsedTime > this.lifespan){
            return true;
        }
        return false;
    }
    draw(){
        this.d = new Date();
        var elapsedTime = this.d.getTime() - this.created;
        for(var i = 0; i < 12; i++){
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(this.x + Math.sin((Math.PI / 180)*30*i)*elapsedTime/20, this.y+ Math.cos((Math.PI / 180)*30*i)*elapsedTime/20,1,1);
        }
    }
}

var myGame = new Game();
setInterval(myGame.gameloop,30);

/*
var p1 = {x: 0,y: 0};
var p2 = {x: 10,y: 10};
var p3 = {x: 0,y: 10};
var p4 = {x: 10,y: 0};

var testplayer = new Player();
var testasteroid = new Asteroid({x: 550,y: 300},{x:0,y:0},60);
ctx.fillStyle="black";
ctx.fillRect(0, 0, screenWidth, screenHeight);
testplayer.draw();
testasteroid.draw();
console.log(testplayer.collision(testasteroid.points, testasteroid.location));
console.log("test");
console.log(intersect(p1,p2,p3,p4));
*/




