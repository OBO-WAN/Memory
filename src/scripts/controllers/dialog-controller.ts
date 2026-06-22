import { renderExitDialog } from '../ui/render-exit-dialog';
import type { ThemeOption } from '../ui/render-settings-screen';

let exitDialogTrigger: HTMLElement | null = null;

/** Opens the exit confirmation dialog. */
export function openExitDialog(
  app: HTMLDivElement,
  trigger: HTMLElement,
  theme: ThemeOption,
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

/** Closes the exit dialog and restores focus. */
export function closeExitDialog(app: HTMLDivElement): void {
  const dialog = app.querySelector<HTMLDialogElement>('.exit-dialog');

  if (!dialog) return;

  dialog.close();
  dialog.remove();
  exitDialogTrigger?.focus();
  exitDialogTrigger = null;
}

/** Clears the stored exit-dialog trigger. */
export function resetExitDialogTrigger(): void {
  exitDialogTrigger = null;
}

/** Configures the exit dialog's closing behavior. */
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

/** Focuses the dialog action that returns to the game. */
function focusSafeAction(dialog: HTMLDialogElement): void {
  dialog
    .querySelector<HTMLButtonElement>(
      '[data-action="close-exit-dialog"]',
    )
    ?.focus();
}
