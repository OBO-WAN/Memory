import { renderExitDialog } from './ui/render-exit-dialog';
import { renderGameOver } from './ui/render-game-over';
import { renderGameScreen } from './ui/render-game-screen';
import { renderResultOverlay } from './ui/render-result-overlay';
import {
  renderSettingsScreen,
  themePreviewMap,
} from './ui/render-settings-screen';
import type { ThemeOption } from './ui/render-settings-screen';
import { renderStartScreen } from './ui/render-start-screen';

const ACTIONS = {
  openSettings: 'open-settings',
  startGame: 'start-game',
  flipCard: 'flip-card',
  openExitDialog: 'open-exit-dialog',
  closeExitDialog: 'close-exit-dialog',
  confirmExit: 'confirm-exit',
  backToStart: 'back-to-start',
} as const;

const FLIP_BACK_DELAY = 900;
const GAME_OVER_DELAY = 650;
const GAME_OVER_DISPLAY_DURATION = 2500;

type Player = 'blue' | 'orange';

interface SelectedSettings {
  theme: ThemeOption;
  player: Player;
  boardSize: number;
}

type Scores = Record<Player, number>;

let exitDialogTrigger: HTMLElement | null = null;
let firstFlippedCard: HTMLButtonElement | null = null;
let currentPlayer: Player = 'blue';
let scores: Scores = createEmptyScores();
let matchedPairs = 0;
let totalPairs = 0;
let isCheckingPair = false;
let flipBackTimer: number | null = null;
let gameOverTimer: number | null = null;
let resultOverlayTimer: number | null = null;

export function initApp(): void {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return;

  renderStartView(app);
  app.addEventListener('click', handleAppClick);
  app.addEventListener('change', handleAppChange);
}

function renderStartView(app: HTMLDivElement): void {
  resetGameState();
  app.innerHTML = renderStartScreen();
}

function renderSettingsView(app: HTMLDivElement): void {
  resetGameState();
  exitDialogTrigger = null;
  app.innerHTML = renderSettingsScreen();
  updateSettingsSummary();
}

function renderGameView(app: HTMLDivElement): void {
  const settings = getSelectedSettings();

  if (!settings) return;

  resetGameState(settings);
  app.innerHTML = renderGameScreen(settings);
}

function handleAppClick(event: MouseEvent): void {
  const actionElement = getActionElement(event);
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!actionElement || !app) return;

  switch (actionElement.dataset.action) {
    case ACTIONS.openSettings:
      renderSettingsView(app);
      break;

    case ACTIONS.startGame:
      renderGameView(app);
      break;

    case ACTIONS.flipCard:
      flipCard(app, actionElement);
      break;

    case ACTIONS.openExitDialog:
      openExitDialog(app, actionElement);
      break;

    case ACTIONS.closeExitDialog:
      closeExitDialog(app);
      break;

    case ACTIONS.confirmExit:
      renderSettingsView(app);
      break;

    case ACTIONS.backToStart:
      renderStartView(app);
      break;
  }
}

function handleAppChange(event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return;

  const input = event.target;

  if (input.name === 'theme') {
    updateThemePreview(input);
  }

  updateSettingsSummary();
}

function getActionElement(event: MouseEvent): HTMLElement | null {
  const target = event.target;

  if (!(target instanceof HTMLElement)) return null;

  return target.closest<HTMLElement>('[data-action]');
}

function flipCard(
  app: HTMLDivElement,
  actionElement: HTMLElement,
): void {
  if (!(actionElement instanceof HTMLButtonElement)) return;
  if (!canFlipCard(actionElement)) return;

  revealCard(actionElement);

  if (!firstFlippedCard) {
    firstFlippedCard = actionElement;
    return;
  }

  resolveCardPair(app, firstFlippedCard, actionElement);
}

function canFlipCard(card: HTMLButtonElement): boolean {
  return (
    !isCheckingPair &&
    card !== firstFlippedCard &&
    !card.classList.contains('is-flipped') &&
    !card.classList.contains('is-matched')
  );
}

function revealCard(card: HTMLButtonElement): void {
  card.classList.add('is-flipped');
  card.setAttribute('aria-pressed', 'true');
}

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

function cardsMatch(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): boolean {
  return firstCard.dataset.pairId === secondCard.dataset.pairId;
}

function handleMatchingPair(
  app: HTMLDivElement,
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  markCardsAsMatched(firstCard, secondCard);
  incrementCurrentPlayerScore();
  matchedPairs += 1;
  resetCardTurn();

  if (matchedPairs === totalPairs) {
    scheduleGameOver(app);
  }
}

function markCardsAsMatched(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  [firstCard, secondCard].forEach((card) => {
    card.classList.add('is-matched');
    card.disabled = true;
  });
}

function incrementCurrentPlayerScore(): void {
  scores[currentPlayer] += 1;

  const scoreElement = document.querySelector<HTMLElement>(
    `[data-score="${currentPlayer}"]`,
  );

  if (!scoreElement) return;

  scoreElement.textContent = String(scores[currentPlayer]);
}

function scheduleCardsToFlipBack(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  flipBackTimer = window.setTimeout(() => {
    hideCard(firstCard);
    hideCard(secondCard);
    flipBackTimer = null;
    switchCurrentPlayer();
    resetCardTurn();
  }, FLIP_BACK_DELAY);
}

function hideCard(card: HTMLButtonElement): void {
  card.classList.remove('is-flipped');
  card.setAttribute('aria-pressed', 'false');
}

function switchCurrentPlayer(): void {
  currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';
  updateCurrentPlayerMarker();
}

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

function updateImagePlayerMarker(
  currentMarker: HTMLImageElement,
): void {
  const playerMarker = document.querySelector<HTMLImageElement>(
    `.game-info__score--${currentPlayer} .game-info__player-marker`,
  );

  if (!playerMarker) return;

  currentMarker.src = playerMarker.src;
  currentMarker.alt = `${currentPlayer} player`;
}

function updateGamingPlayerMarker(
  currentMarker: HTMLElement,
): void {
  currentMarker.dataset.currentPlayer = currentPlayer;
  currentMarker.setAttribute(
    'aria-label',
    `${currentPlayer} player`,
  );
}

function scheduleGameOver(app: HTMLDivElement): void {
  gameOverTimer = window.setTimeout(() => {
    gameOverTimer = null;
    openGameOver(app);
  }, GAME_OVER_DELAY);
}

function openGameOver(app: HTMLDivElement): void {
  if (app.querySelector('.game-over')) return;

  app.insertAdjacentHTML('beforeend', renderGameOver(scores));

  const dialog = app.querySelector<HTMLDialogElement>('.game-over');

  if (!dialog) return;

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
  });

  dialog.showModal();
  scheduleResultOverlay(app);
}

function scheduleResultOverlay(app: HTMLDivElement): void {
  resultOverlayTimer = window.setTimeout(() => {
    resultOverlayTimer = null;
    closeGameOver(app);
    openResultOverlay(app);
  }, GAME_OVER_DISPLAY_DURATION);
}

function closeGameOver(app: HTMLDivElement): void {
  const dialog = app.querySelector<HTMLDialogElement>('.game-over');

  if (!dialog) return;

  dialog.close();
  dialog.remove();
}

function openResultOverlay(app: HTMLDivElement): void {
  if (app.querySelector('.result-overlay')) return;

  app.insertAdjacentHTML('beforeend', renderResultOverlay(scores));

  const dialog =
    app.querySelector<HTMLDialogElement>('.result-overlay');

  if (!dialog) return;

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
  });

  dialog.showModal();

  dialog
    .querySelector<HTMLButtonElement>('[data-action="back-to-start"]')
    ?.focus();
}

function resetCardTurn(): void {
  firstFlippedCard = null;
  isCheckingPair = false;
}

function resetGameInteraction(): void {
  if (flipBackTimer !== null) {
    window.clearTimeout(flipBackTimer);
    flipBackTimer = null;
  }

  if (gameOverTimer !== null) {
    window.clearTimeout(gameOverTimer);
    gameOverTimer = null;
  }

  if (resultOverlayTimer !== null) {
    window.clearTimeout(resultOverlayTimer);
    resultOverlayTimer = null;
  }

  resetCardTurn();
}

function resetGameState(settings?: SelectedSettings): void {
  resetGameInteraction();
  currentPlayer = settings?.player ?? 'blue';
  scores = createEmptyScores();
  matchedPairs = 0;
  totalPairs = settings ? settings.boardSize / 2 : 0;
}

function createEmptyScores(): Scores {
  return {
    blue: 0,
    orange: 0,
  };
}

function openExitDialog(
  app: HTMLDivElement,
  trigger: HTMLElement,
): void {
  if (app.querySelector('.exit-dialog')) return;

  exitDialogTrigger = trigger;
  app.insertAdjacentHTML('beforeend', renderExitDialog());

  const dialog = app.querySelector<HTMLDialogElement>('.exit-dialog');

  if (!dialog) return;

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeExitDialog(app);
  });

  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;

    closeExitDialog(app);
  });

  dialog.showModal();

  dialog
    .querySelector<HTMLButtonElement>(
      '[data-action="close-exit-dialog"]',
    )
    ?.focus();
}

function closeExitDialog(app: HTMLDivElement): void {
  const dialog = app.querySelector<HTMLDialogElement>('.exit-dialog');

  if (!dialog) return;

  dialog.close();
  dialog.remove();
  exitDialogTrigger?.focus();
  exitDialogTrigger = null;
}

function getSelectedSettings(): SelectedSettings | null {
  const theme = getSelectedInput('theme')?.value as
    | ThemeOption
    | undefined;
  const player = getSelectedInput('player')?.value as
    | Player
    | undefined;
  const boardSize = Number(getSelectedInput('boardSize')?.value);

  if (!theme || !player || !boardSize) return null;

  return {
    theme,
    player,
    boardSize,
  };
}

function updateThemePreview(input: HTMLInputElement): void {
  const selectedPreview =
    themePreviewMap[input.value as keyof typeof themePreviewMap];

  if (!selectedPreview) return;

  const previewImage = document.querySelector<HTMLImageElement>(
    '.settings-screen__preview',
  );

  if (!previewImage) return;

  previewImage.src = selectedPreview.src;
  previewImage.alt = selectedPreview.alt;
}

function updateSettingsSummary(): void {
  updateSummaryItem('theme', getThemeSummary());
  updateSummaryItem('player', getPlayerSummary());
  updateSummaryItem('boardSize', getBoardSizeSummary());
  updateStartButtonState();
}

function updateSummaryItem(name: string, text: string): void {
  const summaryItem = document.querySelector<HTMLElement>(
    `[data-summary="${name}"]`,
  );

  if (!summaryItem) return;

  summaryItem.textContent = text;
}

function getThemeSummary(): string {
  const selectedTheme = getSelectedInput('theme');

  if (!selectedTheme) return 'Game theme';

  return getSelectedOptionText(selectedTheme);
}

function getPlayerSummary(): string {
  const selectedPlayer = getSelectedInput('player');

  if (!selectedPlayer) return 'Player';

  return `${getSelectedOptionText(selectedPlayer)} Player`;
}

function getBoardSizeSummary(): string {
  const selectedBoardSize = getSelectedInput('boardSize');

  if (!selectedBoardSize) return 'Board size';

  return `Board-${selectedBoardSize.value} Cards`;
}

function getSelectedInput(name: string): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`,
  );
}

function getSelectedOptionText(input: HTMLInputElement): string {
  const option = input.closest('.radio-option');
  const optionText = option?.querySelector('.radio-option__text');

  return optionText?.textContent?.trim() ?? '';
}

function updateStartButtonState(): void {
  const startButton = document.querySelector<HTMLButtonElement>(
    '.settings-summary__start',
  );

  if (!startButton) return;

  startButton.disabled = !getSelectedSettings();
}
