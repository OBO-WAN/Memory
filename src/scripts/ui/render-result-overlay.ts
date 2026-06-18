import backButtonUrl from '../../assets/images/result-overlay/back-button.svg';
import drawTitleUrl from '../../assets/images/result-overlay/draw-green.svg';
import bluePlayerTitleUrl from '../../assets/images/result-overlay/blue-player.svg';
import bluePlayerIconUrl from '../../assets/images/result-overlay/player-blue.svg';
import confettiUrl from '../../assets/images/result-overlay/confetti.svg';
import itsATitleUrl from '../../assets/images/result-overlay/its-a.svg';
import orangePlayerTitleUrl from '../../assets/images/result-overlay/orange-player.svg';
import orangePlayerIconUrl from '../../assets/images/result-overlay/player.svg';
import scaleIconUrl from '../../assets/images/result-overlay/scale-icon.svg';
import winnerTitleUrl from '../../assets/images/result-overlay/winner-title.svg';

type Player = 'blue' | 'orange';
type Scores = Record<Player, number>;
type Result = Player | 'draw';

export function renderResultOverlay(scores: Scores): string {
  const result = getResult(scores);

  return `
    <dialog
      class="result-overlay result-overlay--${result}"
      aria-labelledby="result-overlay-title"
    >
      ${result === 'draw'
        ? renderDrawResult()
        : renderWinnerResult(result)}

      ${renderBackButton()}
    </dialog>
  `;
}

function renderWinnerResult(winner: Player): string {
  const playerIcon =
    winner === 'orange'
      ? orangePlayerIconUrl
      : bluePlayerIconUrl;

  return `
    <img
      class="result-overlay__confetti"
      src="${confettiUrl}"
      alt=""
      aria-hidden="true"
    />

    <section class="result-overlay__content">
      <img
        class="result-overlay__winner-title"
        src="${winnerTitleUrl}"
        alt="The winner is"
      />

      ${renderWinnerName(winner)}

      <img
        class="result-overlay__player-icon"
        src="${playerIcon}"
        alt=""
        aria-hidden="true"
      />
    </section>
  `;
}

function renderWinnerName(winner: Player): string {
  const titleUrl =
    winner === 'orange'
      ? orangePlayerTitleUrl
      : bluePlayerTitleUrl;

  return `
    <img
      id="result-overlay-title"
      class="result-overlay__winner-name-image"
      src="${titleUrl}"
      alt="${capitalize(winner)} player"
    />
  `;
}

function renderDrawResult(): string {
  return `
    <section class="result-overlay__content result-overlay__content--draw">
      <img
        class="result-overlay__draw-eyebrow"
        src="${itsATitleUrl}"
        alt="It’s a"
      />

      <img
        id="result-overlay-title"
        class="result-overlay__draw-title"
        src="${drawTitleUrl}"
        alt="Draw"
      />

      <img
        class="result-overlay__scale-icon"
        src="${scaleIconUrl}"
        alt=""
        aria-hidden="true"
      />
    </section>
  `;
}

function renderBackButton(): string {
  return `
    <button
      class="result-overlay__back-button"
      type="button"
      data-action="back-to-start"
      aria-label="Back to start"
    >
      <img src="${backButtonUrl}" alt="" aria-hidden="true" />
    </button>
  `;
}

function getResult(scores: Scores): Result {
  if (scores.blue === scores.orange) return 'draw';

  return scores.blue > scores.orange ? 'blue' : 'orange';
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
