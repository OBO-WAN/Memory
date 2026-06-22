import { renderGameOver } from '../ui/render-game-over';
import { renderGameScreen } from '../ui/render-game-screen';
import { renderResultOverlay } from '../ui/render-result-overlay';
import type { ThemeOption } from '../ui/render-settings-screen';
import type {
  Player,
  SelectedSettings,
} from './settings-controller';

const FLIP_BACK_DELAY = 900;
const GAME_OVER_DELAY = 650;
const GAME_OVER_DISPLAY_DURATION = 2500;

type Scores = Record<Player, number>;

let firstFlippedCard: HTMLButtonElement | null = null;
let currentPlayer: Player = 'blue';
let currentTheme: ThemeOption = 'code-vibes';
let scores: Scores = createEmptyScores();
let matchedPairs = 0;
let totalPairs = 0;
let isCheckingPair = false;
let flipBackTimer: number | null = null;
let gameOverTimer: number | null = null;
let resultOverlayTimer: number | null = null;

/** Starts a new game with the selected settings. */
export function startGame(
  app: HTMLDivElement,
  settings: SelectedSettings,
): void {
  resetGameState(settings);
  app.innerHTML = renderGameScreen(settings);
}

/** Handles a delegated card-flip action. */
export function handleCardFlip(
  app: HTMLDivElement,
  actionElement: HTMLElement,
): void {
  if (!(actionElement instanceof HTMLButtonElement)) return;
  if (!canFlipCard(actionElement)) return;

  flipCard(app, actionElement);
}

/** Resets all game state and active timers. */
export function resetGame(): void {
  resetGameState();
}

/** Returns the theme used by the current game. */
export function getCurrentTheme(): ThemeOption {
  return currentTheme;
}

/** Reveals a card and resolves a pair when possible. */
function flipCard(
  app: HTMLDivElement,
  card: HTMLButtonElement,
): void {
  revealCard(card);

  if (!firstFlippedCard) {
    firstFlippedCard = card;
    return;
  }

  resolveCardPair(app, firstFlippedCard, card);
}

/** Checks whether the selected card can be flipped. */
function canFlipCard(card: HTMLButtonElement): boolean {
  return (
    !isCheckingPair &&
    card !== firstFlippedCard &&
    !card.classList.contains('is-flipped') &&
    !card.classList.contains('is-matched')
  );
}

/** Reveals a memory card. */
function revealCard(card: HTMLButtonElement): void {
  card.classList.add('is-flipped');
  card.setAttribute('aria-pressed', 'true');
}

/** Resolves the two currently revealed cards. */
function resolveCardPair(
  app: HTMLDivElement,
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  isCheckingPair = true;

  if (cardsMatch(firstCard, secondCard)) {
    handleMatchingPair(app, firstCard, secondCard);
    return;
  }

  scheduleCardsToFlipBack(firstCard, secondCard);
}

/** Checks whether two cards belong to the same pair. */
function cardsMatch(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): boolean {
  return firstCard.dataset.pairId === secondCard.dataset.pairId;
}

/** Handles a matching pair and checks for game completion. */
function handleMatchingPair(
  app: HTMLDivElement,
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  markCardsAsMatched(firstCard, secondCard);
  incrementCurrentPlayerScore();
  matchedPairs += 1;
  resetCardTurn();

  if (matchedPairs === totalPairs) scheduleGameOver(app);
}

/** Marks two matching cards as completed. */
function markCardsAsMatched(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  [firstCard, secondCard].forEach(markCardAsMatched);
}

/** Marks one card as matched and disables it. */
function markCardAsMatched(card: HTMLButtonElement): void {
  card.classList.add('is-matched');
  card.disabled = true;
}

/** Increments and displays the active player's score. */
function incrementCurrentPlayerScore(): void {
  scores[currentPlayer] += 1;

  const scoreElement = getCurrentScoreElement();

  if (!scoreElement) return;

  scoreElement.textContent = String(scores[currentPlayer]);
}

/** Returns the score element for the active player. */
function getCurrentScoreElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `[data-score="${currentPlayer}"]`,
  );
}

/** Schedules mismatched cards to turn face down. */
function scheduleCardsToFlipBack(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  flipBackTimer = window.setTimeout(
    completeMismatch,
    FLIP_BACK_DELAY,
    firstCard,
    secondCard,
  );
}

/** Completes a mismatched turn. */
function completeMismatch(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  hideCard(firstCard);
  hideCard(secondCard);
  flipBackTimer = null;
  switchCurrentPlayer();
  resetCardTurn();
}

/** Hides a revealed card. */
function hideCard(card: HTMLButtonElement): void {
  card.classList.remove('is-flipped');
  card.setAttribute('aria-pressed', 'false');
}

/** Switches the active player after a mismatch. */
function switchCurrentPlayer(): void {
  currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';
  updateCurrentPlayerMarker();
}

/** Updates the current-player marker for the active theme. */
function updateCurrentPlayerMarker(): void {
  const currentMarker = document.querySelector<HTMLElement>(
    '.game-info__current-marker',
  );

  if (!currentMarker) return;

  if (currentMarker instanceof HTMLImageElement) {
    updateImagePlayerMarker(currentMarker);
    return;
  }

  updateGamingPlayerMarker(currentMarker);
}

/** Updates the image-based current-player marker. */
function updateImagePlayerMarker(
  currentMarker: HTMLImageElement,
): void {
  const playerMarker = getPlayerMarkerImage();

  if (!playerMarker) return;

  currentMarker.src = playerMarker.src;
  currentMarker.alt = `${currentPlayer} player`;
}

/** Returns the active player's score marker image. */
function getPlayerMarkerImage(): HTMLImageElement | null {
  return document.querySelector<HTMLImageElement>(
    `.game-info__score--${currentPlayer} .game-info__player-marker`,
  );
}

/** Updates the CSS-based Gaming current-player marker. */
function updateGamingPlayerMarker(
  currentMarker: HTMLElement,
): void {
  currentMarker.dataset.currentPlayer = currentPlayer;
  currentMarker.setAttribute(
    'aria-label',
    `${currentPlayer} player`,
  );
}

/** Schedules the Game Over dialog. */
function scheduleGameOver(app: HTMLDivElement): void {
  gameOverTimer = window.setTimeout(
    openGameOver,
    GAME_OVER_DELAY,
    app,
  );
}

/** Opens the Game Over dialog. */
function openGameOver(app: HTMLDivElement): void {
  gameOverTimer = null;

  if (app.querySelector('.game-over')) return;

  app.insertAdjacentHTML(
    'beforeend',
    renderGameOver(scores, currentTheme),
  );

  showGameOverDialog(app);
}

/** Shows the Game Over dialog and schedules results. */
function showGameOverDialog(app: HTMLDivElement): void {
  const dialog = app.querySelector<HTMLDialogElement>('.game-over');

  if (!dialog) return;

  preventDialogCancellation(dialog);
  dialog.showModal();
  scheduleResultOverlay(app);
}

/** Prevents a dialog from being closed with Escape. */
function preventDialogCancellation(
  dialog: HTMLDialogElement,
): void {
  dialog.addEventListener('cancel', preventDefault);
}

/** Prevents the default behavior of an event. */
function preventDefault(event: Event): void {
  event.preventDefault();
}

/** Schedules the final result overlay. */
function scheduleResultOverlay(app: HTMLDivElement): void {
  resultOverlayTimer = window.setTimeout(
    showResultOverlay,
    GAME_OVER_DISPLAY_DURATION,
    app,
  );
}

/** Replaces Game Over with the final result overlay. */
function showResultOverlay(app: HTMLDivElement): void {
  resultOverlayTimer = null;
  closeGameOver(app);
  openResultOverlay(app);
}

/** Closes and removes the Game Over dialog. */
function closeGameOver(app: HTMLDivElement): void {
  const dialog = app.querySelector<HTMLDialogElement>('.game-over');

  if (!dialog) return;

  dialog.close();
  dialog.remove();
}

/** Opens the final result overlay. */
function openResultOverlay(app: HTMLDivElement): void {
  if (app.querySelector('.result-overlay')) return;

  app.insertAdjacentHTML(
    'beforeend',
    renderResultOverlay(scores, currentTheme),
  );

  showResultDialog(app);
}

/** Shows the final result dialog. */
function showResultDialog(app: HTMLDivElement): void {
  const dialog =
    app.querySelector<HTMLDialogElement>('.result-overlay');

  if (!dialog) return;

  preventDialogCancellation(dialog);
  dialog.showModal();
  focusBackToStartButton(dialog);
}

/** Focuses the result overlay's back button. */
function focusBackToStartButton(
  dialog: HTMLDialogElement,
): void {
  dialog
    .querySelector<HTMLButtonElement>('[data-action="back-to-start"]')
    ?.focus();
}

/** Resets the state of the current card turn. */
function resetCardTurn(): void {
  firstFlippedCard = null;
  isCheckingPair = false;
}

/** Clears every active game timer. */
function resetGameInteraction(): void {
  flipBackTimer = clearTimer(flipBackTimer);
  gameOverTimer = clearTimer(gameOverTimer);
  resultOverlayTimer = clearTimer(resultOverlayTimer);
  resetCardTurn();
}

/** Clears a timer and returns its reset value. */
function clearTimer(timer: number | null): null {
  if (timer !== null) window.clearTimeout(timer);

  return null;
}

/** Resets the complete game state. */
function resetGameState(settings?: SelectedSettings): void {
  resetGameInteraction();
  currentPlayer = settings?.player ?? 'blue';
  currentTheme = settings?.theme ?? 'code-vibes';
  scores = createEmptyScores();
  matchedPairs = 0;
  totalPairs = settings ? settings.boardSize / 2 : 0;
}

/** Creates an empty score record. */
function createEmptyScores(): Scores {
  return {
    blue: 0,
    orange: 0,
  };
}
