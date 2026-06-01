import primaryButtonUrl from '../assets/images/primary-button.png';
import controllerUrl from '../assets/images/stadia-controller.png';

export function initApp(): void {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return;

  app.innerHTML = `
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

        <button class="start-screen__button" type="button" aria-label="Start game">
          <img src="${primaryButtonUrl}" alt="Play" />
        </button>
      </section>
    </main>
  `;
}