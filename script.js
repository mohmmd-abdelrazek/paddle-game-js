const container = document.getElementById("game-container");
const board = document.getElementById("board");
const ball = document.getElementById("ball");
const gameOverScreen = document.getElementById("game-over");
const startPage = document.getElementById("start-page");

let initialState = {
    boardSpeed: 10,
    ballSpeedX: 12,
    ballSpeedY: 12,
    boardX: container.offsetWidth / 2 - board.offsetWidth / 2,
    ballX: container.offsetWidth / 2 - ball.offsetWidth / 2,
    ballY: container.offsetHeight - board.offsetHeight - ball.offsetHeight - 20
};
let { boardSpeed, ballSpeedX, ballSpeedY, boardX, ballX, ballY } = initialState;

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
    }

    if (ballY + ball.offsetHeight >= container.offsetHeight - 5) {
        gameOver();
    }
    
    animationFrameId = requestAnimationFrame(move);
}

function startGame() {
    isGameRunning = true;
    animationFrameId = requestAnimationFrame(move);
    ({ boardSpeed, ballSpeedX, ballSpeedY } = initialState);
    boardX = container.offsetWidth / 2 - board.offsetWidth / 2;
    ballX = container.offsetWidth / 2 - ball.offsetWidth / 2;
    ballY = container.offsetHeight - board.offsetHeight - ball.offsetHeight - 20;
    document.getElementById("pause-button").style.display = "block";
    startPage.style.display = "none";
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
    isGameRunning = false;
    cancelAnimationFrame(animationFrameId);
    gameOverScreen.style.display = "flex";
    document.getElementById("pause-button").style.display = "none";
}

function resetGame() {
    gameOverScreen.style.display = "none";
    startGame();
}

function cancelGame() {
    startPage.style.display = "flex";
    gameOverScreen.style.display = "none"; 
}

document.addEventListener("keydown", function(event) {
    event.key === "ArrowLeft" && (isLeftArrowPressed = true);
    event.key === "ArrowRight" && (isRightArrowPressed = true);
});
document.addEventListener("keyup", function(event) {
    event.key === "ArrowLeft" && (isLeftArrowPressed = false);
    event.key === "ArrowRight" && (isRightArrowPressed = false);
});
document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("pause-button").addEventListener("click", pauseGame);
document.getElementById("restart-button").addEventListener("click", resetGame);
document.getElementById("cancel-button").addEventListener("click", cancelGame);


