var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy, boy1, boyImg, boy2, boy_running;
var road, roadImg;
var obastacle, obstacle1, obstacle2, obastacle3, obstaclesGroup;
var restart, gameOver, gameOverImg, restartImg;

var score = 0;

var ground, groundImg, invisibleGround;

var desert, desertImg;

var backGround, backGroundImg;

function preload() {
  boy_running = loadAnimation("boy1.png", "boy2.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  backGroundImg = loadImage("back.png");

  groundImg = loadImage("ground.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  jumpSound = loadSound("jump.wav");
  collidedSound = loadSound("collided.wav");

  boy = createSprite(50, height - 70, 20, 50);
  boy.addAnimation("running", boy_running);
  boy.setCollider("circle", 0, 0, 345);
  boy.collider.alpha = 0
  boy.scale = 0.2;
  boy.debug = true;

  invisibleGround = createSprite(width / 2, height - 10, width, 125);
  invisibleGround.shapeColor = "#f4cbaa";

  ground = createSprite(width / 2, height, width, 2);
  ground.addImage("ground", groundImg);
  ground.x = width / 2;
  ground.velocityX = -(6 + (3 * score) / 100);

  gameOver = createSprite(width / 2, height / 2 - 50);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width / 2, height / 2);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround.visible = false;

  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  boy.debug = false;
  background(backGroundImg);
  textSize(20);
  fill("black");
  text("Puntuación: " + score, 30, 50);

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(6 + (3 * score) / 100);

  //-120
  if ((touches.length > 0 || keyDown("SPACE")) && boy.y >= height - 420) {
    jumpSound.play();
    boy.velocityY = -10;
    touches = [];
  }

  boy.velocityY = boy.velocityY + 0.8;

  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }

  boy.collide(invisibleGround);
  spawnObstacles();

  if (obstaclesGroup.isTouching(boy)) {
    collidedSound.play();
    gameState = END;
  }   }
    else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    boy.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    }
      obstaclesGroup.setLifetimeEach(-1);

  if (touches.length > 0 || keyDown("SPACE")) {
    if (gameState === END) {
      reset();
    }   
  }
    touches = [];

  
  console.log()
  drawSprites();
}

console.log(touches);

function spawnObstacles() {
  if (frameCount % 60 === 0 && gameState === PLAY) {
    var obstacle = createSprite(600, height - 95, 20, 30);
    obstacle.setCollider("circle", 0, 0, 110);
    obstacle.debug = false;

    obstacle.velocityX = -(6 + (3 * score) / 100);

    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      default:
        break;
    }

    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = boy.depth;
    boy.depth += 1;
    obstaclesGroup.add(obstacle);
    
    if (obstacle.isTouching(boy)) {
      collidedSound.play();
      gameState = END;
    }
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  boy.visible = true

  obstaclesGroup.destroyEach();

  boy.changeAnimation("running", boy_running);

  score = 0;
}
