import primaryButtonUrl from '../../assets/images/primary-button.png';
import primaryButtonHoverUrl from '../../assets/images/primary-button-hover.png';
import controllerUrl from '../../assets/images/stadia-controller.png';

export function renderStartScreen(): string {
  return `
    <main class="start-screen">
      <img
        class="start-screen__controller"
        src="${controllerUrl}"
        alt=""
        aria-hidden="true"
      />

      <section class="start-screen__content">
        <p class="start-screen__eyebrow">It’s play time.</p>
        <h1 class="start-screen__title">Ready to play?</h1>

        <button
          class="start-screen__button"
          type="button"
          data-action="start-game"
          aria-label="Start game"
        >
          <img
            class="start-screen__button-img start-screen__button-img--default"
            src="${primaryButtonUrl}"
            alt="Play"
          />
          <img
            class="start-screen__button-img start-screen__button-img--hover"
            src="${primaryButtonHoverUrl}"
            alt=""
            aria-hidden="true"
          />
        </button>
      </section>
    </main>
  `;
}