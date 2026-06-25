import gamingExitTitleUrl from '../../assets/popup/game-theme/Are you sure you want to quit the game_.svg';

import type { ThemeOption } from './render-settings-screen';

type DialogButtonModifier = 'back' | 'confirm';
type DialogAction = 'close-exit-dialog' | 'confirm-exit';

/**
 * Builds the confirmation dialog shown before the active game is closed.
 *
 * The selected theme controls the dialog modifier, title treatment, and button
 * labels while preserving the same close and confirmation actions.
 *
 * @param theme - Active game theme used to select the dialog presentation.
 * @returns Complete dialog markup ready to be inserted into the game screen.
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
 * Resolves the theme modifier appended to the base dialog class.
 *
 * Code Vibes and unfinished themes keep the base presentation, while Gaming
 * and DA Projects receive their dedicated visual modifiers.
 *
 * @param theme - Active game theme whose modifier should be applied.
 * @returns A leading-space class modifier, or an empty string for the base style.
 */
function getThemeClass(theme: ThemeOption): string {
  if (theme === 'gaming') return ' exit-dialog--gaming';
  if (theme === 'da-projects') return ' exit-dialog--da-projects';

  return '';
}

/**
 * Builds the dialog heading in the format required by the active theme.
 *
 * Gaming uses its exported title artwork, while text-based themes retain a
 * semantic heading with a theme-specific line break.
 *
 * @param theme - Active game theme used to choose the heading treatment.
 * @returns Accessible level-two heading markup for the confirmation dialog.
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

  if (theme === 'da-projects') {
    return `
      <h2 id="exit-dialog-title" class="exit-dialog__title">
        Are you sure you want to<br />
        quit the game?
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
 * Builds the controls that cancel or confirm leaving the current game.
 *
 * Gaming uses longer labels from its design, while all other themes retain the
 * concise Back to game and Exit game wording.
 *
 * @param theme - Active game theme used to choose the visible button labels.
 * @returns Action-group markup containing the cancel and confirmation buttons.
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
 * Builds one native button used by the exit-confirmation workflow.
 *
 * @param modifier - Visual role used to style the cancel or confirmation action.
 * @param action - Controller action dispatched when the button is activated.
 * @param label - Visible text that communicates the button's result.
 * @returns Button markup carrying the requested modifier and action hook.
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
