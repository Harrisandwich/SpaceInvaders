//pixi aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache,
    Container = PIXI.Container,
    hitTestRectangle = utils.hitTestRectangle;

//
var renderer = new autoDetectRenderer(256, 256);
var stage = new Container();
var state = null;

var enemies = [];
var player = null;

function gameLoop()
{
    requestAnimationFrame(gameLoop);

    state();

    renderer.render(stage);
}

function play() {
    
    
}

function mainMenu() { 
    
        
}

$(document).ready(function(){

    document.body.appendChild(renderer.view);
    //gameLoop();
    
});
