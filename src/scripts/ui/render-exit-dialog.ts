import gamingExitTitleUrl from '../../assets/popup/game-theme/Are you sure you want to quit the game_.svg';

import type { ThemeOption } from './render-settings-screen';

type DialogButtonModifier = 'back' | 'confirm';
type DialogAction = 'close-exit-dialog' | 'confirm-exit';

/** Renders the exit confirmation dialog for the selected theme. */
export function renderExitDialog(
  theme: ThemeOption = 'code-vibes',
): string {
  return `
    <dialog
      class="exit-dialog${getThemeClass(theme)}"
      aria-labelledby="exit-dialog-title"
    >
      <section class="exit-dialog__panel">
        ${renderExitDialogTitle(theme)}
        ${renderExitDialogActions(theme)}
      </section>
    </dialog>
  `;
}

/** Returns the theme modifier used by the dialog. */
function getThemeClass(theme: ThemeOption): string {
  return theme === 'gaming' ? ' exit-dialog--gaming' : '';
}

/** Renders the dialog title for the selected theme. */
function renderExitDialogTitle(theme: ThemeOption): string {
  if (theme === 'gaming') {
    return `
      <h2 id="exit-dialog-title" class="exit-dialog__title">
        <img
          class="exit-dialog__title-image"
          src="${gamingExitTitleUrl}"
          alt="Are you sure you want to quit the game?"
        />
      </h2>
    `;
  }

  return `
    <h2 id="exit-dialog-title" class="exit-dialog__title">
      Are you sure you want to quit<br />
      the game?
    </h2>
  `;
}

/** Renders both exit-dialog action buttons. */
function renderExitDialogActions(theme: ThemeOption): string {
  const isGaming = theme === 'gaming';
  const backLabel = isGaming ? 'No, back to game' : 'Back to game';
  const exitLabel = isGaming ? 'Yes, quit game' : 'Exit game';

  return `
    <div class="exit-dialog__actions">
      ${renderDialogButton(
        'back',
        'close-exit-dialog',
        backLabel,
      )}
      ${renderDialogButton(
        'confirm',
        'confirm-exit',
        exitLabel,
      )}
    </div>
  `;
}

/** Renders one exit-dialog action button. */
function renderDialogButton(
  modifier: DialogButtonModifier,
  action: DialogAction,
  label: string,
): string {
  return `
    <button
      class="exit-dialog__button exit-dialog__button--${modifier}"
      type="button"
      data-action="${action}"
    >
      ${label}
    </button>
  `;
}
