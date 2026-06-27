import { DEFAULT_THEME, themePreviewMap } from '../ui/render-settings-screen';
import type { GameSettings } from '../types/settings.interface';
import type {
  BoardSize,
  GameTheme,
  PlayerColor,
} from '../types/settings.types';

import { SETTING_NAMES } from '../constants/settings.constants';
import type { SettingName } from '../constants/settings.constants';


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
 * Temporarily previews a theme while a pointer hovers a theme radio option.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param event - Pointer event whose target determines the theme option being previewed.
 */
export function handleThemePreviewPointerOver(
  event: PointerEvent,
): void {
  if (event.pointerType === 'touch') return;

  const option = getThemePreviewOption(event.target);

  if (!option || isMovingWithinOption(option, event.relatedTarget)) {
    return;
  }

  const input = getThemeInputFromOption(option);

  if (!input || !isGameTheme(input.value)) return;

  applyThemePreview(input.value);
}

/**
 * Restores the selected or default theme preview after pointer hover ends.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param event - Pointer event whose target determines whether hover truly left the option.
 */
export function handleThemePreviewPointerOut(
  event: PointerEvent,
): void {
  if (event.pointerType === 'touch') return;

  const option = getThemePreviewOption(event.target);

  if (!option || isMovingWithinGameThemes(option, event.relatedTarget)) {
    return;
  }

  restoreSelectedThemePreview();
}

/**
 * Temporarily previews a theme when keyboard focus enters a theme radio option.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param event - Focus event whose target determines the theme option being previewed.
 */
export function handleThemePreviewFocusIn(event: FocusEvent): void {
  const option = getThemePreviewOption(event.target);
  const input = option ? getThemeInputFromOption(option) : null;

  if (!input || !isGameTheme(input.value)) return;

  applyThemePreview(input.value);
}

/**
 * Restores the selected or default theme preview after keyboard focus leaves a theme option.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param event - Focus event whose target determines whether focus truly left the option.
 */
export function handleThemePreviewFocusOut(event: FocusEvent): void {
  const option = getThemePreviewOption(event.target);

  if (!option || isMovingWithinGameThemes(option, event.relatedTarget)) {
    return;
  }

  restoreSelectedThemePreview();
}

/**
 * Collects valid settings selections for starting a game.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns Validated settings object, or null until the form is complete.
 */
export function getSelectedSettings(): GameSettings | null {
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
  if (!isGameTheme(input.value)) return;

  applyThemePreview(input.value);
}

/**
 * Applies the configured image source and alt text for a theme preview.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param theme - Theme option whose configured preview image is shown.
 */
function applyThemePreview(theme: GameTheme): void {
  const previewImage = document.querySelector<HTMLImageElement>(
    '.settings-screen__preview',
  );
  const selectedPreview = themePreviewMap[theme];

  if (!previewImage) return;

  previewImage.src = selectedPreview.src;
  previewImage.alt = selectedPreview.alt;
}

/**
 * Restores the preview for the checked theme or the default theme when none is selected.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 */
function restoreSelectedThemePreview(): void {
  applyThemePreview(getSelectedTheme() ?? DEFAULT_THEME);
}

/**
 * Finds a radio option from a delegated preview event target.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param target - Event target used to find the nearest radio option.
 * @returns Matching radio option, or null when the target is outside one.
 */
function getThemePreviewOption(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;

  return target.closest<HTMLElement>('.radio-option');
}

/**
 * Finds the theme radio input contained by a radio option.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param option - Radio option that may contain a theme input.
 * @returns Theme radio input, or null when the option is not for theme selection.
 */
function getThemeInputFromOption(option: HTMLElement): HTMLInputElement | null {
  return option.querySelector<HTMLInputElement>('input[name="theme"]');
}

/**
 * Detects delegated pointer or focus movement that remains inside one option.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param option - Radio option currently handling a delegated preview event.
 * @param relatedTarget - Element receiving pointer or focus after the current event.
 * @returns Whether the event represents movement within the same option.
 */
function isMovingWithinOption(
  option: HTMLElement,
  relatedTarget: EventTarget | null,
): boolean {
  return relatedTarget instanceof Node && option.contains(relatedTarget);
}

/**
 * Detects delegated pointer or focus movement that remains inside the same theme options container.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param option - Theme radio option currently handling a delegated preview exit event.
 * @param relatedTarget - Element receiving pointer or focus after the current event.
 * @returns Whether the event remains inside the same complete theme-options container.
 */
function isMovingWithinGameThemes(
  option: HTMLElement,
  relatedTarget: EventTarget | null,
): boolean {
  const options = option.closest<HTMLElement>('.settings-group__options');

  return (
    relatedTarget instanceof Node &&
    options !== null &&
    options.contains(relatedTarget)
  );
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
function getSelectedTheme(): GameTheme | null {
  const value = getSelectedInput(SETTING_NAMES.theme)?.value;

  return value && isGameTheme(value) ? value : null;
}

/**
 * Validates and returns the selected starting player.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns Selected player, or null when the current value is unsupported.
 */
function getSelectedPlayer(): PlayerColor | null {
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
function getSelectedBoardSize(): BoardSize | null {
  const value = getSelectedInput(SETTING_NAMES.boardSize)?.value;
  const boardSize = Number(value);

  return isBoardSize(boardSize) ? boardSize : null;
}

/**
 * Narrows a string to a theme with configured preview assets.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param value - String value being validated or formatted for display.
 * @returns Value produced for the caller according to the documented responsibility.
 */
function isGameTheme(value: string): value is GameTheme {
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
function isPlayer(value: string): value is PlayerColor {
  return value === 'blue' || value === 'orange';
}

/**
 * Narrows a number to one of the supported board sizes.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param value - Number value being validated or formatted for display.
 * @returns Whether the supplied value satisfies the documented condition.
 */
function isBoardSize(value: number): value is BoardSize {
  return value === 16 || value === 24 || value === 36;
}
