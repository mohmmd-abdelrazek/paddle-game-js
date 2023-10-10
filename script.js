const container = document.getElementById("game-container");
const board = document.getElementById("board");
const ball = document.getElementById("ball");
const gameOverScreen = document.getElementById("game-over");
const startPage = document.getElementById("start-page");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");

let level = localStorage.getItem("level") || 1;
levelElement.innerHTML = level;
let initialState = {
    boardSpeed: 10,
    ballSpeedX: 10 + level * 2,
    ballSpeedY: 10 + level * 2,
    boardX: container.offsetWidth / 2 - board.offsetWidth / 2,
    ballX: container.offsetWidth / 2 - ball.offsetWidth / 2,
    ballY: container.offsetHeight - board.offsetHeight - ball.offsetHeight - 20
};
let { boardSpeed, ballSpeedX, ballSpeedY, boardX, ballX, ballY } = initialState;
let score = 0;

let isLeftArrowPressed = false;
let isRightArrowPressed = false;
let isGameRunning = false;
let isGamePaused = false;
let animationFrameId;

function move() {
    if (!isGameRunning || isGamePaused) return;

    isLeftArrowPressed && board.offsetLeft > 0 && (boardX -= boardSpeed);
    isRightArrowPressed && board.offsetLeft < (container.offsetWidth - board.offsetWidth) && (boardX += boardSpeed);
    board.style.left = boardX + "px";

    ballX += ballSpeedX;
    ballY -= ballSpeedY;
    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";

    ball.offsetTop <= 0 && (ballSpeedY *= -1);
    if (ball.offsetLeft <= 0 || ball.offsetLeft >= container.offsetWidth - ball.offsetWidth) {
        ballSpeedX *= -1;
    }

    if (board.offsetTop - ball.offsetHeight == ball.offsetTop &&
        board.offsetLeft - ball.offsetWidth <= ball.offsetLeft &&
        board.offsetLeft + board.offsetWidth >= ball.offsetLeft) {
        ballSpeedY *= -1;
        score++;
        scoreElement.innerHTML = score;
    }
    
    if (score == 5 && level < 10) {
        finishLevel();
    }

    if ((level == 10 && score == 5) || ballY + ball.offsetHeight >= container.offsetHeight) {
        gameOver();
    }
    

    
    animationFrameId = requestAnimationFrame(move);
}

function startGame() {
    if (level == 10 && score == 5) {
        level = 1;
        localStorage.setItem("level", level);
        levelElement.innerHTML = level;
    }
    isGameRunning = true;
    boardSpeed = 10;
    ballSpeedX= 10 + level * 2;
    ballSpeedY= 10 + level * 2;
    boardX = container.offsetWidth / 2 - board.offsetWidth / 2;
    ballX = container.offsetWidth / 2 - ball.offsetWidth / 2;
    ballY = container.offsetHeight - board.offsetHeight - ball.offsetHeight - 20;
    document.getElementById("pause-button").style.display = "block";
    startPage.style.display = "none";
    score = 0;
    scoreElement.innerHTML = score;
    animationFrameId = requestAnimationFrame(move);
}

function pauseGame() {
    if (!isGamePaused) {
        isGamePaused = true;
        cancelAnimationFrame(animationFrameId);
        document.getElementById("pause-button").innerHTML = "&#9658;";
    } else{
        isGamePaused = false;
        animationFrameId = requestAnimationFrame(move);
        document.getElementById("pause-button").innerHTML = "||";
    }
}

function gameOver() {
    document.querySelector(".game-over__text").innerHTML = "Game over!";
    isGameRunning = false;
    cancelAnimationFrame(animationFrameId);
    gameOverScreen.style.display = "flex";
    document.getElementById("pause-button").style.display = "none";
    localStorage.setItem("level", level);
    levelElement.innerHTML = level;
    if (level == 10 && score == 5) {
      document.querySelector(".game-over__text").innerHTML = "You win!";
    }    
}

function finishLevel() {
    level++;
    localStorage.setItem("level", level);
    levelElement.innerHTML = level;
    score = 0;
    scoreElement.innerHTML = score;
}

function resetGame() {
    gameOverScreen.style.display = "none";
    startGame();
}

function cancelGame() {
    startPage.style.display = "flex";
    gameOverScreen.style.display = "none"; 
    score = 0;
    scoreElement.innerHTML = score;
}

function handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
        isLeftArrowPressed = true;
    } else if (event.key === "ArrowRight") {
        isRightArrowPressed = true;
    }
}

function handleKeyUp(event) {
    if (event.key === "ArrowLeft") {
        isLeftArrowPressed = false;
    } else if (event.key === "ArrowRight") {
        isRightArrowPressed = false;
    }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("pause-button").addEventListener("click", pauseGame);
document.getElementById("restart-button").addEventListener("click", resetGame);
document.getElementById("cancel-button").addEventListener("click", cancelGame);


