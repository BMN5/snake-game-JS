const playBoard = document.querySelector(".play-board");
const scoreElem = document.getElementById("score");
const highScoreElem = document.getElementById("high-score");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");

let foodX, foodY;
let snakeX, snakeY;
let velocityX, velocityY;
let snakeBody;
let score;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameInterval = null;
let isGameRunning = false;
let isGameOver = false;

// Update score display
const updateScore = () => {
    scoreElem.textContent = `Score: ${score}`;
    highScoreElem.textContent = `High Score: ${highScore}`;
};

// Generate random food position
const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

// Reset game state
const resetGame = () => {
    snakeX = 5;
    snakeY = 10;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    isGameOver = false;
    updateScore();
    changeFoodPosition();
    renderBoard();
};

// Start the game
const startGame = () => {
    if (isGameRunning) return;
    resetGame();
    isGameRunning = true;
    startBtn.disabled = true;
    resetBtn.disabled = true;
    document.addEventListener("keydown", changeDirection);
    gameInterval = setInterval(initGame, 125);
};

// End the game
const endGame = () => {
    clearInterval(gameInterval);
    isGameRunning = false;
    isGameOver = true;
    startBtn.disabled = false;
    resetBtn.disabled = false;
    document.removeEventListener("keydown", changeDirection);
};

// Handle direction change
const changeDirection = (e) => {
    if (!isGameRunning) return;
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

// Render game board
const renderBoard = () => {
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }
    htmlMarkup += `<div class="head" style="grid-area: ${snakeY} / ${snakeX}"></div>`;
    playBoard.innerHTML = htmlMarkup;
};

// Main game loop
const initGame = () => {
    // Move snake body
    if (snakeBody.length) {
        snakeBody = [[snakeX, snakeY], ...snakeBody.slice(0, -1)];
    }

    // Eat food
    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]);
        score++;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
        }
        updateScore();
        changeFoodPosition();
    }

    // Move snake
    snakeX += velocityX;
    snakeY += velocityY;

    // Check wall collision
    if (
        snakeX <= 0 || snakeX > 30 ||
        snakeY <= 0 || snakeY > 30
    ) {
        alert("Game Over! You hit the wall.");
        endGame();
        return;
    }

    // Check self collision
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            alert("Game Over! You collided with yourself.");
            endGame();
            return;
        }
    }

    renderBoard();
};

// Button event listeners
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", () => {
    resetGame();
    startBtn.disabled = true;
    resetBtn.disabled = true;
    isGameRunning = true;
    document.addEventListener("keydown", changeDirection);
    gameInterval = setInterval(initGame, 125);
});

// Mobile controls
const upBtn = document.getElementById("up-btn");
const downBtn = document.getElementById("down-btn");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");

const mobileDirection = (dir) => {
    if (!isGameRunning) return;
    if (dir === "up" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (dir === "down" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (dir === "left" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (dir === "right" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

upBtn.addEventListener("touchstart", () => mobileDirection("up"));
downBtn.addEventListener("touchstart", () => mobileDirection("down"));
leftBtn.addEventListener("touchstart", () => mobileDirection("left"));
rightBtn.addEventListener("touchstart", () => mobileDirection("right"));

// Initial setup
updateScore();
resetGame();
