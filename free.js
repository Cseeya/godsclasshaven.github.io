// Adapted from billmill.org/static/canvastutorial
// This code is still relatively complicated -- if you
// can come up with a nice game for on the front page
// which is fun, simple, and shows off the capabilities
// of the interface, then contact me :)

var context = canvas.getContext("2d");

var bricks = [];
var paddleWidth, paddleHeight, bricksNumX, bricksNumY;
var brickWidth, brickHeight, brickMargin, paddleX;
var ballX, ballY, ballVx, ballVy, ballDirx, ballDiry;
var restart = true;

for (var y=0; y<20; y++) {
  bricks[y] = [];
  for (var x=0; x<20; x++) {
    bricks[y][x] = true;
  }
}

function setValues() {
  paddleWidth = 80;
  paddleHeight = 12;
  bricksNumX = 7;
  bricksNumY = 5;
  brickWidth = canvas.width / bricksNumX;
  brickHeight = 20;
  brickMargin = 4;
  ballVx = 7;
  ballVy = 12;
}

function init() {
  restart = false;
  paddleX = canvas.width/2;
  ballX = 40;
  ballY = 150;
  ballDirx = 1;
  ballDiry = 1;
  for (var y=0; y<13; y++) {
    for (var x=0; x<13; x++) {
      bricks[y][x] = true;
    }
  }
}

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);  
}

function circle(x, y) {
  context.beginPath();
  context.arc(x, y, 10, 0, 2*Math.PI);
  context.fill();
}

function drawPaddle() {
  var x = paddleX - paddleWidth/2;
  var y = canvas.height - paddleHeight;
  context.fillRect(x, y, paddleWidth, paddleHeight);
}

function mouseMove(event) {
  paddleX = event.layerX;
}

function hitHorizontal() {
  if (ballX < 0) {
    ballDirx = -ballDirx;
  } else if (ballX >= canvas.width) {
    ballDirx = -ballDirx;
  }
}

function hitVertical() {
  if (ballY < 0) {
    ballDiry = -ballDiry;
  } else if (ballY < brickHeight*bricksNumY) {
    var bx = Math.floor(ballX/brickWidth);
    var by = Math.floor(ballY/brickHeight);
    
    if (bx >= 0 && bx < bricksNumX) {
      if (bricks[by][bx]) {
        bricks[by][bx] = false;
        ballDiry = -ballDiry;
      }
    }
  } else if (ballY >= canvas.height-paddleHeight) {
    var paddleLeft = paddleX-paddleWidth/2;
    var paddleRight = paddleX+paddleWidth/2;
    if (ballX >= paddleLeft && ballX <= paddleRight) {
      ballDiry = -ballDiry;
    } else {
      restart = true;
      return false;
    }
  }
  return true;
}

function drawBricks() {
  for (var by=0; by<bricksNumY; by++) {
    for (var bx=0; bx<bricksNumX; bx++) {
      if (bricks[by][bx]) {
        var x = bx * brickWidth + brickMargin/2;
        var y = by * brickHeight + brickMargin/2;
        var width = brickWidth - brickMargin;
        var height = brickHeight - brickMargin;
        context.fillRect(x, y, width, height);
      }
    }
  }
}

function tick() {
  if (restart) {
    init();
    return;
  }
  setValues();
  clear();
  drawPaddle();
  
  ballX += ballVx*ballDirx;
  ballY += ballVy*ballDiry;
  
  hitHorizontal();
  if (hitVertical()) {
    circle(ballX, ballY);
    drawBricks();
  } else {
    clear();
  }
}

canvas.onmousemove = mouseMove;
window.setInterval(tick, 30);
