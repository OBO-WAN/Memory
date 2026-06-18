import { renderExitDialog } from './ui/render-exit-dialog';
import { renderGameScreen } from './ui/render-game-screen';
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
} as const;

const FLIP_BACK_DELAY = 900;

type Player = 'blue' | 'orange';

interface SelectedSettings {
  theme: ThemeOption;
  player: Player;
  boardSize: number;
}

let exitDialogTrigger: HTMLElement | null = null;
let firstFlippedCard: HTMLButtonElement | null = null;
let isCheckingPair = false;
let flipBackTimer: number | null = null;
let selectedPlayer: Player = 'blue';
let score = 0;

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

  resetGameState(settings.player);
  app.innerHTML = renderGameScreen(settings);
}

function handleAppClick(event: MouseEvent): void {
  const actionElement = getActionElement(event);
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!actionElement || !app) return;

  const action = actionElement.dataset.action;

  switch (action) {
    case ACTIONS.openSettings:
      renderSettingsView(app);
      break;

    case ACTIONS.startGame:
      renderGameView(app);
      break;

    case ACTIONS.flipCard:
      flipCard(actionElement);
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

function flipCard(actionElement: HTMLElement): void {
  if (!(actionElement instanceof HTMLButtonElement)) return;
  if (!canFlipCard(actionElement)) return;

  revealCard(actionElement);

  if (!firstFlippedCard) {
    firstFlippedCard = actionElement;
    return;
  }

  resolveCardPair(firstFlippedCard, actionElement);
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
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  isCheckingPair = true;

  if (cardsMatch(firstCard, secondCard)) {
    markCardsAsMatched(firstCard, secondCard);
    incrementSelectedPlayerScore();
    resetCardTurn();
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

function markCardsAsMatched(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  [firstCard, secondCard].forEach((card) => {
    card.classList.add('is-matched');
    card.disabled = true;
  });
}

function scheduleCardsToFlipBack(
  firstCard: HTMLButtonElement,
  secondCard: HTMLButtonElement,
): void {
  flipBackTimer = window.setTimeout(() => {
    hideCard(firstCard);
    hideCard(secondCard);
    flipBackTimer = null;
    resetCardTurn();
  }, FLIP_BACK_DELAY);
}

function hideCard(card: HTMLButtonElement): void {
  card.classList.remove('is-flipped');
  card.setAttribute('aria-pressed', 'false');
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

  resetCardTurn();
}

function resetGameState(player: Player = 'blue'): void {
  resetGameInteraction();
  selectedPlayer = player;
  score = 0;
}

function incrementSelectedPlayerScore(): void {
  score += 1;

  const scoreElement = document.querySelector<HTMLElement>(
    `[data-score="${selectedPlayer}"]`,
  );

  if (!scoreElement) return;

  scoreElement.textContent = String(score);
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
  const player = getSelectedInput('player')?.value as Player | undefined;
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
