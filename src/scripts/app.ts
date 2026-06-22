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

/** Initializes the application and delegated event listeners. */
export function initApp(): void {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return;

  renderStartView(app);
  app.addEventListener('click', handleAppClick);
  app.addEventListener('change', handleSettingsChange);
}

/** Renders the start screen and clears game state. */
function renderStartView(app: HTMLDivElement): void {
  resetGame();
  resetExitDialogTrigger();
  app.innerHTML = renderStartScreen();
}

/** Renders the settings screen and refreshes its summary. */
function renderSettingsView(app: HTMLDivElement): void {
  resetGame();
  resetExitDialogTrigger();
  app.innerHTML = renderSettingsScreen();
  updateSettingsSummary();
}

/** Starts a game with the currently selected settings. */
function renderGameView(app: HTMLDivElement): void {
  const settings = getSelectedSettings();

  if (!settings) return;

  startGame(app, settings);
}

/** Routes delegated clicks to the matching action handler. */
function handleAppClick(event: MouseEvent): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  const actionElement = getActionElement(event);

  if (!app || !actionElement) return;

  handleAction(app, actionElement);
}

/** Executes an action registered for the selected element. */
function handleAction(
  app: HTMLDivElement,
  actionElement: HTMLElement,
): void {
  const action = actionElement.dataset.action;

  if (!isAppAction(action)) return;

  ACTION_HANDLERS[action](app, actionElement);
}

/** Checks whether a value is a registered application action. */
function isAppAction(
  action: string | undefined,
): action is AppAction {
  return action !== undefined && APP_ACTIONS.has(action);
}

/** Returns the closest element containing an application action. */
function getActionElement(event: MouseEvent): HTMLElement | null {
  const target = event.target;

  if (!(target instanceof Element)) return null;

  return target.closest<HTMLElement>('[data-action]');
}

/** Opens the settings screen. */
function openSettings(app: HTMLDivElement): void {
  renderSettingsView(app);
}

/** Starts the game selected in the settings form. */
function startSelectedGame(app: HTMLDivElement): void {
  renderGameView(app);
}

/** Delegates a selected card to the game controller. */
function flipSelectedCard(
  app: HTMLDivElement,
  actionElement: HTMLElement,
): void {
  handleCardFlip(app, actionElement);
}

/** Opens the current theme's exit confirmation dialog. */
function showExitDialog(
  app: HTMLDivElement,
  actionElement: HTMLElement,
): void {
  openExitDialog(app, actionElement, getCurrentTheme());
}

/** Closes the exit confirmation dialog. */
function hideExitDialog(app: HTMLDivElement): void {
  closeExitDialog(app);
}

/** Confirms exiting the game and returns to settings. */
function confirmExit(app: HTMLDivElement): void {
  renderSettingsView(app);
}

/** Returns from the result overlay to the start screen. */
function returnToStart(app: HTMLDivElement): void {
  renderStartView(app);
}
