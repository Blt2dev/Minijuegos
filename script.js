const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameContainer = document.getElementById("gameContainer");
const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let direction = { x: 0, y: 0 };
let apple = { x: 0, y: 0 };
let score = 0;
let gameInterval;
let lastDirection = { x: 0, y: 0 };

startBtn.addEventListener("click", () => {
  menu.style.display = "none";
  gameContainer.style.display = "flex";
  startGame();
  window.focus(); // Para que capture bien el teclado
});

function startGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  direction = { x: 1, y: 0 };
  lastDirection = { x: 1, y: 0 };
  score = 0;
  scoreElement.textContent = score;
  placeApple();
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 140);
}

function gameLoop() {
  moveSnake();

  if (isGameOver()) {
    clearInterval(gameInterval);
    alert(`¡Perdiste! Puntos: ${score}. Reiniciando...`);
    startGame();
    return;
  }

  clearCanvas();
  drawApple();
  drawSnake();
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  snake.unshift(head);

  // Comer manzana
  if (head.x === apple.x && head.y === apple.y) {
    score++;
    scoreElement.textContent = score;
    placeApple();
  } else {
    snake.pop();
  }

  lastDirection = direction;
}

function isGameOver() {
  const head = snake[0];

  // Bordes
  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount
  ) {
    return true;
  }

  // Auto-colisión
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

function clearCanvas() {
  ctx.fillStyle = "#f8f8f8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "#27ae60";
  snake.forEach((segment, i) => {
    const x = segment.x * gridSize;
    const y = segment.y * gridSize;
    ctx.fillRect(x, y, gridSize, gridSize);
    // Cabeza con un color diferente
    if (i === 0) {
      ctx.fillStyle = "#2ecc71";
      ctx.fillRect(x, y, gridSize, gridSize);
      ctx.fillStyle = "#27ae60";
    }
  });
}

function drawApple() {
  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  const x = apple.x * gridSize + gridSize / 2;
  const y = apple.y * gridSize + gridSize / 2;
  const radius = gridSize / 2.5;
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function placeApple() {
  let newApplePos;
  while (true) {
    newApplePos = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };

    let collision = snake.some(segment => segment.x === newApplePos.x && segment.y === newApplePos.y);
    if (!collision) break;
  }
  apple = newApplePos;
}

window.addEventListener("keydown", (e) => {
  switch (e.key.toLowerCase()) {
    case "w":
    case "arrowup":
      if (lastDirection.y === 1) break; // evitar ir hacia atrás
      direction = { x: 0, y: -1 };
      break;
    case "s":
    case "arrowdown":
      if (lastDirection.y === -1) break;
      direction = { x: 0, y: 1 };
      break;
    case "a":
    case "arrowleft":
      if (lastDirection.x === 1) break;
      direction = { x: -1, y: 0 };
      break;
    case "d":
    case "arrowright":
      if (lastDirection.x === -1) break;
      direction = { x: 1, y: 0 };
      break;
  }
});
