
var scale = 0;
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

var Bunker = function()
{
    var SQUARE_SIZE = 10 * scale;
    var self = this;
    var cells = [];
     //create layout
    var layout = {
        rows:[{
            cells:[0,0,1,1,1,1,1,1,1,1,0,0],
        },
        {
            cells:[0,1,1,1,1,1,1,1,1,1,1,0],
        },
        {
            cells:[1,1,1,1,1,1,1,1,1,1,1,1],
        },
        {
            cells:[1,1,1,1,1,1,1,1,1,1,1,1],
        },
        {
            cells:[1,1,1,0,0,0,0,0,0,1,1,1],
        },
        {
            cells:[1,1,1,0,0,0,0,0,0,1,1,1],
        },
        {
            cells:[1,1,1,0,0,0,0,0,0,1,1,1],
        }]
    }
    self.width = SQUARE_SIZE * layout.rows[0].cells.length;
    self.bunker = new Container();

    init();
    self.checkHit = function(bullet)
    {
        
        for(var c in cells)
        {
            var gp = self.bunker.toGlobal(cells[c].position);
            var cellGlobal = {
                x: gp.x,
                y: gp.y,
                width:cells[c].width,
                height:cells[c].height,

            };
            if(hitTestRectangle(cellGlobal,bullet))
            {
                cells[c].visible = false;
                return true
            }
        }
        return false
        
    }
    self.cleanup = function()
    {
        for(var c in cells)
        {
            if(!cells[c].visible)
            {
                cells.splice(c,1);
            }
        }
    }
    self.getCells = function()
    {
        return cells;
    }
    function init()
    {
       
        //create squares
        for(var r in layout.rows)
        {
            var posY = r * SQUARE_SIZE;
            for(var c in layout.rows[r].cells)
            {
                var posX = c * SQUARE_SIZE;
                if(layout.rows[r].cells[c] == 1)
                {
                    var rect = new PIXI.Graphics();
                    rect.beginFill(0xFFFFFF);
                    rect.drawRect(0, 0, SQUARE_SIZE, SQUARE_SIZE);
                    rect.endFill();
                    rect.x = posX;
                    rect.y = posY;
                    self.bunker.addChild(rect);
                    //push to array
                    cells.push(rect);
                    //add child
                    
                }
            }
        }

    }
}
var Enemy = function(frameOneTexture,frameTwoTexture)
{
    var self = this;
    var frames = [new Sprite(frameOneTexture),new Sprite(frameTwoTexture)];
    var dir = 8;
    self.sprite = new Container();
    self.sprite.addChild(frames[0],frames[1]);
    self.sprite.scale.set(scale,scale);
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

var screen = null;
var renderer = null;
var stage = new Container();
var state = play;


var movementSpeed = 3;
var enemyRows = [];

var bunkers = [];
var playerProjectiles = [];
var enemyProjectiles = [];
var enemyTextures = [];
var bunkers = [];
var player = null;
var bullet = null;
var leftPressed = false;
var rightPressed = false;
var enemyTimerStarted = false;
var enemyTimer = null;
var enemyAttackTimer = null;
var direction = 0;
var score = 0;
var scoreLabel = null;
var scoreText = null;
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
var NUM_BUNKERS = 3;
var BUNKER_PADDING = 0;
var BUNKER_HEIGHT = 0;
var currentWave = 1;
var enemySpeed = ENEMY_BASE_SPEED_MS;


function setup() {
    
    
    enemyTextures.push({frames: [PIXI.loader.resources["images/alien1_0.png"].texture, PIXI.loader.resources["images/alien1_1.png"].texture]});
    enemyTextures.push({frames: [PIXI.loader.resources["images/alien2_0.png"].texture, PIXI.loader.resources["images/alien2_1.png"].texture]});
    enemyTextures.push({frames: [PIXI.loader.resources["images/alien3_0.png"].texture, PIXI.loader.resources["images/alien3_1.png"].texture]});
    //change attack time to something more variable
    enemyAttackTimer = setInterval(enemyAttack,500);
    initBunkers();
    initAliens(currentWave);
    player = new PIXI.Sprite(PIXI.loader.resources["images/ship.png"].texture);
    
    player.scale.set(scale,scale);
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
    space.press = playerFire
    
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


function showScore()
{
    //add score text to screen
    scoreLabel = new PIXI.Text(
        "Score:",
    {font: "18px sans-serif", fill: "white"}
    );
    scoreText = new PIXI.Text(
        "hello",
        {font: "18px sans-serif", fill: "white"}
    )
    scoreLabel.position.set(54, 96);
    scoretext.position.set(104, 96);
    stage.addChild(scoreLabel);
}

function updateScore()
{
    //change score text
}

function gameOver()
{
    //Show gameOver text and button
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
function initBunkers()
{
    for(var i = 0; i < NUM_BUNKERS; i++)
    {
        var bunker = new Bunker();
        bunker.bunker.y = BUNKER_HEIGHT;
        bunker.bunker.x = (i * BUNKER_PADDING) + bunker.width/2;
        bunkers.push(bunker);
        stage.addChild(bunker.bunker);
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
    animatePlayerProjectiles();
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
    for(var p in enemyProjectiles)
    {
        enemyProjectiles[p].y += ENEMY_PROJECTILE_SPEED;
        
        if(enemyProjectiles[p].y > screen.bottom)
        {
            enemyProjectiles[p].visible = false;
        }

        for(var b in bunkers)
        {
            if(enemyProjectiles[p].visible && hitTestRectangle(bunkers[b].bunker,enemyProjectiles[p]))
            {
                 
                if(bunkers[b].checkHit(enemyProjectiles[p]))
                {
                   enemyProjectiles[p].visible = false;
                }
            }

            bunkers[b].cleanup();
            
        }
    }
    //clean up
    for(var p in enemyProjectiles)
    {
        if(!enemyProjectiles[p].visible)
        {
            enemyProjectiles.splice(p,1);
        }
    }

}

function animatePlayerProjectiles()
{
    if (playerProjectiles.length > 0){
        for(var b in playerProjectiles)
        {
            if (playerProjectiles[b].visible && moveBullet(playerProjectiles[b])){
                playerProjectiles[b].visible = false;
            }
        }
    }

    //cleanup
    for(var b in playerProjectiles)
    {
        if (!playerProjectiles[b].visible){
            playerProjectiles.splice(b,1);
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

function playerFire()
{
    
    bullet = new PIXI.Sprite(PIXI.loader.resources["images/ship_bullet.png"].texture);
    bullet.x = player.x;
    bullet.y = player.y - 20;
    playerProjectiles.push(bullet);
    stage.addChild(playerProjectiles[playerProjectiles.length - 1]);
    
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
function moveBullet(bullet){
    //var bullet = playerProjectiles[bullet];
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

    for(var b in bunkers)
    {
        if(hitTestRectangle(bunkers[b].bunker,bullet))
        {
            if(bunkers[b].checkHit(bullet))
            {
                return true;
            }
        }
    }

    if (bullet.y <= 0){
        return true;
    }

    return false
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
var fireTimer = null;
function movePlayerTouch(e)
{
    e.originalEvent.preventDefault();
    player.x = e.originalEvent.touches[0].clientX;
}

function startPlayerTouch(e)
{
   
    if(fireTimer == null)
    {
        fireTimer = setInterval(playerFire,500);
    }
}

function endPlayerTouch(e)
{
    if(fireTimer != null)
    {
        clearInterval(fireTimer);
        fireTimer = null;
    }
}

$(document).ready(function(){

    
    scale = window.innerWidth/window.innerHeight;
    if(scale > 1)
    {
        scale = 1;
    }
    screen = {
    left: window.innerWidth,
    top: 0,
    right: 0,
    bottom: window.innerHeight,
    }

    
    
    renderer = new autoDetectRenderer(screen.left, screen.bottom);
    BUNKER_PADDING = (screen.left/3);
    BUNKER_HEIGHT = screen.bottom - (screen.bottom/3);

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
    
    $(document).on("touchmove",movePlayerTouch);
    $(document).on("touchend",endPlayerTouch);
    $(document).on("touchstart",startPlayerTouch);
    document.body.appendChild(renderer.view);
    

    
});

