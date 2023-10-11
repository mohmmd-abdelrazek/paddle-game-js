const container = document.getElementById("game-container"),
board = document.getElementById("board"),
ball = document.getElementById("ball"),
gameOverScreen = document.getElementById("game-over"),
startPage = document.getElementById("start-page"),
scoreElement = document.getElementById("score"),
levelElement = document.getElementById("level")

let level = localStorage.getItem("level") || 1,
boardSpeed= 10,
ballSpeedX= 8 + +level,
ballSpeedY= 8 + +level,
boardX= container.offsetWidth / 2 - board.offsetWidth / 2,
ballX= container.offsetWidth / 2 - ball.offsetWidth / 2,
ballY= container.offsetHeight - board.offsetHeight - ball.offsetHeight - 20,
score = 0,
isLeftArrowPressed = false,
isRightArrowPressed = false,
isGameRunning = false,
isGamePaused = false,
animationFrameId;

levelElement.innerHTML = level;

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

    if (board.offsetTop - ball.offsetHeight == ball.offsetTop) {
        if (leftBoardCollision() || rightBoardCollision() || centerBoardCollision()) {
            ballSpeedY *= -1;
            score++;
            scoreElement.innerHTML = score;
            if (leftBoardCollision() && ballSpeedX > 0) {
                ballSpeedX *= -1;
            } else if (rightBoardCollision() && ballSpeedX < 0) {
                ballSpeedX *= -1;
            }
        }
        
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
    ballSpeedX= 8 + +level;
    ballSpeedY= 8 + +level;
    boardX = container.offsetWidth / 2 - board.offsetWidth / 2;
    ballX = container.offsetWidth / 2 - ball.offsetWidth / 2;
    ballY = container.offsetHeight - board.offsetHeight - ball.offsetHeight - 20;
    document.getElementById("pause-button").style.display = "block";
    startPage.style.display = "none";
    score = 0;
    scoreElement.innerHTML = score;
    animationFrameId = requestAnimationFrame(move);
}

function leftBoardCollision() {
    return board.offsetLeft - ball.offsetWidth <= ball.offsetLeft &&
    board.offsetLeft + board.offsetWidth / 2 > ball.offsetLeft + ball.offsetWidth / 2;
}
function rightBoardCollision() {
    return board.offsetLeft + board.offsetWidth / 2 < ball.offsetLeft + ball.offsetWidth / 2 &&
    board.offsetLeft + board.offsetWidth >= ball.offsetLeft;
}
function centerBoardCollision() {
    return board.offsetLeft + board.offsetWidth / 2 == ball.offsetLeft + ball.offsetWidth / 2;
    
}


function pauseGame() {
    isGamePaused = !isGamePaused;
    document.getElementById("pause-button").textContent = isGamePaused ? "&#9658;" : "||";
    isGamePaused ? cancelAnimationFrame(animationFrameId) : animationFrameId = requestAnimationFrame(move);
}

function gameOver() {
    document.querySelector(".game-over__text").innerHTML = "Game over!";
    isGameRunning = false;
    cancelAnimationFrame(animationFrameId);
    gameOverScreen.style.display = "flex";
    document.getElementById("pause-button").style.display = "none";
    if (level == 10 && score == 5) {
      document.querySelector(".game-over__text").innerHTML = "You win!";
    }    
}

function finishLevel() {
    level++;
    localStorage.setItem("level", level);
    levelElement.innerHTML = level; 
    ballSpeedX > 0 ? ballSpeedX = 8 + +level : ballSpeedX = -8 - +level;
    ballSpeedY > 0 ? ballSpeedY = 8 + +level : ballSpeedY = -8 - +level;
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
    level == 10 && (level = 1);
    localStorage.setItem("level", level);
    levelElement.innerHTML = level;
}

function handleKey(event, isDown) {
    if (event.key === "ArrowLeft") isLeftArrowPressed = isDown;
    if (event.key === "ArrowRight") isRightArrowPressed = isDown;
}

document.addEventListener("keydown", (e) => handleKey(e, true));
document.addEventListener("keyup", (e) => handleKey(e, false));


document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("pause-button").addEventListener("click", pauseGame);
document.getElementById("restart-button").addEventListener("click", resetGame);
document.getElementById("cancel-button").addEventListener("click", cancelGame);


