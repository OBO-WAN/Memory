import playButtonDecorationHoverUrl from '../../assets/images/play-button-decoration-hover.svg';
import playButtonDecorationUrl from '../../assets/images/play-button-decoration.svg';
import controllerUrl from '../../assets/images/stadia-controller.svg';

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
 * @returns Section markup containing the eyebrow, heading, and Play button.
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
 * The visible label remains semantic text while the controller and arrow
 * artwork crossfade between the supplied default and hover designs.
 *
 * @returns Play button markup with live text and decorative state artwork.
 */
function renderPlayButton(): string {
  return `
    <button
      class="start-screen__button"
      type="button"
      data-action="open-settings"
      aria-label="Play – open game settings"
    >
      <span
        class="start-screen__button-artwork"
        aria-hidden="true"
      >
        ${renderPlayButtonArtwork(
          playButtonDecorationUrl,
          'start-screen__button-artwork-img--default',
        )}
        ${renderPlayButtonArtwork(
          playButtonDecorationHoverUrl,
          'start-screen__button-artwork-img--hover',
        )}
      </span>

      <span class="start-screen__button-label">Play</span>
    </button>
  `;
}

/**
 * Builds one decorative artwork layer used by the Play button.
 *
 * @param source - Imported controller-and-arrow asset URL.
 * @param modifierClass - State class used to position and crossfade the artwork.
 * @returns Decorative image markup for one button state.
 */
function renderPlayButtonArtwork(
  source: string,
  modifierClass: string,
): string {
  return `
    <img
      class="start-screen__button-artwork-img ${modifierClass}"
      src="${source}"
      alt=""
    />
  `;
}
