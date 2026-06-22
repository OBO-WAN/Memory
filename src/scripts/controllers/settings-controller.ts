import { themePreviewMap } from '../ui/render-settings-screen';
import type { ThemeOption } from '../ui/render-settings-screen';

const SETTING_NAMES = {
  theme: 'theme',
  player: 'player',
  boardSize: 'boardSize',
} as const;

type SettingName =
  (typeof SETTING_NAMES)[keyof typeof SETTING_NAMES];

export type Player = 'blue' | 'orange';

export interface SelectedSettings {
  theme: ThemeOption;
  player: Player;
  boardSize: number;
}

/** Handles changes made to the settings form. */
export function handleSettingsChange(event: Event): void {
  const input = getChangedInput(event);

  if (!input) return;

  if (input.name === SETTING_NAMES.theme) {
    updateThemePreview(input);
  }

  updateSettingsSummary();
}

/** Returns the currently selected game settings. */
export function getSelectedSettings(): SelectedSettings | null {
  const theme = getSelectedTheme();
  const player = getSelectedPlayer();
  const boardSize = getSelectedBoardSize();

  if (!theme || !player || boardSize === null) return null;

  return { theme, player, boardSize };
}

/** Updates the visible settings summary and start button. */
export function updateSettingsSummary(): void {
  updateSummaryItem(SETTING_NAMES.theme, getThemeSummary());
  updateSummaryItem(SETTING_NAMES.player, getPlayerSummary());
  updateSummaryItem(SETTING_NAMES.boardSize, getBoardSizeSummary());
  updateStartButtonState();
}

/** Returns the changed input when the event target is valid. */
function getChangedInput(event: Event): HTMLInputElement | null {
  return event.target instanceof HTMLInputElement
    ? event.target
    : null;
}

/** Updates the preview image for the selected theme. */
function updateThemePreview(input: HTMLInputElement): void {
  if (!isThemeOption(input.value)) return;

  const previewImage = document.querySelector<HTMLImageElement>(
    '.settings-screen__preview',
  );
  const selectedPreview = themePreviewMap[input.value];

  if (!previewImage) return;

  previewImage.src = selectedPreview.src;
  previewImage.alt = selectedPreview.alt;
}

/** Updates one item in the settings summary. */
function updateSummaryItem(
  name: SettingName,
  text: string,
): void {
  const summaryItem = document.querySelector<HTMLElement>(
    `[data-summary="${name}"]`,
  );

  if (!summaryItem) return;

  summaryItem.textContent = text;
}

/** Returns the selected theme summary text. */
function getThemeSummary(): string {
  const selectedTheme = getSelectedInput(SETTING_NAMES.theme);

  if (!selectedTheme) return 'Game theme';

  return getSelectedOptionText(selectedTheme);
}

/** Returns the selected player summary text. */
function getPlayerSummary(): string {
  const selectedPlayer = getSelectedInput(SETTING_NAMES.player);

  if (!selectedPlayer) return 'Player';

  return `${getSelectedOptionText(selectedPlayer)} Player`;
}

/** Returns the selected board-size summary text. */
function getBoardSizeSummary(): string {
  const selectedBoardSize = getSelectedInput(
    SETTING_NAMES.boardSize,
  );

  if (!selectedBoardSize) return 'Board size';

  return `Board-${selectedBoardSize.value} Cards`;
}

/** Returns the checked input for the requested setting. */
function getSelectedInput(
  name: SettingName,
): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`,
  );
}

/** Returns the label text belonging to a radio input. */
function getSelectedOptionText(input: HTMLInputElement): string {
  const option = input.closest('.radio-option');
  const optionText = option?.querySelector('.radio-option__text');

  return optionText?.textContent?.trim() ?? '';
}

/** Enables the start button when all settings are valid. */
function updateStartButtonState(): void {
  const startButton = document.querySelector<HTMLButtonElement>(
    '.settings-summary__start',
  );

  if (!startButton) return;

  startButton.disabled = !getSelectedSettings();
}

/** Returns the selected theme when its value is valid. */
function getSelectedTheme(): ThemeOption | null {
  const value = getSelectedInput(SETTING_NAMES.theme)?.value;

  return value && isThemeOption(value) ? value : null;
}

/** Returns the selected player when its value is valid. */
function getSelectedPlayer(): Player | null {
  const value = getSelectedInput(SETTING_NAMES.player)?.value;

  return value && isPlayer(value) ? value : null;
}

/** Returns the selected board size when it is valid. */
function getSelectedBoardSize(): number | null {
  const value = getSelectedInput(SETTING_NAMES.boardSize)?.value;
  const boardSize = Number(value);

  return Number.isInteger(boardSize) && boardSize > 0
    ? boardSize
    : null;
}

/** Checks whether a value is a supported theme. */
function isThemeOption(value: string): value is ThemeOption {
  return value in themePreviewMap;
}

/** Checks whether a value is a supported player. */
function isPlayer(value: string): value is Player {
  return value === 'blue' || value === 'orange';
}
