import gamingExitTitleUrl from '../../assets/popup/game-theme/Are you sure you want to quit the game_.svg';

import type { ThemeOption } from './render-settings-screen';

export function renderExitDialog(
  theme: ThemeOption = 'code-vibes',
): string {
  const themeClass =
    theme === 'gaming' ? ' exit-dialog--gaming' : '';

  return `
    <dialog
      class="exit-dialog${themeClass}"
      aria-labelledby="exit-dialog-title"
    >
      <section class="exit-dialog__panel">
        ${renderExitDialogTitle(theme)}
        ${renderExitDialogActions(theme)}
      </section>
    </dialog>
  `;
}

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

function renderExitDialogActions(theme: ThemeOption): string {
  const isGaming = theme === 'gaming';
  const backLabel = isGaming ? 'No, back to game' : 'Back to game';
  const exitLabel = isGaming ? 'Yes, quit game' : 'Exit game';

  return `
    <div class="exit-dialog__actions">
      ${renderDialogButton('back', 'close-exit-dialog', backLabel)}
      ${renderDialogButton('confirm', 'confirm-exit', exitLabel)}
    </div>
  `;
}

function renderDialogButton(
  modifier: string,
  action: string,
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
