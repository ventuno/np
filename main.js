function renderLoop() {
  if (playerPosition + playerSize.height >= windowSize.height) {
    console.log('hit the bottom of the screen');
    gameOver('player-pain-head');
    stopRenderLoop();
    return;
  }
  var obstaclePosition = obstacle.getBoundingClientRect();

  //check horizontal collision first
  if (playerSize.right >= obstaclePosition.left && playerSize.left < obstaclePosition.right) {
    if (!firstPlayer.classList.contains('player-inside')) {
      firstPlayer.classList.add('player-inside');
      firstPlayer.firstElementChild.src = getImageByPainType('player-inside');
    }
    //check vertical collision
    var hitHead = playerPosition <= obstaclePosition.top;
    var hitJaw = playerPosition + playerSize.height >= obstaclePosition.bottom;
    if (hitHead || hitJaw) {
      if (playerSize.right <= obstaclePosition.left + obstaclePosition.width/3) {
        gameOver('player-pain-side');
      } else {
        gameOver('player-pain-head');
      }
      stopRenderLoop();
      console.log('hit the obstacle');
      return;
    }
  }
  if (playerSize.left > obstaclePosition.right && newObstacle) {
    totPoints++;
    document.querySelector("#points").textContent = totPoints;
    newObstacle = false;
    firstPlayer.classList.remove('player-inside');
    firstPlayer.firstElementChild.src = getImageByPainType('player-normal');
  }
  if (isKeyDown) {
    playerPosition += -gravity * 10;
    startTime = 1;
  } else {
    playerPosition += 0.5 * gravity * startTime^2;
    startTime++;
  }
  playerPosition = Math.max(0, playerPosition);
  var newObstaclePositionLeft = obstaclePosition.left - backgroundSpeed;
  var newObstaclePositionTop = obstaclePosition.top;
  if (newObstaclePositionLeft + obstaclePosition.width <= windowSize.left) {
    newObstaclePositionLeft = windowSize.right;
    newObstaclePositionTop = Math.ceil(Math.random()*(windowSize.height-obstacleMargin*2-obstaclePosition.height)) + obstacleMargin;
    newObstacle = true;
  }
  updatePlayerPosition(firstPlayer, playerPosition);
  updateObstaclePosition(obstacle, newObstaclePositionLeft, newObstaclePositionTop);
}

function gameOver(painType) {
  firstPlayer.classList.add('player-pain');
  firstPlayer.firstElementChild.src = getImageByPainType(painType);
  firstPlayer.firstElementChild.style.transform = window.getComputedStyle(firstPlayer.firstElementChild).transform;
  firstPlayer.firstElementChild.style.transition = 'none';
  main.classList.add('game-over');
}

function getImageByPainType (painType, index) {
  if (index) {
    return imgsMap[painType][index];
  } else {
    var imgs = imgsMap[painType];
    return imgs[Math.floor(Math.random()*imgs.length)];
  }
}

function stopRenderLoop() {
  window.clearInterval(loop);
  loop = null;
}

function newGame() {
  totPoints = 0;
  newObstacle = true;
  playerPosition = 0;
  firstPlayer.classList.add(playerFallClass);
  updatePlayerPosition(firstPlayer, playerPosition);
  loop = window.setInterval(renderLoop, updateRate);
}

function updatePlayerPosition(player, y) {
  updatePosition(player, windowSize.width/2, y);
}

function updateObstaclePosition(obstacle, x, y) {
  updatePosition(obstacle, x, y);
}

function updatePosition(object, x,  y) {
  object.style.left = formatPx(x);
  object.style.top = formatPx(y);
}

function formatPx(value) {
  return value + 'px';
}

function onKeyDown () {
  firstPlayer.classList.remove(playerFallClass);
  isKeyDown = true;
}

function onKeyUp (event) {
  firstPlayer.classList.add(playerFallClass);
  isKeyDown = false;
  if (loop === null && event.keyCode === 32) {
    // lol
    window.location.reload();
  }
}

var updateRate = 1000/60;
var gravity =  1; //pixels/loop
var startTime = 1;
var playerFallClass = 'player-fall';

var firstPlayer = document.querySelector('.player');
var obstacle = document.querySelector('.obstacle');
var main = document.querySelector('#main');
var windowSize = main.getBoundingClientRect();
var playerSize = firstPlayer.getBoundingClientRect();
var backgroundSpeed = 12;
var obstacleMargin = 30;
var totPoints = 0;
var newObstacle = true;

var imgsMap = {
  'player-pain-head': ['em_pain_head.png', 'em_pain_head_2.png'],
  'player-pain-side': ['em_pain_side.png'],
  'player-inside': ['em_inside.png', 'em_inside_2.png', 'em_inside_3.png'],
  'player-normal': ['em.png', 'em_2.png'],
}

var loop;
var playerPosition;
var requestedAnimationFrame;
var isKeyDown = false;

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

newGame();
