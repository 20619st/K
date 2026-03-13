// ===== Pure Functions (exported for testing) =====

/**
 * Slide a row to the left, merging equal adjacent tiles (once each).
 * @param {number[]} row - Array of 4 numbers (0 = empty)
 * @returns {{ result: number[], delta: number }}
 */
export function slideRow(row) {
  // Step 1: filter out zeros
  const tiles = row.filter(v => v !== 0);

  const result = [];
  let delta = 0;
  let i = 0;

  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
      const merged = tiles[i] * 2;
      result.push(merged);
      delta += merged;
      i += 2; // skip both merged tiles
    } else {
      result.push(tiles[i]);
      i++;
    }
  }

  // Step 3: pad with zeros to length 4
  while (result.length < 4) result.push(0);

  return { result, delta };
}

/**
 * Rotate a 4×4 board clockwise by `times` steps.
 * @param {number[][]} board
 * @param {number} times
 * @returns {number[][]}
 */
export function rotateBoard(board, times) {
  const n = 4;
  let b = board.map(row => [...row]);
  const steps = ((times % 4) + 4) % 4;

  for (let t = 0; t < steps; t++) {
    const next = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        next[c][n - 1 - r] = b[r][c];
      }
    }
    b = next;
  }
  return b;
}

/**
 * Return true when the board is full and no adjacent cells share a value.
 * @param {number[][]} board
 * @returns {boolean}
 */
export function isGameOver(board) {
  const n = 4;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c] === 0) return false;
      if (c + 1 < n && board[r][c] === board[r][c + 1]) return false;
      if (r + 1 < n && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
}

// ===== Game State =====

let board = [];
let score = 0;
let bestScore = 0;
let status = 'playing'; // 'playing' | 'over'
let hasWon = false;

/**
 * Spawn a random tile (2 at 90%, 4 at 10%) in an empty cell.
 * Returns a new board (does not mutate the input).
 * @param {number[][]} b
 * @returns {number[][]}
 */
export function spawnTile(b) {
  const empties = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (b[r][c] === 0) empties.push([r, c]);
    }
  }
  if (empties.length === 0) return b;

  const newBoard = b.map(row => [...row]);
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

// ===== DOM Helpers =====

function renderBoard() {
  if (typeof document === 'undefined') return;
  const cells = document.querySelectorAll('#game-board .cell');
  cells.forEach(cell => {
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    const val = board[r][c];

    // Remove old tile if any
    const existing = cell.querySelector('.tile');
    if (existing) cell.removeChild(existing);

    if (val !== 0) {
      const tile = document.createElement('div');
      tile.className = `tile ${val <= 2048 ? `tile-${val}` : 'tile-super'}`;
      tile.dataset.value = val;
      tile.textContent = val;
      cell.appendChild(tile);
    }
  });
}

function updateScoreDisplay() {
  if (typeof document === 'undefined') return;
  document.getElementById('score-display').textContent = score;
  document.getElementById('best-score-display').textContent = bestScore;
}

function showOverlay(text, showContinue) {
  if (typeof document === 'undefined') return;
  const overlay = document.getElementById('message-overlay');
  document.getElementById('message-text').textContent = text;
  document.getElementById('continue-btn').style.display = showContinue ? '' : 'none';
  overlay.classList.remove('hidden');
}

function hideOverlay() {
  if (typeof document === 'undefined') return;
  document.getElementById('message-overlay').classList.add('hidden');
}

// ===== Core Game Logic =====

/**
 * Perform one move in the given direction.
 * @param {'up'|'down'|'left'|'right'} direction
 */
export function move(direction) {
  if (status !== 'playing') return;

  const rotations = { left: 0, up: 3, right: 2, down: 1 };
  const times = rotations[direction];

  let rotated = rotateBoard(board, times);
  let moveDelta = 0;
  let changed = false;

  const newRotated = rotated.map(row => {
    const { result, delta } = slideRow(row);
    if (result.join(',') !== row.join(',')) changed = true;
    moveDelta += delta;
    return result;
  });

  if (!changed) return;

  board = rotateBoard(newRotated, (4 - times) % 4);

  // Update score
  score += moveDelta;
  if (score > bestScore) bestScore = score;

  // Spawn a new tile
  board = spawnTile(board);

  renderBoard();
  updateScoreDisplay();

  // Check win (show once)
  if (!hasWon) {
    const has2048 = board.some(row => row.some(v => v >= 2048));
    if (has2048) {
      hasWon = true;
      showOverlay('恭喜！你達到 2048！', true);
      return;
    }
  }

  // Check game over
  if (isGameOver(board)) {
    status = 'over';
    showOverlay('遊戲結束', false);
  }
}

/**
 * Initialise or reset the game.
 */
export function initGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;
  status = 'playing';
  hasWon = false;

  board = spawnTile(board);
  board = spawnTile(board);

  renderBoard();
  updateScoreDisplay();
  hideOverlay();
}

// ===== Export state accessors for testing (T029) =====
export function getScore() { return score; }
export function getStatus() { return status; }
export function getHasWon() { return hasWon; }
export function getBoard() { return board; }

// ===== Event Listeners (browser-only) =====

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initGame();

    // Keyboard input
    document.addEventListener('keydown', e => {
      const map = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
      };
      if (map[e.key]) {
        e.preventDefault();
        move(map[e.key]);
      }
    });

    // Touch swipe
    let touchStartX = 0;
    let touchStartY = 0;
    document.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        move(dx > 0 ? 'right' : 'left');
      } else {
        move(dy > 0 ? 'down' : 'up');
      }
    }, { passive: true });

    // Continue button (after win)
    document.getElementById('continue-btn').addEventListener('click', () => {
      hideOverlay();
      status = 'playing';
    });

    // Restart buttons
    const restartHandler = () => initGame();
    document.getElementById('restart-btn').addEventListener('click', restartHandler);
    document.getElementById('overlay-restart-btn').addEventListener('click', restartHandler);
  });
}

