// Initialize the canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Game properties
const game = {
  width: canvas.width,
  height: canvas.height,
  playerSize: 20,
  playerSpeed: 5,
  bulletSize: 5,
  bulletSpeed: 7,
  enemySize: 20,
  enemySpeed: 2,
  enemies: [],
  bullets: [],
  score: 0,
  gameOver: false,
};

// Player properties
const player = {
  x: game.width / 2,
  y: game.height - game.playerSize,
};

// Keyboard state
const keys = {};

// Update player position based on key states
function updatePlayer() {
  if (keys.ArrowLeft) {
    player.x -= game.playerSpeed;
  }
  if (keys.ArrowRight) {
    player.x += game.playerSpeed;
  }

  // Keep player within game boundaries
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x + game.playerSize > game.width) {
    player.x = game.width - game.playerSize;
  }
}

// Create a bullet at player position
function shootBullet() {
  const bullet = {
    x: player.x + game.playerSize / 2 - game.bulletSize / 2,
    y: player.y,
  };
  game.bullets.push(bullet);
}

// Update bullets position and check for collisions
function updateBullets() {
  for (let i = 0; i < game.bullets.length; i++) {
    const bullet = game.bullets[i];
    bullet.y -= game.bulletSpeed;

    // Check if bullet hits an enemy
    for (let j = 0; j < game.enemies.length; j++) {
      const enemy = game.enemies[j];
      if (
        bullet.x < enemy.x + game.enemySize &&
        bullet.x + game.bulletSize > enemy.x &&
        bullet.y < enemy.y + game.enemySize &&
        bullet.y + game.bulletSize > enemy.y
      ) {
        // Remove bullet and enemy
        game.bullets.splice(i, 1);
        game.enemies.splice(j, 1);
        game.score++;
        break;
      }
    }

    // Remove bullet if it goes out of bounds
    if (bullet.y < 0) {
      game.bullets.splice(i, 1);
    }
  }
}

// Update enemies position and check for collisions with player
function updateEnemies() {
  for (let i = 0; i < game.enemies.length; i++) {
    const enemy = game.enemies[i];
    enemy.y += game.enemySpeed;

    // Check if enemy hits player
    if (
      player.x < enemy.x + game.enemySize &&
      player.x + game.playerSize > enemy.x &&
      player.y < enemy.y + game.enemySize &&
      player.y + game.playerSize > enemy.y
    ) {
      game.gameOver = true;
      break;
    }

    // Remove enemy if it goes out of bounds
    if (enemy.y > game.height) {
      game.enemies.splice(i, 1);
    }
  }
}

// Draw the player
function drawPlayer() {
  ctx.fillStyle = "green";
  ctx.fillRect(player.x, player.y, game.playerSize, game.playerSize);
}

// Draw the bullets
function drawBullets() {
  ctx.fillStyle = "red";
  for (let i = 0; i < game.bullets.length; i++) {
    const bullet = game.bullets[i];
    ctx.fillRect(bullet.x, bullet.y, game.bulletSize, game.bulletSize);
  }
}

// Draw the enemies
function drawEnemies() {
  ctx.fillStyle = "blue";
  for (let i = 0; i < game.enemies.length; i++) {
    const enemy = game.enemies[i];
    ctx.fillRect(enemy.x, enemy.y, game.enemySize, game.enemySize);
  }
}

// Draw the score
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + game.score, 10, 30);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, game.width, game.height);

  if (!game.gameOver) {
    updatePlayer();
    updateBullets();
    updateEnemies();
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawScore();
    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.fillText("Game Over", game.width / 2 - 100, game.height / 2);
  }
}

// Keyboard event listeners
document.addEventListener("keydown", function(event) {
  keys[event.key] = true;
  if (event.key === " ") {
    shootBullet();
  }
});

document.addEventListener("keyup", function(event) {
  keys[event.key] = false;
});

// Start the game
function startGame() {
  gameLoop();
  setInterval(function() {
    const enemy = {
      x: Math.random() * (game.width - game.enemySize),
      y: 0,
    };
    game.enemies.push(enemy);
  }, 1000);
}

startGame();
