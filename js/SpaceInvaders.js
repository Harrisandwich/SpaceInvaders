$(document).ready(function(){

    var renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);
    var rgb2hex = PIXI.utils.rgb2hex;
    var stage = new PIXI.Container();
    var state = null;

    document.body.appendChild(renderer.view);
    gameLoop();
    
   
    function gameLoop()
    {
        requestAnimationFrame(gameLoop);

        state();

        renderer.render(stage);
    }
    function play() {
        
        
    }

    function menu() { 
        
          
    }
    
});
