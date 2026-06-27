import { renderExitDialog } from '../ui/render-exit-dialog';
import type { GameTheme } from '../types/settings.types';

let exitDialogTrigger: HTMLElement | null = null;

/**
 * Inserts and displays the exit dialog, then remembers the triggering control for focus restoration.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 * @param trigger - Element that opened the dialog and should receive restored focus.
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 */
export function openExitDialog(
  app: HTMLDivElement,
  trigger: HTMLElement,
  theme: GameTheme,
): void {
  if (app.querySelector('.exit-dialog')) return;

  exitDialogTrigger = trigger;
  app.insertAdjacentHTML('beforeend', renderExitDialog(theme));

  const dialog = app.querySelector<HTMLDialogElement>('.exit-dialog');

  if (!dialog) return;

  configureExitDialog(app, dialog);
  dialog.showModal();
  focusSafeAction(dialog);
}

/**
 * Removes the exit dialog and returns focus to the control that opened it.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 */
export function closeExitDialog(app: HTMLDivElement): void {
  const dialog = app.querySelector<HTMLDialogElement>('.exit-dialog');

  if (!dialog) return;

  dialog.close();
  dialog.remove();
  exitDialogTrigger?.focus();
  exitDialogTrigger = null;
}

/**
 * Clears the stored exit-dialog trigger when leaving the current view.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 */
export function resetExitDialogTrigger(): void {
  exitDialogTrigger = null;
}

/**
 * Wires dialog cancellation and close actions to the shared close flow.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param app - Root application container whose visible screen or dialog content is updated.
 * @param dialog - Dialog element being configured, focused, or protected from cancellation.
 */
function configureExitDialog(
  app: HTMLDivElement,
  dialog: HTMLDialogElement,
): void {
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeExitDialog(app);
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeExitDialog(app);
  });
}

/**
 * Moves focus to the safe action that keeps the player in the game.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param dialog - Dialog element being configured, focused, or protected from cancellation.
 */
function focusSafeAction(dialog: HTMLDialogElement): void {
  dialog
    .querySelector<HTMLButtonElement>(
      '[data-action="close-exit-dialog"]',
    )
    ?.focus();
}
