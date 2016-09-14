//pixi aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache,
    Container = PIXI.Container,
    hitTestRectangle = utils.hitTestRectangle,
    keyboard = utils.keyboard;


var renderer = new autoDetectRenderer(256, 256);
var stage = new Container();
var state = null;

var enemies = [];
var bunkers = [];
var playerProjectiles = [];
var enemyProjectiles = [];
var player = null;

var leftKey = keyboard(37);
var rightKey = keyboard(39);
var spaceKey = keyboard(32);

function resetGame()
{
    /*
        - create player
        - create enemies
        - create bunkers 
        - assign keys
    */

}
function gameLoop()
{
    requestAnimationFrame(gameLoop);

    state();

    renderer.render(stage);
}

function play() {
    /*
        - player can move 
        - player can shoot
        - enemies move side to side on timer
        - enemies move down at interval
        - enemy move timer decreases in time as more enemies are killed 
    */
    
}

function mainMenu() { 
    /*
        - player can click play
        - thats all (lol)
    */
        
}

function animate()
{

    //animation functions for each animated sprite 
    animatePlayer();
    animateEnemies();
    animateProjectiles();
}

function animatePlayer()
{
    /*
        - player movement based on current velocity (vx,vy)
    */
}

function animateEnemies()
{
    /*
        - Move enemies based on velocity
        - if enemy vy > then current velocity, move enemies once then reset vy to 0
    */
}

function animateProjectiles()
{
    /*
        - move player projectiles up
        - move enemies projectiles down
    */
}

function 
$(document).ready(function(){

    document.body.appendChild(renderer.view);
    //gameLoop();
    
});
