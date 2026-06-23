import primaryButtonHoverUrl from '../../assets/images/primary-button-hover.png';
import primaryButtonUrl from '../../assets/images/primary-button.png';
import controllerUrl from '../../assets/images/stadia-controller.png';

/**
 * Builds the complete start screen shown before game configuration begins.
 *
 * @returns Main landmark markup containing the decorative artwork, page heading,
 * and button that opens the settings screen.
 */
export function renderStartScreen(): string {
  return `
    <main class="start-screen">
      ${renderControllerImage()}
      ${renderStartContent()}
    </main>
  `;
}

/**
 * Builds the decorative controller artwork displayed beside the start content.
 *
 * The empty alternative text keeps the purely visual image out of the
 * accessible name and reading order.
 *
 * @returns Decorative controller image markup for the start screen.
 */
function renderControllerImage(): string {
  return `
    <img
      class="start-screen__controller"
      src="${controllerUrl}"
      alt=""
    />
  `;
}

/**
 * Builds the introductory copy and primary action for the start screen.
 *
 * The section is identified by its level-one heading and groups the text with
 * the control that continues to game configuration.
 *
 * @returns Section markup containing the eyebrow, heading, and play button.
 */
function renderStartContent(): string {
  return `
    <section class="start-screen__content">
      <p class="start-screen__eyebrow">It’s play time.</p>
      <h1 class="start-screen__title">Ready to play?</h1>
      ${renderPlayButton()}
    </section>
  `;
}

/**
 * Builds the button that opens the game settings screen.
 *
 * Its accessible name starts with the visible word “Play” and also describes
 * the configuration step triggered by the interaction.
 *
 * @returns Button markup containing the default and hover-state image layers.
 */
function renderPlayButton(): string {
  return `
    <button
      class="start-screen__button"
      type="button"
      data-action="open-settings"
      aria-label="Play – open game settings"
    >
      ${renderPlayButtonImage(
        primaryButtonUrl,
        'start-screen__button-img--default',
      )}
      ${renderPlayButtonImage(
        primaryButtonHoverUrl,
        'start-screen__button-img--hover',
      )}
    </button>
  `;
}

/**
 * Builds one decorative image layer used by the start button.
 *
 * The surrounding button supplies the accessible name, so each visual state
 * uses empty alternative text and is ignored by screen readers.
 *
 * @param source - Imported asset URL for the requested button state.
 * @param modifierClass - CSS modifier that positions the image as a visual state.
 * @returns Decorative image markup for the start button.
 */
function renderPlayButtonImage(
  source: string,
  modifierClass: string,
): string {
  return `
    <img
      class="start-screen__button-img ${modifierClass}"
      src="${source}"
      alt=""
    />
  `;
}
