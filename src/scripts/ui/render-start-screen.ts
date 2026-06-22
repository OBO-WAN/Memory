import primaryButtonHoverUrl from '../../assets/images/primary-button-hover.png';
import primaryButtonUrl from '../../assets/images/primary-button.png';
import controllerUrl from '../../assets/images/stadia-controller.png';

/** Renders the initial game start screen. */
export function renderStartScreen(): string {
  return `
    <main class="start-screen">
      ${renderControllerImage()}
      ${renderStartContent()}
    </main>
  `;
}

/** Renders the decorative controller image. */
function renderControllerImage(): string {
  return `
    <img
      class="start-screen__controller"
      src="${controllerUrl}"
      alt=""
      aria-hidden="true"
    />
  `;
}

/** Renders the start screen text and play button. */
function renderStartContent(): string {
  return `
    <section class="start-screen__content">
      <p class="start-screen__eyebrow">It’s play time.</p>
      <h1 class="start-screen__title">Ready to play?</h1>
      ${renderPlayButton()}
    </section>
  `;
}

/** Renders the button that opens the settings screen. */
function renderPlayButton(): string {
  return `
    <button
      class="start-screen__button"
      type="button"
      data-action="open-settings"
      aria-label="Start game"
    >
      ${renderPlayButtonImage(
        primaryButtonUrl,
        'start-screen__button-img--default',
        'Play',
      )}
      ${renderPlayButtonImage(
        primaryButtonHoverUrl,
        'start-screen__button-img--hover',
        '',
      )}
    </button>
  `;
}

/** Renders one visual state of the play button. */
function renderPlayButtonImage(
  source: string,
  modifierClass: string,
  alternativeText: string,
): string {
  const accessibilityAttributes = alternativeText
    ? `alt="${alternativeText}"`
    : 'alt="" aria-hidden="true"';

  return `
    <img
      class="start-screen__button-img ${modifierClass}"
      src="${source}"
      ${accessibilityAttributes}
    />
  `;
}
