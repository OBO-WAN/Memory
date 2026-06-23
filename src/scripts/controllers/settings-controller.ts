import { themePreviewMap } from '../ui/render-settings-screen';
import type { ThemeOption } from '../ui/render-settings-screen';

const SETTING_NAMES = {
  theme: 'theme',
  player: 'player',
  boardSize: 'boardSize',
} as const;

/**
 * Names used by settings radio groups and summary slots.
 *
 * This keeps supported values explicit wherever the option is passed between modules.
 */
type SettingName =
  (typeof SETTING_NAMES)[keyof typeof SETTING_NAMES];

/**
 * Player colors supported by score and turn state.
 *
 * This keeps supported values explicit wherever the option is passed between modules.
 */
export type Player = 'blue' | 'orange';

/**
 * Valid settings collected from the form before starting a game.
 *
 * Consumers rely on these fields to keep shared data shapes consistent across modules.
 */
export interface SelectedSettings {
  theme: ThemeOption;
  player: Player;
  boardSize: number;
}

/**
 * Responds to settings form changes and refreshes dependent UI.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param event - Browser event whose target or default behavior drives the interaction.
 */
export function handleSettingsChange(event: Event): void {
  const input = getChangedInput(event);

  if (!input) return;

  if (input.name === SETTING_NAMES.theme) {
    updateThemePreview(input);
  }

  updateSettingsSummary();
}

/**
 * Collects valid settings selections for starting a game.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns Validated settings object, or null until the form is complete.
 */
export function getSelectedSettings(): SelectedSettings | null {
  const theme = getSelectedTheme();
  const player = getSelectedPlayer();
  const boardSize = getSelectedBoardSize();

  if (!theme || !player || boardSize === null) return null;

  return { theme, player, boardSize };
}

/**
 * Updates the summary text and enables start only when selections are valid.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 */
export function updateSettingsSummary(): void {
  updateSummaryItem(SETTING_NAMES.theme, getThemeSummary());
  updateSummaryItem(SETTING_NAMES.player, getPlayerSummary());
  updateSummaryItem(SETTING_NAMES.boardSize, getBoardSizeSummary());
  updateStartButtonState();
}

/**
 * Extracts a radio input from a settings change event.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param event - Browser event whose target or default behavior drives the interaction.
 * @returns Selected input element, or null when no valid selection is present.
 */
function getChangedInput(event: Event): HTMLInputElement | null {
  return event.target instanceof HTMLInputElement
    ? event.target
    : null;
}

/**
 * Swaps the preview image and alt text for a selected theme option.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param input - Radio input whose selected value or label updates the settings UI.
 */
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

/**
 * Writes one selected setting label into the summary panel.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param name - Settings group or action name used to locate related DOM or summary content.
 * @param text - Summary text written into the visible settings panel.
 */
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

/**
 * Builds the theme label shown in the settings summary.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns HTML markup or display text consumed by the caller.
 */
function getThemeSummary(): string {
  const selectedTheme = getSelectedInput(SETTING_NAMES.theme);

  if (!selectedTheme) return 'Game theme';

  return getSelectedOptionText(selectedTheme);
}

/**
 * Builds the starting-player label shown in the settings summary.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns HTML markup or display text consumed by the caller.
 */
function getPlayerSummary(): string {
  const selectedPlayer = getSelectedInput(SETTING_NAMES.player);

  if (!selectedPlayer) return 'Player';

  return `${getSelectedOptionText(selectedPlayer)} Player`;
}

/**
 * Builds the board-size label shown in the settings summary.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns HTML markup or display text consumed by the caller.
 */
function getBoardSizeSummary(): string {
  const selectedBoardSize = getSelectedInput(
    SETTING_NAMES.boardSize,
  );

  if (!selectedBoardSize) return 'Board size';

  return `Board-${selectedBoardSize.value} Cards`;
}

/**
 * Finds the checked radio input for a settings group.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param name - Settings group or action name used to locate related DOM or summary content.
 * @returns Selected input element, or null when no valid selection is present.
 */
function getSelectedInput(
  name: SettingName,
): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(
    `input[name="${name}"]:checked`,
  );
}

/**
 * Reads the visible label text associated with a radio option.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param input - Radio input whose selected value or label updates the settings UI.
 * @returns HTML markup or display text consumed by the caller.
 */
function getSelectedOptionText(input: HTMLInputElement): string {
  const option = input.closest('.radio-option');
  const optionText = option?.querySelector('.radio-option__text');

  return optionText?.textContent?.trim() ?? '';
}

/**
 * Toggles the start button based on whether all selections are valid.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 */
function updateStartButtonState(): void {
  const startButton = document.querySelector<HTMLButtonElement>(
    '.settings-summary__start',
  );

  if (!startButton) return;

  startButton.disabled = !getSelectedSettings();
}

/**
 * Validates and returns the selected theme option.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns Selected theme, or null when the current value is unsupported.
 */
function getSelectedTheme(): ThemeOption | null {
  const value = getSelectedInput(SETTING_NAMES.theme)?.value;

  return value && isThemeOption(value) ? value : null;
}

/**
 * Validates and returns the selected starting player.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns Selected player, or null when the current value is unsupported.
 */
function getSelectedPlayer(): Player | null {
  const value = getSelectedInput(SETTING_NAMES.player)?.value;

  return value && isPlayer(value) ? value : null;
}

/**
 * Parses and returns the selected positive board size.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns Parsed board size, or null when the selection is missing or invalid.
 */
function getSelectedBoardSize(): number | null {
  const value = getSelectedInput(SETTING_NAMES.boardSize)?.value;
  const boardSize = Number(value);

  return Number.isInteger(boardSize) && boardSize > 0
    ? boardSize
    : null;
}

/**
 * Narrows a string to a theme with configured preview assets.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param value - String value being validated or formatted for display.
 * @returns Value produced for the caller according to the documented responsibility.
 */
function isThemeOption(value: string): value is ThemeOption {
  return value in themePreviewMap;
}

/**
 * Narrows a string to one of the supported player colors.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param value - String value being validated or formatted for display.
 * @returns Value produced for the caller according to the documented responsibility.
 */
function isPlayer(value: string): value is Player {
  return value === 'blue' || value === 'orange';
}
