import { describe, it, expect, beforeEach } from 'vitest';
import { slideRow, rotateBoard, initGame, getScore, getStatus, getHasWon, getBoard } from '../../site/game.js';

// ===== slideRow tests (T011) =====

describe('slideRow', () => {
  it('returns all-zero row unchanged', () => {
    const { result, delta } = slideRow([0, 0, 0, 0]);
    expect(result).toEqual([0, 0, 0, 0]);
    expect(delta).toBe(0);
  });

  it('slides tiles all the way to the left', () => {
    const { result } = slideRow([0, 0, 0, 2]);
    expect(result).toEqual([2, 0, 0, 0]);
  });

  it('merges adjacent equal tiles', () => {
    const { result, delta } = slideRow([2, 2, 0, 0]);
    expect(result).toEqual([4, 0, 0, 0]);
    expect(delta).toBe(4);
  });

  it('fills merged result to the left', () => {
    const { result } = slideRow([0, 2, 0, 2]);
    expect(result).toEqual([4, 0, 0, 0]);
  });

  it('does not merge a tile more than once per move (FR-007)', () => {
    const { result, delta } = slideRow([2, 2, 2, 2]);
    expect(result).toEqual([4, 4, 0, 0]);
    expect(delta).toBe(8);
  });

  it('delta equals the sum of merged tile values', () => {
    const { delta } = slideRow([4, 4, 8, 8]);
    expect(delta).toBe(8 + 16); // 4+4=8, 8+8=16
  });

  it('handles a row with no merges', () => {
    const { result, delta } = slideRow([2, 4, 8, 16]);
    expect(result).toEqual([2, 4, 8, 16]);
    expect(delta).toBe(0);
  });

  it('complex case: [2, 0, 2, 4]', () => {
    const { result, delta } = slideRow([2, 0, 2, 4]);
    expect(result).toEqual([4, 4, 0, 0]);
    expect(delta).toBe(4);
  });
});

// ===== rotateBoard tests (T012) =====

describe('rotateBoard', () => {
  const board = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ];

  it('rotates clockwise once correctly', () => {
    const rotated = rotateBoard(board, 1);
    expect(rotated).toEqual([
      [13, 9, 5, 1],
      [14, 10, 6, 2],
      [15, 11, 7, 3],
      [16, 12, 8, 4],
    ]);
  });

  it('rotating 4 times returns original board', () => {
    const result = rotateBoard(board, 4);
    expect(result).toEqual(board);
  });

  it('rotating 2 times equals 180 degrees', () => {
    const result = rotateBoard(board, 2);
    expect(result).toEqual([
      [16, 15, 14, 13],
      [12, 11, 10, 9],
      [8, 7, 6, 5],
      [4, 3, 2, 1],
    ]);
  });
});

// ===== initGame state tests (T029) =====

describe('initGame', () => {
  beforeEach(() => {
    initGame();
  });

  it('score is 0 after init', () => {
    expect(getScore()).toBe(0);
  });

  it('hasWon is false after init', () => {
    expect(getHasWon()).toBe(false);
  });

  it('status is playing after init', () => {
    expect(getStatus()).toBe('playing');
  });

  it('board has exactly 2 non-zero tiles after init', () => {
    const b = getBoard();
    const nonZero = b.flat().filter(v => v !== 0).length;
    expect(nonZero).toBe(2);
  });
});
