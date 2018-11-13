var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");



var screenwidth = 600;
var screenheight = 400;

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

        this.location = {x: screenwidth/2, y: screenheight/2};
        this.direction = 0;
        this.speed = 0;
        this.length = 20;
        this.rotationspeed = 5;
        this.movespeed = 5;
        this.bullets = [];
    }
    move(){
        this.location.x -= Math.sin((Math.PI / 180) * this.direction) * this.movespeed;
        this.location.y -= Math.cos((Math.PI / 180) * this.direction) * this.movespeed;
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
        ctx.fill();
        ctx.setTransform(1, 0, 0, 1, 0, 0);


        //draw bullets
        for(var i in this.bullets){
            this.bullets[i].draw();
        }
    }
    collision(point, radius){
        var distance = Math.sqrt (Math.pow((this.location.x - point.x),2)  + Math.pow((this.location.y - point.y),2) );
        if(distance < radius ){
            console.log("colition");
        }
    }
    update(){
        //TODO
        for(var i in this.bullets){
            this.bullets[i].update();
        }
    }
    addbullet(){
       // this.bullets.push(new Bullet({x: 0,y: 50},{x: 20, y:0}))
        
        this.bullets.push(new Bullet(rotate(this.location, {x: this.location.x -1, y: this.location.y - this.length*2}, this.direction),
                                    {x: -Math.sin((Math.PI / 180) * this.direction)*20, y: -Math.cos((Math.PI / 180) * this.direction) * 20 }) );
                                    
    }
}

class Bullet{
    constructor(location, direction){
        this.location = location;
        this.direction = direction;
    }
    update(){
        this.location.x += this.direction.x;
        this.location.y += this.direction.y;
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
        this.asteroids.push(new Asteroid({x: 0, y: 300},{x: 5, y: 0}));
        this.asteroids.push(new Asteroid({x: 600, y: 0},{x: -10, y: 3}));

        this.leftkey = false;   //keycode 37
        this.rightkey = false;  //keycode 39
        this.upkey = false;     //keycode 38
        this.spacekey = false;  //keycode 32



        document.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp);
        
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

        //keyboard input logic
        if(this.leftkey === true){   
            this.myPlayer.direction+=this.myPlayer.rotationspeed;
        }
        if(this.rightkey === true){   
            this.myPlayer.direction-=this.myPlayer.rotationspeed;
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

        //drawing
        ctx.clearRect(0, 0, screenwidth, screenheight);
        for (var a in this.asteroids){
            
            this.asteroids[a].draw();
        }
        
        this.myPlayer.draw();
    }
}
class Asteroid{
    constructor(startposition, movement){


        this.location = startposition;
        this.movedirection = movement;
        this.size = 30;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.location.x,this.location.y,this.size,0,2*Math.PI);
        ctx.stroke();

    }
    update(){
        this.location.x += this.movedirection.x;
        this.location.y += this.movedirection.y;

        
        //
        if(this.location.x  > screenwidth + this.size){
            this.location.x = - this.size;
        }else if(this.location.x < - this.size){
            this.location.x = screenwidth + this.size;
        }
        if(this.location.y  > screenheight + this.size){
            this.location.y = - this.size;
        }else if(this.location.y < - this.size){
            this.location.y = screenheight + this.size;
        }
    }
}

var myGame = new Game();

setInterval(myGame.gameloop,100);

