var Enemy = function(frameOneTexture,frameTwoTexture)
{
    var self = this;
    var frames = [frameOneTexture,frameTwoTexture]
    self.sprite = new Sprite(frameOneTexture);
    self.animate = function()
    {
        //move alien
        //change frames every movement 
    }

    
}

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
var enemyRows = [];

var bunkers = [];
var playerProjectiles = [];
var enemyProjectiles = [];
var enemyTextures = [];
var player = null;
var bullet = null;
var leftPressed = false;
var rightPressed = false;
var direction = 0;

var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40),
      space = keyboard(32);

//loader.add("/images").load(resetGame);

//Numbers
var NUMBER_OF_ENEMIES = 15;
var ENEMY_ROOT_POS = {
    x: 0,
    y: 0,
}
var ENEMY_PADDING = 20;
var ROW_PADDING = 50;
var SIZE_OF_ROW = 5;
var currentWave = 0;
var alienSpeed = 1;


function setup() {
    
    
    enemyTextures.push({frames: [PIXI.loader.resources["images/alien1_0.png"].texture, PIXI.loader.resources["images/alien1_1.png"].texture]});
    enemyTextures.push({frames: [PIXI.loader.resources["images/alien2_0.png"].texture, PIXI.loader.resources["images/alien2_1.png"].texture]});
    enemyTextures.push({frames: [PIXI.loader.resources["images/alien3_0.png"].texture, PIXI.loader.resources["images/alien3_1.png"].texture]});

    initAliens(currentWave);
    player = new PIXI.Sprite(PIXI.loader.resources["images/ship.png"].texture);
    
    
    player.x = window.innerWidth/2 - player.width/2;
    player.y = window.innerHeight - player.height * 2;
    
    
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
    
    //Space
    space.press = function() {
        if (bullet != null){stage.removeChild(bullet); }
        bullet = new PIXI.Sprite(PIXI.loader.resources["images/ship_bullet.png"].texture);
        bullet.x = player.x;
        bullet.y = player.y - 20;
        stage.addChild(bullet);
    };
    
    stage.addChild(player);
    for(var r in enemyRows)
    {
        for(var e in enemyRows[r].enemies)
        {
            stage.addChild(enemyRows[r].enemies[e].sprite);
        }
    }
    renderer.render(stage);
       
    gameLoop();
}

//for game over
function resetGame()
{


    /*
        - create player
        - create enemies
        - create bunkers 
        - assign keys
    */

}

function changeLevel()
{
    currentWave++;
    initAliens(currentWave);
}

function initAliens(wave)
{
    alienSpeed += wave;
    
    for(var i = 0; i < NUMBER_OF_ENEMIES/SIZE_OF_ROW; i++)
    {
        var row = {
            enemies:[],
        }
        var currentTexture = enemyTextures[i];
        for(var r = 0; r < SIZE_OF_ROW; r++)
        {
            var newEnemy = new Enemy(currentTexture.frames[0],currentTexture.frames[1]);
            //set positon to: y = start_pos * height * row, x = start_pos * width * col
            newEnemy.sprite.x = ((ENEMY_ROOT_POS.x + newEnemy.sprite.width) * r) + ENEMY_PADDING;
            newEnemy.sprite.y = ((ENEMY_ROOT_POS.y + newEnemy.sprite.height) * i) + ROW_PADDING;
            row.enemies.push(newEnemy);
        }
        enemyRows.push(row);
        
    }

    
}

function gameLoop()
{
    requestAnimationFrame(gameLoop);

    if (leftPressed || rightPressed){movePlayer(direction);}

    if (bullet !== null){
        moveBullet(bullet);
    }

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

function moveBullet(bullet){
    bullet.y -= 10;
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
    .add("images/ship_bullet.png")
    .on("progress", loadProgressHandler)
    .load(setup);
    
    
    document.body.appendChild(renderer.view);
    

    
});