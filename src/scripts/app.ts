import {
  closeExitDialog,
  openExitDialog,
  resetExitDialogTrigger,
} from './controllers/dialog-controller';
import {
  getCurrentTheme,
  handleCardFlip,
  resetGame,
  startGame,
} from './controllers/game-controller';
import {
  getSelectedSettings,
  handleSettingsChange,
  updateSettingsSummary,
} from './controllers/settings-controller';
import { renderSettingsScreen } from './ui/render-settings-screen';
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

type AppAction = (typeof ACTIONS)[keyof typeof ACTIONS];

type ActionHandler = (
  app: HTMLDivElement,
  actionElement: HTMLElement,
) => void;

const APP_ACTIONS = new Set<string>(Object.values(ACTIONS));

const ACTION_HANDLERS: Record<AppAction, ActionHandler> = {
  [ACTIONS.openSettings]: openSettings,
  [ACTIONS.startGame]: startSelectedGame,
  [ACTIONS.flipCard]: flipSelectedCard,
  [ACTIONS.openExitDialog]: showExitDialog,
  [ACTIONS.closeExitDialog]: hideExitDialog,
  [ACTIONS.confirmExit]: confirmExit,
  [ACTIONS.backToStart]: returnToStart,
};

/**
 * Mounts the start screen and registers shared click and settings listeners.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 */
export function initApp(): void {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return;

  renderStartView(app);
  app.addEventListener('click', handleAppClick);
  app.addEventListener('change', handleSettingsChange);
}

/**
 * Shows the start screen after clearing game and dialog state.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function renderStartView(app: HTMLDivElement): void {
  resetGame();
  resetExitDialogTrigger();
  app.innerHTML = renderStartScreen();
}

/**
 * Shows the settings screen and synchronizes the initial summary state.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function renderSettingsView(app: HTMLDivElement): void {
  resetGame();
  resetExitDialogTrigger();
  app.innerHTML = renderSettingsScreen();
  updateSettingsSummary();
}

/**
 * Starts a new game when the settings form has a valid selection.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function renderGameView(app: HTMLDivElement): void {
  const settings = getSelectedSettings();

  if (!settings) return;

  startGame(app, settings);
}

/**
 * Routes delegated app clicks to the action declared on the target element.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param event - Browser event whose target or default behavior drives the interaction.
 */
function handleAppClick(event: MouseEvent): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  const actionElement = getActionElement(event);

  if (!app || !actionElement) return;

  handleAction(app, actionElement);
}

/**
 * Runs the handler registered for the selected action element.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 * @param actionElement - Clicked element carrying the delegated action metadata to handle.
 */
function handleAction(
  app: HTMLDivElement,
  actionElement: HTMLElement,
): void {
  const action = actionElement.dataset.action;

  if (!isAppAction(action)) return;

  ACTION_HANDLERS[action](app, actionElement);
}

/**
 * Narrows a dataset value to a registered application action.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param action - Value used by this declaration to produce its documented behavior.
 * @returns Value produced for the caller according to the documented responsibility.
 */
function isAppAction(
  action: string | undefined,
): action is AppAction {
  return action !== undefined && APP_ACTIONS.has(action);
}

/**
 * Finds the nearest clicked element that declares an app action.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param event - Browser event whose target or default behavior drives the interaction.
 * @returns Matching element, or null when the event target cannot provide one.
 */
function getActionElement(event: MouseEvent): HTMLElement | null {
  const target = event.target;

  if (!(target instanceof Element)) return null;

  return target.closest<HTMLElement>('[data-action]');
}

/**
 * Handles the play button action by opening settings.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function openSettings(app: HTMLDivElement): void {
  renderSettingsView(app);
}

/**
 * Handles the summary start button by launching the selected game.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function startSelectedGame(app: HTMLDivElement): void {
  renderGameView(app);
}

/**
 * Forwards a card-button action to the game controller.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 * @param actionElement - Clicked element carrying the delegated action metadata to handle.
 */
function flipSelectedCard(
  app: HTMLDivElement,
  actionElement: HTMLElement,
): void {
  handleCardFlip(app, actionElement);
}

/**
 * Opens the exit confirmation dialog using the active theme assets.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 * @param actionElement - Clicked element carrying the delegated action metadata to handle.
 */
function showExitDialog(
  app: HTMLDivElement,
  actionElement: HTMLElement,
): void {
  openExitDialog(app, actionElement, getCurrentTheme());
}

/**
 * Closes the exit confirmation dialog and restores focus when possible.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function hideExitDialog(app: HTMLDivElement): void {
  closeExitDialog(app);
}

/**
 * Handles confirmed exit by returning to settings with game state reset.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function confirmExit(app: HTMLDivElement): void {
  renderSettingsView(app);
}

/**
 * Handles the result overlay back action by returning to the start screen.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
function returnToStart(app: HTMLDivElement): void {
  renderStartView(app);
}
