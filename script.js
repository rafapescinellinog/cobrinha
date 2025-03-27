const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const startButton = document.getElementById("startButton");
const gameOverMessage = document.getElementById("gameOverMessage");

const gridSize = 20;
const canvasSize = 400;
let snake;
let direction;
let food;
let gameOver;
let score;
let gameInterval; // Variável para controlar o intervalo

const updateInterval = 400; // Defina o tempo entre cada atualização (em milissegundos)

// Função para reiniciar o jogo
function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    food = generateFood();
    gameOver = false;
    score = 0;
    scoreElement.textContent = `Pontuação: ${score}`;
    gameOverMessage.style.display = "none";
    startButton.style.display = "none";

    // Limpa qualquer intervalo anterior
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    // Inicia o intervalo com o tempo de atualização definido
    gameInterval = setInterval(updateGame, updateInterval);
}

// Função para desenhar a cobra
function drawSnake() {
    ctx.fillStyle = "green";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

// Função para desenhar a comida
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Função para mover a cobra
function moveSnake() {
    if (gameOver) return;
    let head = { ...snake[0] };
    switch (direction) {
        case "UP": head.y -= gridSize; break;
        case "DOWN": head.y += gridSize; break;
        case "LEFT": head.x -= gridSize; break;
        case "RIGHT": head.x += gridSize; break;
    }
    
    // Verifica se a cobra bateu nas bordas ou nela mesma
    if (head.x < 0 || head.y < 0 || head.x >= canvasSize || head.y >= canvasSize || checkCollision(head)) {
        gameOver = true;
        showGameOver();
        return;
    }
    
    snake.unshift(head); // Adiciona a nova cabeça da cobra
    if (head.x === food.x && head.y === food.y) {
        food = generateFood(); // Gera nova comida
        score += 10;
        scoreElement.textContent = `Pontuação: ${score}`;
    } else {
        snake.pop(); // Remove a cauda da cobra
    }
}

// Função para gerar a comida
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
    };
}

// Função para verificar se a cobra colidiu com ela mesma
function checkCollision(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// Função para atualizar o jogo
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawSnake();
    drawFood();
}

// Função para exibir a tela de "Game Over"
function showGameOver() {
    gameOverMessage.textContent = `Game Over! Sua pontuação: ${score}`;
    gameOverMessage.style.display = "block";
    startButton.style.display = "inline-block";
}

// Evento para controlar os movimentos da cobra
document.addEventListener("keydown", (event) => {
    if ((event.key === "ArrowUp" && direction !== "DOWN") ||
        (event.key === "ArrowDown" && direction !== "UP") ||
        (event.key === "ArrowLeft" && direction !== "RIGHT") ||
        (event.key === "ArrowRight" && direction !== "LEFT")) {
        direction = event.key.replace("Arrow", "").toUpperCase();
    }
});

// Evento para reiniciar o jogo quando o botão for clicado
startButton.addEventListener("click", resetGame);
