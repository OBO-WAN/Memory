import gamingExitTitleUrl from '../../assets/popup/game-theme/Are you sure you want to quit the game_.svg';

import type { ThemeOption } from './render-settings-screen';

type DialogButtonModifier = 'back' | 'confirm';
type DialogAction = 'close-exit-dialog' | 'confirm-exit';

/**
 * Builds the themed confirmation dialog shown before leaving a game.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Returns the CSS modifier needed for the selected exit-dialog theme.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns HTML markup or display text consumed by the caller.
 */
function getThemeClass(theme: ThemeOption): string {
  return theme === 'gaming' ? ' exit-dialog--gaming' : '';
}

/**
 * Builds the themed exit-dialog title while preserving accessible text.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Builds the cancel and confirm actions for the exit dialog.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Builds one exit-dialog button with its action and optional style modifier.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param modifier - Value used by this declaration to produce its documented behavior.
 * @param action - Value used by this declaration to produce its documented behavior.
 * @param label - Visible label rendered for a control or summary item.
 * @returns HTML markup or display text consumed by the caller.
 */
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
