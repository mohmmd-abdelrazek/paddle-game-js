const container = document.getElementById("game-container"),
  ball = document.getElementById("ball"),
  board = document.getElementById("board"),
  gameOverScreen = document.getElementById("game-over"),
  startPage = document.getElementById("start-page"),
  scoreElement = document.getElementById("score"),
  levelElement = document.getElementById("level");

let level = localStorage.getItem("level") || 1;
let boardSpeed, ballSpeedX, ballSpeedY, boardX, ballX, ballY, newSpeed;
let score = 0,
  boardWidth,
  isLeftArrowPressed = false,
  isRightArrowPressed = false,
  isGameRunning = false,
  isGamePaused = false,
  animationFrameId;

levelElement.innerHTML = level;
setSpeed();
setPosition();

function move() {
  if (!isGameRunning || isGamePaused) return;

  isLeftArrowPressed &&
    document.getElementById("board").offsetLeft > 0 &&
    (boardX -= boardSpeed);
  isRightArrowPressed &&
    document.getElementById("board").offsetLeft <
      container.offsetWidth - document.getElementById("board").offsetWidth &&
    (boardX += boardSpeed);
  document.getElementById("board").style.left = boardX + "px";

  ballX += ballSpeedX;
  ballY -= ballSpeedY;
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";

  ball.offsetTop <= 0 && (ballSpeedY *= -1);
  if (
    ball.offsetLeft <= 0 ||
    ball.offsetLeft >= container.offsetWidth - ball.offsetWidth
  ) {
    ballSpeedX *= -1;
  }

  if (
    document.getElementById("board").offsetTop - ball.offsetHeight ==
      ball.offsetTop &&
    boardCollision()
  ) {
    ballSpeedY *= -1;
    score++;
    scoreElement.innerHTML = score;
  }

  if (score == 5 && level < 10) {
    newSpeed = ballSpeedX;
    finishLevel();
  }

  if (
    (level == 10 && score == 5) ||
    ballY + ball.offsetHeight >= container.offsetHeight
  ) {
    gameOver();
  }

  animationFrameId = requestAnimationFrame(move);
}

function setSpeed() {
  boardSpeed = 14;
  ballSpeedX = 10 + +level / 1.25;
  ballSpeedY = 15 + +level / 1.25;
}

function setPosition() {
  boardWidth = container.offsetWidth * 0.25 - +level * 3;
  document.getElementById("board").style.width = boardWidth + "px";
  boardX =
    container.offsetWidth / 2 -
    document.getElementById("board").offsetWidth / 2;
  document.getElementById("board").style.left = boardX + "px";
  ballX = container.offsetWidth / 2 - ball.offsetWidth / 2;
  ball.style.left = ballX + "px";
  ballY =
    container.offsetHeight -
    document.getElementById("board").offsetHeight -
    ball.offsetHeight -
    20;
  ball.style.top = ballY + "px";
}

function startGame() {
  if (level == 10 && score == 5) {
    level = 1;
    localStorage.setItem("level", level);
    levelElement.innerHTML = level;
  }
  isGameRunning = true;
  setSpeed();
  setPosition();
  level % 2 == 0 && (ballSpeedX *= -1);
  gameOverScreen.style.display = "none";
  document.getElementById("pause-button").style.visibility = "visible";
  startPage.style.display = "none";
  score = 0;
  scoreElement.innerHTML = score;
  animationFrameId = requestAnimationFrame(move);
}

function boardCollision() {
  return (
    document.getElementById("board").offsetLeft - ball.offsetWidth <
      ball.offsetLeft &&
    document.getElementById("board").offsetLeft +
      document.getElementById("board").offsetWidth >
      ball.offsetLeft
  );
}

function pauseGame() {
  isGamePaused = !isGamePaused;
  document.getElementById("pause-button").innerHTML = isGamePaused
    ? "&#9658;"
    : "||";
  isGamePaused
    ? cancelAnimationFrame(animationFrameId)
    : (animationFrameId = requestAnimationFrame(move));
}

function gameOver() {
  document.querySelector(".game-over__text").innerHTML = "Game over!";
  document.querySelector(".game-over__text").style.color = "red";
  isGameRunning = false;
  cancelAnimationFrame(animationFrameId);
  gameOverScreen.style.display = "flex";
  document.getElementById("pause-button").style.visibility = "hidden";
  if (level == 10 && score == 5) {
    document.querySelector(".game-over__text").innerHTML = "You win!";
    document.querySelector(".game-over__text").style.color = "green";
  }
}

function finishLevel() {
  level++;
  localStorage.setItem("level", level);
  levelElement.innerHTML = level;
  setSpeed();
  ballSpeedX = newSpeed;
  boardWidth = container.offsetWidth * 0.25 - +level * 3;
  document.getElementById("board").style.width = boardWidth + "px";
  score = 0;
  scoreElement.innerHTML = score;
}

function cancelGame() {
  startPage.style.display = "flex";
  gameOverScreen.style.display = "none";
  score = 0;
  scoreElement.innerHTML = score;
  level == 10 && (level = 1);
  localStorage.setItem("level", level);
  levelElement.innerHTML = level;
  setPosition();
}

function handleKey(event, isDown) {
  if (event.key === "ArrowLeft") isLeftArrowPressed = isDown;
  if (event.key === "ArrowRight") isRightArrowPressed = isDown;
}

function handleSpaceKey() {
  !isGameRunning ? startGame() : pauseGame();
}

document.addEventListener("keydown", (e) => handleKey(e, true));
document.addEventListener("keyup", (e) => handleKey(e, false));
document.addEventListener("keydown", (e) => e.key === " " && handleSpaceKey());
document.addEventListener(
  "keydown",
  (e) => (e.key === "Escape" || e.key === "Esc") && cancelGame()
);
window.addEventListener("resize", setPosition);
document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("restart-button").addEventListener("click", startGame);
document.getElementById("pause-button").addEventListener("click", pauseGame);
document.getElementById("cancel-button").addEventListener("click", cancelGame);

