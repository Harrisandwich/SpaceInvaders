var object = function()
{
    var self = this;
    self.obj;
    self.size = 50;
    self.color = 0xFFFFFF;
    //distruction flag
    self.dead = false;
    var circle = new PIXI.Graphics();
    self.setColor = function(color)
    {
        circle.beginFill(color);
        circle.drawCircle(0, 0, self.size);
        circle.endFill();
    }
    self.animate = function()
    {
        if(self.obj.y < (window.innerHeight+100))
        {
            self.obj.y += 5;
        } 
        else
        {
            self.dead = true;
        }
    }

    self.init = function(x,y,radius,color)
    {
       
        circle.beginFill(color);
        circle.drawCircle(0, 0, radius);
        circle.endFill();
        self.size = radius;
        self.obj = new PIXI.Container();
        self.obj.addChild(circle);
        self.obj.y = y;
        self.obj.x = x;

    }

    
}

var frog = funtion()
{
    var self = this;
    self.obj = null;
    self.init = function(x,y,radius,color)
    {
       
        circle.beginFill(color);
        circle.drawCircle(0, 0, radius);
        circle.endFill();
        self.size = radius;
        self.obj = new PIXI.Container();
        self.obj.addChild(circle);
        self.obj.y = y;
        self.obj.x = x;

    }
}
$(document).ready(function(){

    var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
    var rgb2hex = PIXI.utils.rgb2hex;
    var stage = new PIXI.Container();
    var state = null;
    var objects = [];
    
    //fps constant
    var FPS = 60;
    //spawn rate in seconds
    var spawnRate = 1;
    //counter
    var counter = 0;
  
    var waitMessage = new PIXI.Text(
        "Touch the screen to start",
        {font: "50px sans-serif", fill: "white"}
    );

    document.body.appendChild(renderer.view);
    waitMessage.position.set(100, 100);
    stage.addChild(waitMessage); 
    state = wait;
    gameLoop();
    
   
    function gameLoop()
    {
        requestAnimationFrame(gameLoop);

        state();

        renderer.render(stage);
    }
    function play() {
        
        //create a ball every x seconds
        counter++;
        if(counter/60 == spawnRate)
        {
            counter = 0;
            var x = Math.random() * window.innerWidth;
            var y = 0 - (50*2);
            var color = rgb2hex(0,0,255);
            var newBall = new object();
            newBall.init(x,y,50,color);
            stage.addChild(newBall.obj);
            objects.push(newBall);
        }

        //throw ball in air/slide it down the screen
        for(var i in objects)
        {
            objects[i].animate();
            if(objects[i].dead)
            {
                objects[i].visible = false;
                objects.splice(i,1);
                
            }
        }
        
        //check for touch
        //when ball is touched, change the colour 
    }

    function wait() { 
        
          
    }

    $(document).on("touchstart",function(event){
        if(state === wait)
        {
            state = play;
            waitMessage.visible = false;; 
        }

        if(state === play)
        {
            checkCollisions(event);
        }
    });

    function checkCollisions(event)
    {
        var touchY = event.originalEvent.touches[0].clientY;
        var touchX = event.originalEvent.touches[0].clientX; 
        for(var i in objects)
        {
            if(touchX  < objects[i].obj.x + objects[i].size && touchX  > objects[i].obj.x - objects[i].size)
            {
                if(touchY < objects[i].obj.y + objects[i].size && touchY > objects[i].obj.y - objects[i].size)
                {
                    objects[i].setColor(rgb2hex(255,0,0));
                }
            }
        }
    }
    
});
