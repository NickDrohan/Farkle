/**
 * Farkle Game Test Suite
 * Tests all scoring rules and game logic
 */

const FarkleGame = require('./farkle.js');

// Mock DOM elements for testing
const mockDOM = () => {
  document.body.innerHTML = `
    <button id="startGameBtn"></button>
    <button id="rollDiceBtn"></button>
    <button id="bankDiceBtn"></button>
    <button id="endTurnBtn"></button>
    <input id="numPlayers" value="2" />
    <input id="targetScore" value="10000" />
    <div id="gameboard" class="hidden"></div>
    <ul id="scoreList"></ul>
    <div id="activePlayerLabel"></div>
    <div id="turnScoreLabel"></div>
    <div id="diceArea"></div>
    <div class="setup"></div>
  `;
};

describe('FarkleGame - Scoring Rules', () => {
  let game;

  beforeEach(() => {
    mockDOM();
    game = new FarkleGame();
  });

  describe('calculateScore - Basic Scoring (Single 1s and 5s)', () => {
    test('single 1 scores 100 points', () => {
      expect(game.calculateScore([1])).toBe(100);
    });

    test('single 5 scores 50 points', () => {
      expect(game.calculateScore([5])).toBe(50);
    });

    test('two 1s score 200 points', () => {
      expect(game.calculateScore([1, 1])).toBe(200);
    });

    test('two 5s score 100 points', () => {
      expect(game.calculateScore([5, 5])).toBe(100);
    });

    test('one 1 and one 5 scores 150 points', () => {
      expect(game.calculateScore([1, 5])).toBe(150);
    });

    test('single 2, 3, 4, or 6 scores 0 points', () => {
      expect(game.calculateScore([2])).toBe(0);
      expect(game.calculateScore([3])).toBe(0);
      expect(game.calculateScore([4])).toBe(0);
      expect(game.calculateScore([6])).toBe(0);
    });

    test('non-scoring dice combination scores 0 points', () => {
      expect(game.calculateScore([2, 3, 4, 6])).toBe(0);
    });
  });

  describe('calculateScore - Three of a Kind', () => {
    test('three 1s score 1000 points', () => {
      expect(game.calculateScore([1, 1, 1])).toBe(1000);
    });

    test('three 2s score 200 points', () => {
      expect(game.calculateScore([2, 2, 2])).toBe(200);
    });

    test('three 3s score 300 points', () => {
      expect(game.calculateScore([3, 3, 3])).toBe(300);
    });

    test('three 4s score 400 points', () => {
      expect(game.calculateScore([4, 4, 4])).toBe(400);
    });

    test('three 5s score 500 points', () => {
      expect(game.calculateScore([5, 5, 5])).toBe(500);
    });

    test('three 6s score 600 points', () => {
      expect(game.calculateScore([6, 6, 6])).toBe(600);
    });
  });

  describe('calculateScore - Four of a Kind', () => {
    test('four 1s score 2000 points (1000 * 2)', () => {
      expect(game.calculateScore([1, 1, 1, 1])).toBe(2000);
    });

    test('four 2s score 400 points (200 * 2)', () => {
      expect(game.calculateScore([2, 2, 2, 2])).toBe(400);
    });

    test('four 5s score 1000 points (500 * 2)', () => {
      expect(game.calculateScore([5, 5, 5, 5])).toBe(1000);
    });

    test('four 6s score 1200 points (600 * 2)', () => {
      expect(game.calculateScore([6, 6, 6, 6])).toBe(1200);
    });
  });

  describe('calculateScore - Five of a Kind', () => {
    test('five 1s score 4000 points (1000 * 4)', () => {
      expect(game.calculateScore([1, 1, 1, 1, 1])).toBe(4000);
    });

    test('five 2s score 800 points (200 * 4)', () => {
      expect(game.calculateScore([2, 2, 2, 2, 2])).toBe(800);
    });

    test('five 3s score 1200 points (300 * 4)', () => {
      expect(game.calculateScore([3, 3, 3, 3, 3])).toBe(1200);
    });
  });

  describe('calculateScore - Six of a Kind', () => {
    test('six 1s score 8000 points (1000 * 8)', () => {
      expect(game.calculateScore([1, 1, 1, 1, 1, 1])).toBe(8000);
    });

    test('six 2s score 1600 points (200 * 8)', () => {
      expect(game.calculateScore([2, 2, 2, 2, 2, 2])).toBe(1600);
    });

    test('six 4s score 3200 points (400 * 8)', () => {
      expect(game.calculateScore([4, 4, 4, 4, 4, 4])).toBe(3200);
    });
  });

  describe('calculateScore - Straight (1-6)', () => {
    test('straight 1-6 in order scores 1500 points', () => {
      expect(game.calculateScore([1, 2, 3, 4, 5, 6])).toBe(1500);
    });

    test('straight 1-6 out of order scores 1500 points', () => {
      expect(game.calculateScore([6, 3, 1, 5, 2, 4])).toBe(1500);
    });

    test('straight 1-6 scrambled scores 1500 points', () => {
      expect(game.calculateScore([3, 5, 2, 6, 1, 4])).toBe(1500);
    });

    test('incomplete straight scores normally (not as straight)', () => {
      expect(game.calculateScore([1, 2, 3, 4, 5])).toBe(150); // 1 scores 100, 5 scores 50
    });
  });

  describe('calculateScore - Three Pairs', () => {
    test('three pairs (2,2,3,3,4,4) scores 1500 points', () => {
      expect(game.calculateScore([2, 2, 3, 3, 4, 4])).toBe(1500);
    });

    test('three pairs (1,1,2,2,6,6) scores 1500 points', () => {
      expect(game.calculateScore([1, 1, 2, 2, 6, 6])).toBe(1500);
    });

    test('three pairs (5,5,4,4,3,3) scores 1500 points', () => {
      expect(game.calculateScore([5, 5, 4, 4, 3, 3])).toBe(1500);
    });

    test('three pairs out of order scores 1500 points', () => {
      expect(game.calculateScore([2, 4, 2, 6, 4, 6])).toBe(1500);
    });

    test('two pairs (not three) scores normally', () => {
      expect(game.calculateScore([2, 2, 3, 3])).toBe(0); // No scoring
    });

    test('one pair does not trigger three pairs rule', () => {
      expect(game.calculateScore([1, 1, 2, 3, 4, 6])).toBe(200); // Two 1s only
    });
  });

  describe('calculateScore - Two Triplets', () => {
    test('two triplets (2,2,2,3,3,3) scores 2500 points', () => {
      expect(game.calculateScore([2, 2, 2, 3, 3, 3])).toBe(2500);
    });

    test('two triplets (1,1,1,4,4,4) scores 2500 points', () => {
      expect(game.calculateScore([1, 1, 1, 4, 4, 4])).toBe(2500);
    });

    test('two triplets (5,5,5,6,6,6) scores 2500 points', () => {
      expect(game.calculateScore([5, 5, 5, 6, 6, 6])).toBe(2500);
    });

    test('two triplets out of order scores 2500 points', () => {
      expect(game.calculateScore([3, 2, 3, 2, 3, 2])).toBe(2500);
    });

    test('one triplet does not trigger two triplets rule', () => {
      expect(game.calculateScore([2, 2, 2])).toBe(200); // Standard three of a kind
    });
  });

  describe('calculateScore - Mixed Combinations', () => {
    test('three 2s plus one 1 and one 5 scores 350 points', () => {
      expect(game.calculateScore([2, 2, 2, 1, 5])).toBe(350); // 200 + 100 + 50
    });

    test('three 4s plus two 1s scores 600 points', () => {
      expect(game.calculateScore([4, 4, 4, 1, 1])).toBe(600); // 400 + 200
    });

    test('three 5s plus one 1 scores 600 points', () => {
      expect(game.calculateScore([5, 5, 5, 1])).toBe(600); // 500 + 100
    });

    test('four 3s plus one 5 scores 650 points', () => {
      expect(game.calculateScore([3, 3, 3, 3, 5])).toBe(650); // 600 + 50
    });
  });

  describe('calculateScore - Edge Cases', () => {
    test('empty array scores 0 points', () => {
      expect(game.calculateScore([])).toBe(0);
    });

    test('null input scores 0 points', () => {
      expect(game.calculateScore(null)).toBe(0);
    });

    test('undefined input scores 0 points', () => {
      expect(game.calculateScore(undefined)).toBe(0);
    });

    test('all non-scoring dice scores 0 points', () => {
      expect(game.calculateScore([2, 3, 4, 6])).toBe(0);
    });
  });

  describe('isFarkle - Farkle Detection', () => {
    beforeEach(() => {
      // Setup a fresh game state
      game.dice = [
        { value: 2, font: 'test' },
        { value: 3, font: 'test' },
        { value: 4, font: 'test' },
        { value: 6, font: 'test' },
        { value: 2, font: 'test' },
        { value: 3, font: 'test' }
      ];
      game.diceSelected = [];
    });

    test('all non-scoring dice is a farkle', () => {
      game.dice = [
        { value: 2, font: 'test' },
        { value: 3, font: 'test' },
        { value: 4, font: 'test' },
        { value: 6, font: 'test' },
        { value: 2, font: 'test' },
        { value: 3, font: 'test' }
      ];
      expect(game.isFarkle(game.dice)).toBe(true);
    });

    test('dice with scoring combinations is not a farkle', () => {
      game.dice = [
        { value: 1, font: 'test' },
        { value: 2, font: 'test' },
        { value: 3, font: 'test' },
        { value: 4, font: 'test' },
        { value: 6, font: 'test' },
        { value: 2, font: 'test' }
      ];
      expect(game.isFarkle(game.dice)).toBe(false);
    });

    test('dice with a single 5 is not a farkle', () => {
      game.dice = [
        { value: 5, font: 'test' },
        { value: 2, font: 'test' },
        { value: 3, font: 'test' },
        { value: 4, font: 'test' },
        { value: 6, font: 'test' },
        { value: 2, font: 'test' }
      ];
      expect(game.isFarkle(game.dice)).toBe(false);
    });

    test('three of a kind is not a farkle', () => {
      game.dice = [
        { value: 2, font: 'test' },
        { value: 2, font: 'test' },
        { value: 2, font: 'test' },
        { value: 4, font: 'test' },
        { value: 6, font: 'test' },
        { value: 3, font: 'test' }
      ];
      expect(game.isFarkle(game.dice)).toBe(false);
    });

    test('straight is not a farkle', () => {
      game.dice = [
        { value: 1, font: 'test' },
        { value: 2, font: 'test' },
        { value: 3, font: 'test' },
        { value: 4, font: 'test' },
        { value: 5, font: 'test' },
        { value: 6, font: 'test' }
      ];
      expect(game.isFarkle(game.dice)).toBe(false);
    });

    test('three pairs is not a farkle', () => {
      game.dice = [
        { value: 2, font: 'test' },
        { value: 2, font: 'test' },
        { value: 3, font: 'test' },
        { value: 3, font: 'test' },
        { value: 4, font: 'test' },
        { value: 4, font: 'test' }
      ];
      expect(game.isFarkle(game.dice)).toBe(false);
    });

    test('ignores selected dice when checking for farkle', () => {
      game.dice = [
        { value: 1, font: 'test' }, // selected
        { value: 5, font: 'test' }, // selected
        { value: 2, font: 'test' }, // unselected - no score
        { value: 3, font: 'test' }, // unselected - no score
        { value: 4, font: 'test' }, // unselected - no score
        { value: 6, font: 'test' }  // unselected - no score
      ];
      game.diceSelected = [0, 1]; // First two are selected
      expect(game.isFarkle(game.dice)).toBe(true); // Unselected dice are a farkle
    });

    test('empty dice array is not a farkle', () => {
      game.dice = [];
      game.diceSelected = [];
      expect(game.isFarkle(game.dice)).toBe(false);
    });

    test('all dice selected is not a farkle', () => {
      game.dice = [
        { value: 1, font: 'test' },
        { value: 5, font: 'test' }
      ];
      game.diceSelected = [0, 1];
      expect(game.isFarkle(game.dice)).toBe(false);
    });
  });

  describe('Game State Management', () => {
    test('game initializes with correct default values', () => {
      expect(game.numPlayers).toBe(2);
      expect(game.targetScore).toBe(10000);
      expect(game.currentPlayerIndex).toBe(0);
      expect(game.currentTurnScore).toBe(0);
      expect(game.gameActive).toBe(false);
      expect(game.isRolling).toBe(false);
    });

    test('dice array initializes empty', () => {
      expect(game.dice).toEqual([]);
    });

    test('diceSelected array initializes empty', () => {
      expect(game.diceSelected).toEqual([]);
    });

    test('players array initializes empty', () => {
      expect(game.players).toEqual([]);
    });
  });

  describe('DOM Caching', () => {
    test('caches all required DOM elements', () => {
      expect(game.startGameBtn).toBeTruthy();
      expect(game.rollDiceBtn).toBeTruthy();
      expect(game.bankDiceBtn).toBeTruthy();
      expect(game.endTurnBtn).toBeTruthy();
      expect(game.numPlayersInput).toBeTruthy();
      expect(game.targetScoreInput).toBeTruthy();
      expect(game.gameboard).toBeTruthy();
      expect(game.scoreList).toBeTruthy();
      expect(game.activePlayerLabel).toBeTruthy();
      expect(game.turnScoreLabel).toBeTruthy();
      expect(game.diceArea).toBeTruthy();
    });
  });

  describe('updateButtonStates - visual sync', () => {
    const buttons = () => [game.rollDiceBtn, game.bankDiceBtn, game.endTurnBtn];
    const expectStylesMatchDisabled = () => {
      buttons().forEach((btn) => {
        expect(btn.style.opacity).toBe(btn.disabled ? '0.5' : '1');
        expect(btn.style.cursor).toBe(btn.disabled ? 'not-allowed' : 'pointer');
      });
    };

    test('inactive game: all buttons disabled and styled as disabled', () => {
      game.disableControls(false);
      game.gameActive = false;
      game.updateButtonStates();
      buttons().forEach((btn) => expect(btn.disabled).toBe(true));
      expectStylesMatchDisabled();
    });

    test('no dice on board: bank looks disabled, roll and end turn look enabled', () => {
      game.disableControls(false);
      game.gameActive = true;
      game.dice = [];
      game.updateButtonStates();
      expect(game.rollDiceBtn.disabled).toBe(false);
      expect(game.bankDiceBtn.disabled).toBe(true);
      expect(game.endTurnBtn.disabled).toBe(false);
      expectStylesMatchDisabled();
    });

    test('dice on board with a scoring selection: styles follow disabled state', () => {
      game.disableControls(true);
      game.gameActive = true;
      game.dice = [{ value: 1 }, { value: 2 }];
      game.diceSelected = [0];
      game.updateButtonStates();
      expect(game.rollDiceBtn.disabled).toBe(true);
      expect(game.bankDiceBtn.disabled).toBe(false);
      expectStylesMatchDisabled();
    });
  });
});
