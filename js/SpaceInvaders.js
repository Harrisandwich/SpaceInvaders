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


var renderer = new autoDetectRenderer(window.innerWidth, window.innerHeight);
var stage = new Container();
var state = play;

var movementSpeed = 3;

var enemies = [];
var bunkers = [];
var playerProjectiles = [];
var enemyProjectiles = [];
var player = null;
var leftPressed = false;
var rightPressed = false;
var direction = 0;

var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

//loader.add("/images").load(resetGame);

function setup() {
    
    
    var alien1_0 = new PIXI.Sprite(PIXI.loader.resources["images/alien1_0.png"].texture);
    var alien1_1 = new PIXI.Sprite(PIXI.loader.resources["images/alien1_1.png"].texture);
    var alien2_0 = new PIXI.Sprite(PIXI.loader.resources["images/alien2_0.png"].texture);
    var alien2_1 = new PIXI.Sprite(PIXI.loader.resources["images/alien2_1.png"].texture);
    var alien3_0 = new PIXI.Sprite(PIXI.loader.resources["images/alien3_0.png"].texture);
    var alien3_1 = new PIXI.Sprite(PIXI.loader.resources["images/alien3_1.png"].texture);
    player = new PIXI.Sprite(PIXI.loader.resources["images/ship.png"].texture);
    
    alien2_0.x = 64;
    alien3_0.x = 128;
    
    alien1_1.x = 64;
    alien2_1.x = 128;
    alien3_1.x = 192;
    
    alien1_1.y = 64;
    alien2_1.y = 64;
    alien3_1.y = 64;
    
    player.x = 96;
    player.y = 192;
    
    stage.addChild(alien1_0);
    stage.addChild(alien1_1);
    stage.addChild(alien2_0);
    stage.addChild(alien2_1);
    stage.addChild(alien3_0);
    stage.addChild(alien3_1);
    stage.addChild(player);
    
     //Left
    left.press = function() {
        direction = -movementSpeed;
        leftPressed = true;
    };
    left.release = function() {leftPressed = false;};

    //Right
    right.press = function() {
        rightPressed = true;
        direction = movementSpeed;
    };
    right.release = function() {rightPressed = false;};
    
    renderer.render(stage);
       
    gameLoop();
}

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

    if (leftPressed || rightPressed){movePlayer(direction);}

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

function movePlayer(dir)
{
    player.vx = dir;
    player.x += player.vx;
}

function stopPlayerMovement()
{
    
}

function loadProgressHandler(loader, resource) {
  //Display the file `url` currently being loaded
  console.log("loading: " + resource.url); 

  //Display the precentage of files currently loaded
  console.log("progress: " + loader.progress + "%"); 
}

$(document).ready(function(){

    PIXI.loader
    .add("images/alien1_0.png")
    .add("images/alien1_1.png")
    .add("images/alien2_0.png")
    .add("images/alien2_1.png")
    .add("images/alien3_0.png")
    .add("images/alien3_1.png")
    .add("images/ship.png")
    .on("progress", loadProgressHandler)
    .load(setup);
    
    
    document.body.appendChild(renderer.view);
    

    
});