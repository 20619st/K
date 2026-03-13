import { describe, it, expect } from 'vitest';
import { isGameOver } from '../../site/game.js';

// ===== isGameOver tests (T013) =====

describe('isGameOver', () => {
  it('returns false when there are empty cells', () => {
    const board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 0], // one empty cell
    ];
    expect(isGameOver(board)).toBe(false);
  });

  it('returns false when adjacent horizontal tiles share a value', () => {
    const board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 2, 8], // two adjacent 2s in last row
    ];
    expect(isGameOver(board)).toBe(false);
  });

  it('returns false when adjacent vertical tiles share a value', () => {
    const board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 4], // last col: row2=4, row3=4
    ];
    expect(isGameOver(board)).toBe(false);
  });

  it('returns true when board is full and no adjacent equal tiles', () => {
    const board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(isGameOver(board)).toBe(true);
  });
});
