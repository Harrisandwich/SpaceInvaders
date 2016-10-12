

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

var Enemy = function(frameOneTexture,frameTwoTexture)
{
    var self = this;
    var frames = [new Sprite(frameOneTexture),new Sprite(frameTwoTexture)];
    var dir = 8;
    self.sprite = new Container();
    self.sprite.addChild(frames[0],frames[1]);
    frames[1].visible = false;
    self.animate = function()
    {

        self.sprite.x += dir;
        for(var f in frames)
        {
            if(frames[f].visible)
            {
                frames[f].visible = false;
            }
            else
            {
                frames[f].visible = true;
            }
        }
    };

    self.drop = function()
    {
        self.sprite.y += self.sprite.vy;
        dir *= -1;
    }

    self.setDir = function(d)
    {
        dir = d;
    };

    self.getDir = function()
    {
        return dir;
    };

    self.fire = function()
    {
        //create bullet
        var bullet = new Sprite(PIXI.loader.resources["images/alien_bullet.png"].texture);
        bullet.x = self.sprite.x;
        bullet.y = self.sprite.y;
        return bullet
    }


    
}

var screen = {
    left: window.innerWidth,
    top: 0,
    right: 0,
    bottom: window.innerHeight,
}
var renderer = new autoDetectRenderer(screen.left, screen.bottom);
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
var enemyTimerStarted = false;
var enemyTimer = null;
var enemyAttackTimer = null;
var direction = 0;

var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40),
      space = keyboard(32);

//loader.add("/images").load(resetGame);

//Numbers
var NUMBER_OF_ENEMIES = 15;
var ENEMY_BASE_SPEED_MS = 1000;
var BULLET_BASE_SPEED = 10;
var ENEMY_ROOT_POS = {
    x: 0,
    y: 0,
}
var ENEMY_PROJECTILE_SPEED = 10;
var ENEMY_PADDING = 20;
var ROW_PADDING = 50;
var SIZE_OF_ROW = 5;
var ATTACK_RATE = 0.6;
var currentWave = 1;
var enemySpeed = ENEMY_BASE_SPEED_MS;


function setup() {
    
    
    enemyTextures.push({frames: [PIXI.loader.resources["images/alien1_0.png"].texture, PIXI.loader.resources["images/alien1_1.png"].texture]});
    enemyTextures.push({frames: [PIXI.loader.resources["images/alien2_0.png"].texture, PIXI.loader.resources["images/alien2_1.png"].texture]});
    enemyTextures.push({frames: [PIXI.loader.resources["images/alien3_0.png"].texture, PIXI.loader.resources["images/alien3_1.png"].texture]});
    //change attack time to something more variable
    enemyAttackTimer = setInterval(enemyAttack,3000);
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
        bullet = new PIXI.Sprite(PIXI.loader.resources["images/ship_bullet.png"].texture);
        bullet.x = player.x;
        bullet.y = player.y - 20;
        playerProjectiles.push(bullet);
        stage.addChild(playerProjectiles[playerProjectiles.length - 1]);
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
    enemySpeed = ENEMY_BASE_SPEED_MS/wave;
    
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
            newEnemy.sprite.vy = newEnemy.sprite.height + ROW_PADDING;
            row.enemies.push(newEnemy);
        }
        enemyRows.push(row);
        
    }

    
}

function gameLoop()
{
    requestAnimationFrame(gameLoop);

    animate();

    if (leftPressed || rightPressed){movePlayer(direction);}

    if (playerProjectiles.length > 0){
        for(var b in playerProjectiles)
        {
            if (moveBullet(b, playerProjectiles)){
                stage.removeChild(playerProjectiles[b]);
                playerProjectiles.splice(b,1);
            }
        }
    }
    
    state();

    renderer.render(stage);
    
}

function animate()
{
    animatePlayer();
    animateEnemies();
    animateEnemyProjectiles();
}

function animatePlayer()
{
    if (leftPressed || rightPressed){movePlayer(direction);}
}

function animateEnemies()
{
    if(!enemyTimerStarted)
    {
        enemyTimerStarted = true;
        enemyTimer = setInterval(function()
        {
             //find visible enemy farthest left and farthest right
            var drop = 0;
            var dropping = false;
            for(var r in enemyRows)
            {
                for(var e in enemyRows[r].enemies)
                {
                    enemyRows[r].enemies[e].animate();
                    
                }
            }
           

        
            if(shouldEnemyDrop())
            {
                dropEnemies();
            }

        },200);
        

        //if they are near the edge, drop all.
    }
}

function animateEnemyProjectiles()
{
    
    //move each bullet down
    //if offscreen, kill bullet
    for(var b in enemyProjectiles)
    {
        enemyProjectiles[b].y += ENEMY_PROJECTILE_SPEED;
        if(enemyProjectiles[b].y > screen.bottom)
        {
            stage.removeChild(enemyProjectiles[b]);
            enemyProjectiles.splice(b,1);
        }
    }

}

function enemyAttack()
{
    //roll to fire
    var attackChance = Math.random();
    if(attackChance > ATTACK_RATE)
    {
        //pick enemy
        var row = Math.floor(Math.random() * ((enemyRows.length - 1) - 1) );
        var column = Math.floor(Math.random() * ((enemyRows[row].enemies.length - 1) - 1) );
        //fire
        if(enemyRows[row].enemies[column] != null)
        {
            var bullet = enemyRows[row].enemies[column].fire();
            stage.addChild(bullet);
            //store bullet into projectile array
            enemyProjectiles.push(bullet);
        }
    }
        
}
function dropEnemies()
{
    for(var r in enemyRows)
    {
        for(var e in enemyRows[r].enemies)
        {
            
            enemyRows[r].enemies[e].drop();
        }
    }
}

function shouldEnemyDrop()
{
    for(var r in enemyRows)
    {
        for(var e in enemyRows[r].enemies)
        {
            var leftDif = screen.left - enemyRows[r].enemies[e].sprite.x;
            var rightDif = enemyRows[r].enemies[e].sprite.x;
            if(leftDif <= (enemyRows[r].enemies[e].sprite.width + ENEMY_PADDING) && enemyRows[r].enemies[e].sprite.visible)
            {
                return true;
                
            }
            else if (rightDif <= ENEMY_PADDING && enemyRows[r].enemies[e].sprite.visible)
            {
                return true;
                
            }
            
        }
    }
    return false
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



function movePlayer(dir)
{
    player.vx = dir;
    player.x += player.vx;
}

/*
 * Returns true if bullet should be removed
 */
function moveBullet(bullet, playerProjectiles){
    var bullet = playerProjectiles[bullet];
    bullet.y -= BULLET_BASE_SPEED;
    // If bullet is inside enemy. Destroy.
    for(var r in enemyRows)
    {
        for(var e in enemyRows[r].enemies)
        {
            if(hitTestRectangle(bullet, enemyRows[r].enemies[e].sprite)) {
                stage.removeChild(bullet);
                stage.removeChild(enemyRows[r].enemies[e].sprite);
                console.log(enemyRows[r].enemies.splice(e, 1));
                playerProjectiles.splice(bullet,1);
                return false;
            }
             
        }
    }
    
    if (bullet.y <= 0){
        return true;
    }
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
    .add("images/alien_bullet.png")
    .on("progress", loadProgressHandler)
    .load(setup);
    
    
    document.body.appendChild(renderer.view);
    

    
});