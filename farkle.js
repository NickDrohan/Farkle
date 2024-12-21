/***********************************************************
 * Farkle Dice Game Implementation
 ************************************************************/

class FarkleGame {
  constructor() {
    // Game state variables
    this.numPlayers = 2;
    this.targetScore = 10000;
    this.players = [];
    this.currentPlayerIndex = 0;
    this.currentTurnScore = 0;
    this.dice = [];
    this.diceSelected = [];
    this.gameActive = false;
    this.isRolling = false;
    this.scoredDice = []; // Track which dice have been scored
    this.hotDiceUsed = false; // Track if Hot Dice was used this turn

    // Constants
    this.ROLL_ANIMATION_DURATION = 1500;
    this.ROLL_MIN_DURATION = 800;

    // Dice fonts array
    this.diceFonts = [
      "'Monoton', sans-serif",
      "'Modak', sans-serif",
      "'Moo Lah Lah', sans-serif",
      "'Rubik Dirt', sans-serif",
      "'Ruge Boogie', sans-serif",
      "'Bungee Shade', sans-serif",
    ];

    // Initialize the game
    this.init();
  }

  init() {
    // Bind DOM elements
    this.cacheDOM();
    this.bindEvents();
  }

  cacheDOM() {
    // DOM elements
    this.startGameBtn = document.getElementById("startGameBtn");
    this.rollDiceBtn = document.getElementById("rollDiceBtn");
    this.bankDiceBtn = document.getElementById("bankDiceBtn");
    this.endTurnBtn = document.getElementById("endTurnBtn");

    this.numPlayersInput = document.getElementById("numPlayers");
    this.targetScoreInput = document.getElementById("targetScore");
    this.gameboard = document.getElementById("gameboard");
    this.scoreList = document.getElementById("scoreList");
    this.activePlayerLabel = document.getElementById("activePlayerLabel");
    this.turnScoreLabel = document.getElementById("turnScoreLabel");
    this.diceArea = document.getElementById("diceArea");
  }

  bindEvents() {
    this.startGameBtn.addEventListener("click", this.startGame.bind(this));
    this.rollDiceBtn.addEventListener("click", this.rollDice.bind(this));
    this.bankDiceBtn.addEventListener("click", this.bankPoints.bind(this));
    this.endTurnBtn.addEventListener("click", this.endTurn.bind(this));
  }

  /**
   * Initializes the game by reading input for player count & target score,
   * and resetting the game state.
   */
  startGame() {
    const inputPlayers = parseInt(this.numPlayersInput.value, 10);
    const inputScore = parseInt(this.targetScoreInput.value, 10);

    // Validate inputs
    if (isNaN(inputPlayers) || inputPlayers < 1 || inputPlayers > 4) {
      alert("Please enter a valid number of players (1-4).");
      return;
    }
    if (isNaN(inputScore) || inputScore < 1000) {
      alert("Please enter a valid target score (minimum 1000).");
      return;
    }

    this.numPlayers = inputPlayers;
    this.targetScore = inputScore;

    // Reset game state
    this.players = Array(this.numPlayers).fill(0);
    this.currentPlayerIndex = 0;
    this.currentTurnScore = 0;
    this.gameActive = true;
    this.dice = [];
    this.diceSelected = [];

    // Update UI
    this.updateScoreList();
    this.updateActivePlayerLabel();

    this.diceArea.innerHTML = "";
    this.diceSelected = [];

    // Only hide setup, keep rules visible
    document.querySelector(".setup").classList.add("hidden");
    this.gameboard.classList.remove("hidden");

    this.updateButtonStates();
    
    // Automatically roll dice to start the game
    setTimeout(() => this.rollDice(), 500);
  }

  /**
   * Rolls all unselected dice. If no dice are selected, roll all six.
   */
  rollDice() {
    if (!this.gameActive || this.isRolling) {
      return;
    }

    // Prevent rolling if dice have already been rolled this turn and not banked
    if (this.dice.length > 0 && this.currentTurnScore === 0) {
      alert("You must bank your points or end your turn before rolling again.");
      return;
    }

    // If there are selected dice, prevent rolling until they are banked
    if (this.diceSelected.length > 0) {
      alert("You must bank your selected dice before rolling again.");
      return;
    }

    // Only clear selections when starting fresh with all dice
    if (this.dice.length === 0) {
      this.diceSelected = [];
      this.scoredDice = [];

      // Create a shuffled copy of the fonts array
      const shuffledFonts = [...this.diceFonts].sort(() => Math.random() - 0.5);

      for (let i = 0; i < 6; i++) {
        this.dice.push({
          value: 0,
          font: shuffledFonts[i], // Each die gets a unique font
        });
      }
    }

    // Collect indices of dice that are *not* selected
    const unselectedIndices = [];
    for (let i = 0; i < this.dice.length; i++) {
      if (!this.diceSelected.includes(i)) {
        unselectedIndices.push(i);
      }
    }

    if (unselectedIndices.length === 0) {
      alert("All dice selected. Bank or end turn.");
      return;
    }

    this.isRolling = true;
    this.disableControls(true);

    // Generate final random values for unselected dice
    let finalValues = [];
    for (let i = 0; i < unselectedIndices.length; i++) {
      finalValues.push(Math.floor(Math.random() * 6) + 1);
    }

    // Generate random stop times for each unselected die
    let diceStopTimes = [];
    for (let i = 0; i < unselectedIndices.length; i++) {
      const randomDuration =
        this.ROLL_MIN_DURATION +
        Math.random() * (this.ROLL_ANIMATION_DURATION - this.ROLL_MIN_DURATION);
      diceStopTimes.push(randomDuration);
    }

    let animationStart = null;
    let rollingValues = Array(unselectedIndices.length).fill(1);

    const easeOutQuad = (x) => {
      return 1 - (1 - x) * (1 - x);
    };

    const animate = (timestamp) => {
      if (!animationStart) {
        animationStart = timestamp;
      }

      const progress = timestamp - animationStart;
      let allDiceStopped = true;
      let newRollingValues = [...rollingValues];

      // Animate only the unselected dice
      for (let i = 0; i < unselectedIndices.length; i++) {
        if (progress < diceStopTimes[i]) {
          allDiceStopped = false;
          const dieProgress = progress / diceStopTimes[i];
          const easedProgress = easeOutQuad(dieProgress);
          if (Math.random() < easedProgress) {
            newRollingValues[i] = Math.floor(Math.random() * 6) + 1;
          }
        } else {
          newRollingValues[i] = finalValues[i];
        }
      }

      rollingValues = newRollingValues;

      // Update the main dice array with temporary rolling values
      for (let i = 0; i < unselectedIndices.length; i++) {
        this.dice[unselectedIndices[i]].value = rollingValues[i]; // Update value
      }

      this.showDice(true);

      if (!allDiceStopped) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete: finalize dice values
        for (let i = 0; i < unselectedIndices.length; i++) {
          this.dice[unselectedIndices[i]].value = finalValues[i];
        }
        this.isRolling = false;
        this.disableControls(false);

        // Check Farkle
        if (this.isFarkle(this.dice)) {
          setTimeout(() => {
            alert("Farkle! You lose all points this turn.");
            this.currentTurnScore = 0;
            this.diceSelected = []; // Clear selections
            this.dice = []; // Clear dice
            this.endTurn();
          }, 100);
          return;
        }

        this.showDice(false);
        this.updateButtonStates();
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Toggles selection of a die by index.
   */
  toggleDieSelection(index) {
    if (!this.dice || index < 0 || index >= this.dice.length) return;
    
    // Don't allow deselecting dice that have already been scored
    if (this.diceSelected.includes(index) && this.scoredDice.includes(index)) {
      return;
    }

    if (this.diceSelected.includes(index)) {
      // Unselect
      this.diceSelected = this.diceSelected.filter((i) => i !== index);
    } else {
      // Select
      this.diceSelected.push(index);
    }

    this.showDice();

    // Make sure we update the button states after changing selections
    this.updateButtonStates();
  }

  /**
   * Shows dice on the page based on current dice array
   * and highlights selected dice. Also calculates turn
   * score from the indices of selected dice.
   */
  showDice(isAnimating = false) {
    this.diceArea.innerHTML = "";

    this.dice.forEach((die, i) => {
      const dieEl = document.createElement("div");
      dieEl.classList.add("die");

      // Use the stored font for each die
      dieEl.style.fontFamily = die.font;

      // Increase font size
      dieEl.style.fontSize = "3rem";

      // Add animation class if we're animating
      if (isAnimating && !this.diceSelected.includes(i)) {
        dieEl.classList.add("rolling");
      }

      if (this.diceSelected.includes(i)) {
        dieEl.classList.add("selected");
      }

      dieEl.innerText = die.value.toString();

      // Only add click handlers if we're not animating
      if (!isAnimating) {
        dieEl.addEventListener("click", () => this.toggleDieSelection(i));
      }

      this.diceArea.appendChild(dieEl);
    });

    // Only update potential score display if we're not in animation
    if (!isAnimating) {
      const selectedValues = this.diceSelected.map((i) => this.dice[i].value);
      const potentialScore = this.calculateScore(selectedValues);
      // Show current turn score plus potential score from selected dice
      this.turnScoreLabel.textContent = `Turn Score: ${this.currentTurnScore}${
        potentialScore ? ` + ${potentialScore}` : ''
      }`;
    }
  }

  /**
   * Banks the selected dice points to the current player's total,
   * then removes those selected dice from the main array,
   * and refreshes the display.
   */
  bankPoints() {
    if (!this.gameActive) {
      return;
    }

    const selectedDiceValues = this.diceSelected.map((idx) => this.dice[idx].value);
    const scoreToAdd = this.calculateScore(selectedDiceValues);

    // Check if selected dice score points
    if (scoreToAdd === 0) {
      alert("Selected dice do not score any points. Please select scoring dice.");
      return;
    }

    // Add to turn score
    this.currentTurnScore += scoreToAdd;

    // Update the dice array to remove banked dice
    const remainingDice = [];
    for (let i = 0; i < this.dice.length; i++) {
      if (!this.diceSelected.includes(i)) {
        remainingDice.push(this.dice[i]);
      }
    }
    this.dice = remainingDice;

    // Clear selections
    this.diceSelected = [];

    // Redraw the dice
    this.showDice();

    // If all dice have been banked, let the user roll again this turn
    if (this.dice.length === 0) {
      alert("Hot Dice! You can roll all six dice again!");
      this.dice = []; // Reset dice to allow rolling all six again
    }

    this.updateButtonStates();
  }

  /**
   * Ends the current player's turn, moves to the next player,
   * checks for a winning condition, and resets turn-based variables.
   */
  endTurn() {
    if (!this.gameActive) return;

    // Add current turn score to the player's total score
    this.players[this.currentPlayerIndex] += this.currentTurnScore;

    // Check winning condition
    if (this.players[this.currentPlayerIndex] >= this.targetScore) {
      alert(`Player ${this.currentPlayerIndex + 1} has won with ${this.players[this.currentPlayerIndex]} points!`);
      this.gameActive = false;
      this.updateButtonStates();
      return;
    }

    // Move to the next player
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.numPlayers;
    this.currentTurnScore = 0;
    this.diceSelected = [];
    this.dice = [];
    this.showDice();
    this.updateActivePlayerLabel();
    this.updateScoreList();
    this.updateButtonStates();
  }

  /**
   * Helper to check for a Farkle: if dice contain no scoring combination.
   */
  isFarkle(diceRoll) {
    // Get only the unselected dice values
    const unselectedDice = diceRoll
      .filter((die, index) => !this.diceSelected.includes(index))
      .map((die) => die.value);

    // If there are no unselected dice, it's not a farkle
    if (unselectedDice.length === 0) return false;

    // Calculate score of unselected dice only
    const score = this.calculateScore(unselectedDice);
    return score === 0;
  }

  /**
   * Calculate Farkle score for a set of dice (like the ones selected).
   * This function uses simplified standard scoring:
   *  - Single 1 => 100
   *  - Single 5 => 50
   *  - Three of a kind => face value * 100 (except 1 => 1000)
   *  - Four, Five, Six of a kind => Points double starting from Three of a kind
   */
  calculateScore(diceSet) {
    if (!diceSet || diceSet.length === 0) return 0;

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    diceSet.forEach((val) => counts[val]++);

    let totalScore = 0;

    // Handle three or more of a kind
    for (let face = 1; face <= 6; face++) {
      if (counts[face] >= 3) {
        if (face === 1) {
          totalScore += 1000 * Math.pow(2, counts[face] - 3);
        } else {
          totalScore += face * 100 * Math.pow(2, counts[face] - 3);
        }
        counts[face] = 0; // Remove counted dice
      }
    }

    // Handle single ones and fives
    totalScore += counts[1] * 100;
    totalScore += counts[5] * 50;

    return totalScore;
  }

  /**
   * Updates the scoreboard (one line per player).
   */
  updateScoreList() {
    this.scoreList.innerHTML = "";
    this.players.forEach((score, index) => {
      const li = document.createElement("li");
      li.textContent = `Player ${index + 1}: ${score}`;
      this.scoreList.appendChild(li);
    });
  }

  /**
   * Updates active player label in UI.
   */
  updateActivePlayerLabel() {
    this.activePlayerLabel.textContent = `Player ${this.currentPlayerIndex + 1}'s Turn`;
  }

  /**
   * Adds visual feedback for disabled state of controls during animation.
   */
  disableControls(disabled) {
    const buttons = [this.rollDiceBtn, this.bankDiceBtn, this.endTurnBtn];
    buttons.forEach((btn) => {
      btn.disabled = disabled;
      if (disabled) {
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
      } else {
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
      }
    });
  }

  /**
   * Updates button states based on game state.
   */
  updateButtonStates() {
    if (!this.gameActive) {
      this.rollDiceBtn.disabled = true;
      this.bankDiceBtn.disabled = true;
      this.endTurnBtn.disabled = true;
      return;
    }

    // If no dice on board, allow rolling
    if (this.dice.length === 0) {
      this.rollDiceBtn.disabled = false;
      this.bankDiceBtn.disabled = true;
      this.endTurnBtn.disabled = false;
      return;
    }

    // Calculate score for selected dice
    const selectedValues = this.diceSelected.map((i) => this.dice[i].value);
    const potentialScore = this.calculateScore(selectedValues);

    // Enable bank button if there are selected dice AND they score points
    this.bankDiceBtn.disabled = this.diceSelected.length === 0 || potentialScore === 0;

    // Disable roll button if any dice are selected - must bank first
    this.rollDiceBtn.disabled = this.diceSelected.length > 0;

    // Allow ending turn anytime
    this.endTurnBtn.disabled = false;

    // Update visual state of buttons
    [this.rollDiceBtn, this.bankDiceBtn, this.endTurnBtn].forEach(btn => {
      if (btn.disabled) {
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
      } else {
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
      }
    });
  }
}

// Initialize the game when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const game = new FarkleGame();
});
