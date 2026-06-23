import primaryButtonHoverUrl from '../../assets/images/primary-button-hover.png';
import primaryButtonUrl from '../../assets/images/primary-button.png';
import controllerUrl from '../../assets/images/stadia-controller.png';

/**
 * Builds the initial screen that invites the user to start setup.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns HTML markup or display text consumed by the caller.
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
 * Builds the decorative controller image for the start screen.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Builds the start-screen copy and action that opens settings.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns HTML markup or display text consumed by the caller.
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
 * Builds the start button with hover and default visual states.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Builds one layered image used by the start button visual states.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param source - Asset URL inserted into the rendered image markup.
 * @param modifierClass - Optional CSS modifier appended to generated markup.
 * @param alternativeText - Accessible text assigned to the rendered image when it is meaningful.
 * @returns HTML markup or display text consumed by the caller.
 */
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
