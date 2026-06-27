import { renderGameOver } from '../ui/render-game-over';
import { renderGameScreen } from '../ui/render-game-screen';
import { renderResultOverlay } from '../ui/render-result-overlay';
import type { Scores } from '../types/game.types';
import type { GameSettings, GameTheme, PlayerColor } from '../types/settings.types';

const FLIP_BACK_DELAY = 900;
const GAME_OVER_DELAY = 650;
const GAME_OVER_DISPLAY_DURATION = 2500;

let firstFlippedCard: HTMLButtonElement | null = null;
let currentPlayer: PlayerColor = 'blue';
let currentTheme: GameTheme = 'code-vibes';
let scores: Scores = createEmptyScores();
let matchedPairs = 0;
let totalPairs = 0;
let isCheckingPair = false;
let flipBackTimer: number | null = null;
let gameOverTimer: number | null = null;
let resultOverlayTimer: number | null = null;

/**
 * Resets game state and renders a board for the selected settings.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 * @param settings - Selected game settings used to initialize state or render UI.
 */
export function startGame(
  app: HTMLDivElement,
  settings: GameSettings,
): void {
  resetGameState(settings);
  app.innerHTML = renderGameScreen(settings);
}

/**
 * Validates a delegated card button before revealing it.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 * @param actionElement - Clicked element carrying the delegated action metadata to handle.
 */
export function handleCardFlip(
  app: HTMLDivElement,
  actionElement: HTMLElement,
): void {
  if (!(actionElement instanceof HTMLButtonElement)) return;
  if (!canFlipCard(actionElement)) return;

  flipCard(app, actionElement);
}

/**
 * Clears timers, turn state, scores, and theme/player defaults.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 */
export function resetGame(): void {
  resetGameState();
}

/**
 * Returns the theme currently controlling dialogs and markers.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns Theme currently used by game dialogs and markers.
 */
export function getCurrentTheme(): GameTheme {
  return currentTheme;
}

/**
 * Reveals a selected card and compares it once two cards are face up.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 * @param card - Rendered card or card data used to update the board markup or state.
 */
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

/**
 * Reports whether a card is eligible for the current turn.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param card - Rendered card or card data used to update the board markup or state.
 * @returns Whether the supplied value satisfies the documented condition.
 */
function canFlipCard(card: HTMLButtonElement): boolean {
  return (
    !isCheckingPair &&
    card !== firstFlippedCard &&
    !card.classList.contains('is-flipped') &&
    !card.classList.contains('is-matched')
  );
}

/**
 * Marks a card as face up for styling and assistive state.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param card - Rendered card or card data used to update the board markup or state.
 */
function revealCard(card: HTMLButtonElement): void {
  card.classList.add('is-flipped');
  card.setAttribute('aria-pressed', 'true');
}

/**
 * Resolves a completed turn as either a match or delayed mismatch.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 * @param firstCard - First revealed card in the current turn comparison.
 * @param secondCard - Second revealed card in the current turn comparison.
 */
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

/**
 * Compares two rendered cards by their shared pair identifier.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param firstCard - First revealed card in the current turn comparison.
 * @param secondCard - Second revealed card in the current turn comparison.
 * @returns Whether the supplied value satisfies the documented condition.
 */
function cardsMatch(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): boolean {
  return firstCard.dataset.pairId === secondCard.dataset.pairId;
}

/**
 * Scores a matching pair and schedules game completion when all pairs match.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 * @param firstCard - First revealed card in the current turn comparison.
 * @param secondCard - Second revealed card in the current turn comparison.
 */
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

/**
 * Applies matched state to both cards in a successful pair.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param firstCard - First revealed card in the current turn comparison.
 * @param secondCard - Second revealed card in the current turn comparison.
 */
function markCardsAsMatched(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  [firstCard, secondCard].forEach(markCardAsMatched);
}

/**
 * Disables a matched card so it cannot be selected again.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param card - Rendered card or card data used to update the board markup or state.
 */
function markCardAsMatched(card: HTMLButtonElement): void {
  card.classList.add('is-matched');
  card.disabled = true;
}

/**
 * Adds one point for the active player and updates the visible score.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 */
function incrementCurrentPlayerScore(): void {
  scores[currentPlayer] += 1;

  const scoreElement = getCurrentScoreElement();

  if (!scoreElement) return;

  scoreElement.textContent = String(scores[currentPlayer]);
}

/**
 * Finds the score element associated with the active player.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns Matching element, or null when the event target cannot provide one.
 */
function getCurrentScoreElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `[data-score="${currentPlayer}"]`,
  );
}

/**
 * Delays hiding mismatched cards so players can see their selection.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param firstCard - First revealed card in the current turn comparison.
 * @param secondCard - Second revealed card in the current turn comparison.
 */
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

/**
 * Hides mismatched cards, changes turns, and unlocks card selection.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param firstCard - First revealed card in the current turn comparison.
 * @param secondCard - Second revealed card in the current turn comparison.
 */
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

/**
 * Returns a card to its face-down visual and pressed state.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param card - Rendered card or card data used to update the board markup or state.
 */
function hideCard(card: HTMLButtonElement): void {
  card.classList.remove('is-flipped');
  card.setAttribute('aria-pressed', 'false');
}

/**
 * Alternates the active player and refreshes the current-player marker.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 */
function switchCurrentPlayer(): void {
  currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';
  updateCurrentPlayerMarker();
}

/**
 * Refreshes the current-player marker for image and Gaming variants.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 */
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

/**
 * Copies the active player image and alt text into the current marker.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param currentMarker - Current-player marker element that receives the active player state.
 */
function updateImagePlayerMarker(
  currentMarker: HTMLImageElement,
): void {
  const playerMarker = getPlayerMarkerImage();

  if (!playerMarker) return;

  currentMarker.src = playerMarker.src;
  currentMarker.alt = `${currentPlayer} player`;
}

/**
 * Finds the marker image displayed beside the active player score.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns Matching marker image, or null when it is not rendered.
 */
function getPlayerMarkerImage(): HTMLImageElement | null {
  return document.querySelector<HTMLImageElement>(
    `.game-info__score--${currentPlayer} .game-info__player-marker`,
  );
}

/**
 * Updates the Gaming marker dataset and accessible player label.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param currentMarker - Current-player marker element that receives the active player state.
 */
function updateGamingPlayerMarker(
  currentMarker: HTMLElement,
): void {
  currentMarker.dataset.currentPlayer = currentPlayer;
  currentMarker.setAttribute(
    'aria-label',
    `${currentPlayer} player`,
  );
}

/**
 * Delays the Game Over dialog after the final match.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function scheduleGameOver(app: HTMLDivElement): void {
  gameOverTimer = window.setTimeout(
    openGameOver,
    GAME_OVER_DELAY,
    app,
  );
}

/**
 * Inserts the Game Over dialog if absent and starts its display flow.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function openGameOver(app: HTMLDivElement): void {
  gameOverTimer = null;

  if (app.querySelector('.game-over')) return;

  app.insertAdjacentHTML(
    'beforeend',
    renderGameOver(scores, currentTheme),
  );

  showGameOverDialog(app);
}

/**
 * Displays Game Over modally before transitioning to the result overlay.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function showGameOverDialog(app: HTMLDivElement): void {
  const dialog = app.querySelector<HTMLDialogElement>('.game-over');

  if (!dialog) return;

  preventDialogCancellation(dialog);
  dialog.showModal();
  scheduleResultOverlay(app);
}

/**
 * Keeps transient game dialogs open until the scripted transition completes.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param dialog - Dialog element being configured, focused, or protected from cancellation.
 */
function preventDialogCancellation(
  dialog: HTMLDialogElement,
): void {
  dialog.addEventListener('cancel', preventDefault);
}

/**
 * Cancels a dialog event without changing application state.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param event - Browser event whose target or default behavior drives the interaction.
 */
function preventDefault(event: Event): void {
  event.preventDefault();
}

/**
 * Delays the result overlay until the Game Over dialog has been shown.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function scheduleResultOverlay(app: HTMLDivElement): void {
  resultOverlayTimer = window.setTimeout(
    showResultOverlay,
    GAME_OVER_DISPLAY_DURATION,
    app,
  );
}

/**
 * Removes Game Over and opens the final result overlay.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function showResultOverlay(app: HTMLDivElement): void {
  resultOverlayTimer = null;
  closeGameOver(app);
  openResultOverlay(app);
}

/**
 * Closes the transient Game Over dialog and removes it from the DOM.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function closeGameOver(app: HTMLDivElement): void {
  const dialog = app.querySelector<HTMLDialogElement>('.game-over');

  if (!dialog) return;

  dialog.close();
  dialog.remove();
}

/**
 * Inserts the result overlay once and displays the final score outcome.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function openResultOverlay(app: HTMLDivElement): void {
  if (app.querySelector('.result-overlay')) return;

  app.insertAdjacentHTML(
    'beforeend',
    renderResultOverlay(scores, currentTheme),
  );

  showResultDialog(app);
}

/**
 * Displays the result overlay modally and focuses its back button.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function showResultDialog(app: HTMLDivElement): void {
  const dialog =
    app.querySelector<HTMLDialogElement>('.result-overlay');

  if (!dialog) return;

  preventDialogCancellation(dialog);
  dialog.showModal();
  focusBackToStartButton(dialog);
}

/**
 * Moves focus to the result overlay action that returns to start.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param dialog - Dialog element being configured, focused, or protected from cancellation.
 */
function focusBackToStartButton(
  dialog: HTMLDialogElement,
): void {
  dialog
    .querySelector<HTMLButtonElement>('[data-action="back-to-start"]')
    ?.focus();
}

/**
 * Clears the selected card and allows the next turn to proceed.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 */
function resetCardTurn(): void {
  firstFlippedCard = null;
  isCheckingPair = false;
}

/**
 * Cancels pending game timers and resets in-progress card selection.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 */
function resetGameInteraction(): void {
  flipBackTimer = clearTimer(flipBackTimer);
  gameOverTimer = clearTimer(gameOverTimer);
  resultOverlayTimer = clearTimer(resultOverlayTimer);
  resetCardTurn();
}

/**
 * Cancels a pending timer and returns the null state used by timer fields.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param timer - Pending timeout identifier that should be cancelled when present.
 * @returns Always returns null after clearing the stored timer reference.
 */
function clearTimer(timer: number | null): null {
  if (timer !== null) window.clearTimeout(timer);

  return null;
}

/**
 * Reinitializes scores, turn state, theme, player, and pair counts.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param settings - Selected game settings used to initialize state or render UI.
 */
function resetGameState(settings?: GameSettings): void {
  resetGameInteraction();
  currentPlayer = settings?.player ?? 'blue';
  currentTheme = settings?.theme ?? 'code-vibes';
  scores = createEmptyScores();
  matchedPairs = 0;
  totalPairs = settings ? settings.boardSize / 2 : 0;
}

/**
 * Creates a zeroed score record for both players.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns Score record with values for both players.
 */
function createEmptyScores(): Scores {
  return {
    blue: 0,
    orange: 0,
  };
}
