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
        var point2 = {x: this.location.x - this.length ,    y: this.location.y +this.length};
        var point3 = {x: this.location.x + this.length ,    y: this.location.y +this.length};
        var origin = {x: this.location.x,                   y: this.location.y};

        //rotated triangle
        point1 = rotate(origin, point1, this.direction);
        point2 = rotate(origin, point2, this.direction);
        point3 = rotate(origin, point3, this.direction);

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
        ctx.setTransform(1, 0, 0, 1, 0, 0);


        //draw bullets
        for(var i in this.bullets){
            this.bullets[i].draw();
        }
    }
    turn(sign){
        this.isTurning = sign;

    }
    collision(point, radius){
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
        this.location = location;
        this.direction = direction;
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
      //  this.asteroids.push(new Asteroid({x: 0, y: 300},{x: 5, y: 0}));
      //  this.asteroids.push(new Asteroid({x: 600, y: 0},{x: -10, y: 3}));

        this.leftkey = false;   //keycode 37
        this.rightkey = false;  //keycode 39
        this.upkey = false;     //keycode 38
        this.spacekey = false;  //keycode 32

        this.lvl = 1;

        document.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp);

        this.gui = new Gui();
        this.startlvl(1);
    }
    startlvl(lvl){
        for(var i = 0; i <lvl*2; i++){
            console.log("made astreroid");

            this.asteroids.push(new Asteroid({x: Math.random()*screenWidth, y: Math.random()*screenHeight},
                                             {x: Math.random()*20 - 10, y: Math.random()*20 - 10}));

            console.log(this.asteroids);
        }
        this.d = new Date();
        this.myPlayer.deadTime = this.d.getTime();
    }
    keyDown(event){
        if(event.keyCode       === 37){
            this.leftkey = true;
        }else if(event.keyCode === 39){
            this.rightkey = true;
        }else if(event.keyCode === 38){
            this.upkey = true;
        }else if(event.keyCode === 32){
            this.spacekey = true;
        }
    }
    keyUp(event){

        if(event.keyCode       === 37){
            this.leftkey = false;
        }else if(event.keyCode === 39){
            this.rightkey = false;
        }else if(event.keyCode === 38){
            this.upkey = false;
        }else if(event.keyCode === 32){
            this.spacekey = false;
        }
    }
    gameloop(){

        if(this.myPlayer.lives === 0){
            this.gui.setDead(this.myPlayer.score);
        }else{
            //keyboard input logic
            if(this.leftkey === true){ 
                this.myPlayer.turn(1);  
            }
            if(this.rightkey === true){  
                this.myPlayer.turn(-1); 
            }
            if((this.leftkey && this.rightkey) ||(!this.leftkey && !this.rightkey) ){
                this.myPlayer.turn(0);
            }
            if(this.upkey === true){
                this.myPlayer.move();
            }
            if(this.spacekey === true){

                this.myPlayer.addbullet();
            }

            this.myPlayer.update();
            //updating astroids
            for (var a in this.asteroids){
                this.asteroids[a].update();
                this.myPlayer.collision(this.asteroids[a].location, this.asteroids[a].size);
            }

            //checking if astroid is hit
            for(var i in this.myPlayer.bullets){

                if(!this.myPlayer.bullets[i]){
                    continue;
                }
                for (var j in this.asteroids){
                    if(!this.asteroids[j]){
                        continue;
                    }
                    if(this.asteroids[j].collision(this.myPlayer.bullets[i].location)){
                        console.log("hit");
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
            //gui
            this.gui.update(this.myPlayer.score, this.myPlayer.lives, this.lvl);
            
            this.myPlayer.draw();
    }
    }
}

class Gui{
    constructor(){
    
    this.html = document.getElementById("gui");
    this.html.innerHTML = "score: 10 lives: lvl:";
    }
    update(score, lives, lvl){
        this.html.innerHTML = "score: "+score + " lives: " + lives + " lvl: " + lvl;
    }
    setDead(score){
        this.html.innerHTML = "DEAD Score: "+score;
    }
 }

class Asteroid{
    constructor(startposition, movement){
        console.log(startposition);

       this.location = startposition;
        this.movedirection = movement;
        this.size = 30;

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

        this.location.x += this.movedirection.x * elapsedTime;
        this.location.y += this.movedirection.y * elapsedTime;
        


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
    }
}

var myGame = new Game();

setInterval(myGame.gameloop,30);

