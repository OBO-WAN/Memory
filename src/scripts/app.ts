import { renderStartScreen } from './ui/render-start-screen';
import {
  renderSettingsScreen,
  themePreviewMap,
} from './ui/render-settings-screen';

export function initApp(): void {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return;

  renderStartView(app);
  app.addEventListener('click', handleAppClick);
  app.addEventListener('change', handleAppChange);
}

function renderStartView(app: HTMLDivElement): void {
  app.innerHTML = renderStartScreen();
}

function renderSettingsView(app: HTMLDivElement): void {
  app.innerHTML = renderSettingsScreen();
  updateSettingsSummary();
}

function handleAppClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  const actionElement = target.closest<HTMLElement>('[data-action]');

  if (!actionElement) return;

  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return;

  const action = actionElement.dataset.action;

  if (action === 'open-settings') {
    renderSettingsView(app);
    return;
  }

  if (action === 'start-game') {
    console.log('Start game from settings');
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

  const hasTheme = Boolean(getSelectedInput('theme'));
  const hasPlayer = Boolean(getSelectedInput('player'));
  const hasBoardSize = Boolean(getSelectedInput('boardSize'));

  startButton.disabled = !(hasTheme && hasPlayer && hasBoardSize);
}