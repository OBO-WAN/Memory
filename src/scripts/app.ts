import { renderGameScreen } from './ui/render-game-screen';
import { renderSettingsScreen, themePreviewMap } from './ui/render-settings-screen';
import type { ThemeOption } from './ui/render-settings-screen';
import { renderStartScreen } from './ui/render-start-screen';

const SETTINGS_ACTION = 'open-settings';
const START_GAME_ACTION = 'start-game';

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

function renderGameView(app: HTMLDivElement): void {
  const settings = getSelectedSettings();

  if (!settings) return;

  app.innerHTML = renderGameScreen(settings);
}

function handleAppClick(event: MouseEvent): void {
  const actionElement = getActionElement(event);

  if (!actionElement) return;

  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return;

  const action = actionElement.dataset.action;

  if (action === SETTINGS_ACTION) {
    renderSettingsView(app);
    return;
  }

  if (action === START_GAME_ACTION) {
    renderGameView(app);
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

function getSelectedSettings():
  | { theme: ThemeOption; player: string; boardSize: number }
  | null {
  const theme = getSelectedInput('theme')?.value as ThemeOption | undefined;
  const player = getSelectedInput('player')?.value;
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
