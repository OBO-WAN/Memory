import backButtonUrl from '../../assets/images/result-overlay/back-button.svg';
import codeVibesDrawTitleUrl from '../../assets/images/result-overlay/draw-green.svg';
import codeVibesBluePlayerTitleUrl from '../../assets/images/result-overlay/blue-player.svg';
import codeVibesBluePlayerIconUrl from '../../assets/images/result-overlay/player-blue.svg';
import codeVibesConfettiUrl from '../../assets/images/result-overlay/confetti.svg';
import codeVibesItsATitleUrl from '../../assets/images/result-overlay/its-a.svg';
import codeVibesOrangePlayerTitleUrl from '../../assets/images/result-overlay/orange-player.svg';
import codeVibesOrangePlayerIconUrl from '../../assets/images/result-overlay/player.svg';
import codeVibesScaleIconUrl from '../../assets/images/result-overlay/scale-icon.svg';
import codeVibesWinnerTitleUrl from '../../assets/images/result-overlay/winner-title.svg';
import gamingBluePlayerTitleUrl from '../../assets/images/result-overlay/game-theme/blue-player.svg';
import gamingDrawTitleUrl from '../../assets/images/result-overlay/game-theme/draw.svg';
import gamingItsATitleUrl from '../../assets/images/result-overlay/game-theme/its-a.svg';
import gamingOrangePlayerTitleUrl from '../../assets/images/result-overlay/game-theme/orange-player.svg';
import gamingScaleIconUrl from '../../assets/images/result-overlay/game-theme/scale-icon.svg';
import gamingTrophyUrl from '../../assets/images/result-overlay/game-theme/trophy.svg';
import gamingWinnerTitleUrl from '../../assets/images/result-overlay/game-theme/winner-title.svg';

import type { ThemeOption } from './render-settings-screen';

type Player = 'blue' | 'orange';
type Scores = Record<Player, number>;
type Result = Player | 'draw';

export function renderResultOverlay(
  scores: Scores,
  theme: ThemeOption,
): string {
  const result = getResult(scores);

  return `
    <dialog
      class="result-overlay result-overlay--${theme} result-overlay--${result}"
      aria-labelledby="result-overlay-title"
    >
      ${renderResult(result, theme)}
      ${renderBackButton()}
    </dialog>
  `;
}

function renderResult(
  result: Result,
  theme: ThemeOption,
): string {
  if (result === 'draw') return renderDrawResult(theme);

  return theme === 'gaming'
    ? renderGamingWinnerResult(result)
    : renderCodeVibesWinnerResult(result);
}

function renderCodeVibesWinnerResult(winner: Player): string {
  const playerIcon =
    winner === 'orange'
      ? codeVibesOrangePlayerIconUrl
      : codeVibesBluePlayerIconUrl;

  return `
    <img
      class="result-overlay__confetti"
      src="${codeVibesConfettiUrl}"
      alt=""
      aria-hidden="true"
    />

    <section class="result-overlay__content">
      <img
        class="result-overlay__winner-title"
        src="${codeVibesWinnerTitleUrl}"
        alt="The winner is"
      />

      ${renderCodeVibesWinnerName(winner)}

      <img
        class="result-overlay__player-icon"
        src="${playerIcon}"
        alt=""
        aria-hidden="true"
      />
    </section>
  `;
}

function renderGamingWinnerResult(winner: Player): string {
  return `
    <section
      class="result-overlay__content result-overlay__content--gaming-winner"
    >
      <img
        class="result-overlay__winner-title result-overlay__winner-title--gaming"
        src="${gamingWinnerTitleUrl}"
        alt="The winner is"
      />

      ${renderGamingWinnerName(winner)}

      <img
        class="result-overlay__trophy"
        src="${gamingTrophyUrl}"
        alt=""
        aria-hidden="true"
      />
    </section>
  `;
}

function renderCodeVibesWinnerName(winner: Player): string {
  const titleUrl =
    winner === 'orange'
      ? codeVibesOrangePlayerTitleUrl
      : codeVibesBluePlayerTitleUrl;

  return renderWinnerName(titleUrl, winner);
}

function renderGamingWinnerName(winner: Player): string {
  const titleUrl =
    winner === 'orange'
      ? gamingOrangePlayerTitleUrl
      : gamingBluePlayerTitleUrl;

  return renderWinnerName(titleUrl, winner);
}

function renderWinnerName(
  titleUrl: string,
  winner: Player,
): string {
  return `
    <img
      id="result-overlay-title"
      class="result-overlay__winner-name-image"
      src="${titleUrl}"
      alt="${capitalize(winner)} player"
    />
  `;
}

function renderDrawResult(theme: ThemeOption): string {
  return theme === 'gaming'
    ? renderGamingDrawResult()
    : renderCodeVibesDrawResult();
}

function renderCodeVibesDrawResult(): string {
  return renderDrawContent(
    codeVibesItsATitleUrl,
    codeVibesDrawTitleUrl,
    codeVibesScaleIconUrl,
    '',
  );
}

function renderGamingDrawResult(): string {
  return renderDrawContent(
    gamingItsATitleUrl,
    gamingDrawTitleUrl,
    gamingScaleIconUrl,
    ' result-overlay__content--gaming-draw',
  );
}

function renderDrawContent(
  eyebrowUrl: string,
  titleUrl: string,
  scaleUrl: string,
  modifierClass: string,
): string {
  return `
    <section
      class="result-overlay__content result-overlay__content--draw${modifierClass}"
    >
      <img
        class="result-overlay__draw-eyebrow"
        src="${eyebrowUrl}"
        alt="It’s a"
      />

      <img
        id="result-overlay-title"
        class="result-overlay__draw-title"
        src="${titleUrl}"
        alt="Draw"
      />

      <img
        class="result-overlay__scale-icon"
        src="${scaleUrl}"
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
