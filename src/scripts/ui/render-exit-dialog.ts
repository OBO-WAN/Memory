export function renderExitDialog(): string {
  return `
    <dialog
      class="exit-dialog"
      aria-labelledby="exit-dialog-title"
    >
      <section class="exit-dialog__panel">
        <h2
          id="exit-dialog-title"
          class="exit-dialog__title"
        >
          Are you sure you want to quit<br />
          the game?
        </h2>

        <div class="exit-dialog__actions">
          <button
            class="exit-dialog__button exit-dialog__button--back"
            type="button"
            data-action="close-exit-dialog"
          >
            Back to game
          </button>

          <button
            class="exit-dialog__button exit-dialog__button--confirm"
            type="button"
            data-action="confirm-exit"
          >
            Exit game
          </button>
        </div>
      </section>
    </dialog>
  `;
}
