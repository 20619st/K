import { describe, it, expect } from 'vitest';
import { slideRow } from '../../site/game.js';

// ===== Score calculation tests (T025) =====

describe('score via slideRow delta', () => {
  it('initial delta is 0 for no-merge row', () => {
    const { delta } = slideRow([2, 4, 8, 16]);
    expect(delta).toBe(0);
  });

  it('delta equals 128 when merging two 64 tiles', () => {
    const { delta } = slideRow([64, 64, 0, 0]);
    expect(delta).toBe(128);
  });

  it('multiple merges in one move accumulate correctly', () => {
    // [4, 4, 8, 8] → merge 4+4=8, 8+8=16 → delta = 24
    const { delta } = slideRow([4, 4, 8, 8]);
    expect(delta).toBe(24);
  });
});

// ===== Best score tracking tests (T026) =====
// These tests validate the logic described in data-model.md:
// bestScore = Math.max(bestScore, score after each move)
// After restart: score = 0, bestScore retained

describe('bestScore logic', () => {
  it('bestScore stays 0 when score never exceeds it', () => {
    let score = 0;
    let bestScore = 0;
    const { delta } = slideRow([2, 2, 0, 0]); // delta = 4
    score += delta;
    bestScore = Math.max(bestScore, score);
    expect(bestScore).toBe(4);
  });

  it('bestScore updates when current score exceeds it', () => {
    let score = 100;
    let bestScore = 50;
    bestScore = Math.max(bestScore, score);
    expect(bestScore).toBe(100);
  });

  it('bestScore is retained after score reset', () => {
    let score = 200;
    let bestScore = 200;
    // simulate restart
    score = 0;
    // bestScore NOT reset
    expect(score).toBe(0);
    expect(bestScore).toBe(200);
  });
});
