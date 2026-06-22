import backButtonUrl from '../../assets/images/result-overlay/back-button.svg';
import codeVibesBluePlayerTitleUrl from '../../assets/images/result-overlay/blue-player.svg';
import codeVibesConfettiUrl from '../../assets/images/result-overlay/confetti.svg';
import codeVibesDrawTitleUrl from '../../assets/images/result-overlay/draw-green.svg';
import codeVibesItsATitleUrl from '../../assets/images/result-overlay/its-a.svg';
import codeVibesOrangePlayerTitleUrl from '../../assets/images/result-overlay/orange-player.svg';
import codeVibesBluePlayerIconUrl from '../../assets/images/result-overlay/player-blue.svg';
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

interface WinnerAssets {
  playerIcon?: string;
  playerTitle: string;
  winnerTitle: string;
}

interface DrawAssets {
  eyebrowTitle: string;
  mainTitle: string;
  scaleIcon: string;
}

/** Renders the final winner or draw overlay. */
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

/** Renders the result content for the current outcome. */
function renderResult(
  result: Result,
  theme: ThemeOption,
): string {
  if (result === 'draw') return renderDrawResult(theme);

  return renderWinnerResult(result, theme);
}

/** Renders a winner result for the selected theme. */
function renderWinnerResult(
  winner: Player,
  theme: ThemeOption,
): string {
  const assets = getWinnerAssets(winner, theme);

  return theme === 'gaming'
    ? renderGamingWinner(assets, winner)
    : renderCodeVibesWinner(assets, winner);
}

/** Returns the winner assets for one theme and player. */
function getWinnerAssets(
  winner: Player,
  theme: ThemeOption,
): WinnerAssets {
  return theme === 'gaming'
    ? getGamingWinnerAssets(winner)
    : getCodeVibesWinnerAssets(winner);
}

/** Returns the Code Vibes winner assets. */
function getCodeVibesWinnerAssets(
  winner: Player,
): WinnerAssets {
  return {
    playerIcon: getCodeVibesPlayerIcon(winner),
    playerTitle: getCodeVibesPlayerTitle(winner),
    winnerTitle: codeVibesWinnerTitleUrl,
  };
}

/** Returns the Gaming winner assets. */
function getGamingWinnerAssets(
  winner: Player,
): WinnerAssets {
  return {
    playerTitle: getGamingPlayerTitle(winner),
    winnerTitle: gamingWinnerTitleUrl,
  };
}

/** Renders the Code Vibes winner layout. */
function renderCodeVibesWinner(
  assets: WinnerAssets,
  winner: Player,
): string {
  return `
    <img
      class="result-overlay__confetti"
      src="${codeVibesConfettiUrl}"
      alt=""
      aria-hidden="true"
    />

    <section class="result-overlay__content">
      ${renderWinnerTitle(assets.winnerTitle)}
      ${renderWinnerName(assets.playerTitle, winner)}
      ${renderPlayerIcon(assets.playerIcon)}
    </section>
  `;
}

/** Renders the Gaming winner layout. */
function renderGamingWinner(
  assets: WinnerAssets,
  winner: Player,
): string {
  return `
    <section
      class="result-overlay__content result-overlay__content--gaming-winner"
    >
      ${renderWinnerTitle(
        assets.winnerTitle,
        ' result-overlay__winner-title--gaming',
      )}
      ${renderWinnerName(assets.playerTitle, winner)}

      <img
        class="result-overlay__trophy"
        src="${gamingTrophyUrl}"
        alt=""
        aria-hidden="true"
      />
    </section>
  `;
}

/** Renders the winner title image. */
function renderWinnerTitle(
  source: string,
  modifierClass = '',
): string {
  return `
    <img
      class="result-overlay__winner-title${modifierClass}"
      src="${source}"
      alt="The winner is"
    />
  `;
}

/** Renders the winning player name image. */
function renderWinnerName(
  source: string,
  winner: Player,
): string {
  return `
    <img
      id="result-overlay-title"
      class="result-overlay__winner-name-image"
      src="${source}"
      alt="${capitalize(winner)} player"
    />
  `;
}

/** Renders the Code Vibes player icon when available. */
function renderPlayerIcon(source?: string): string {
  if (!source) return '';

  return `
    <img
      class="result-overlay__player-icon"
      src="${source}"
      alt=""
      aria-hidden="true"
    />
  `;
}

/** Returns the Code Vibes player title image. */
function getCodeVibesPlayerTitle(winner: Player): string {
  return winner === 'orange'
    ? codeVibesOrangePlayerTitleUrl
    : codeVibesBluePlayerTitleUrl;
}

/** Returns the Code Vibes player icon image. */
function getCodeVibesPlayerIcon(winner: Player): string {
  return winner === 'orange'
    ? codeVibesOrangePlayerIconUrl
    : codeVibesBluePlayerIconUrl;
}

/** Returns the Gaming player title image. */
function getGamingPlayerTitle(winner: Player): string {
  return winner === 'orange'
    ? gamingOrangePlayerTitleUrl
    : gamingBluePlayerTitleUrl;
}

/** Renders a draw result for the selected theme. */
function renderDrawResult(theme: ThemeOption): string {
  const assets = getDrawAssets(theme);
  const modifierClass = getDrawModifierClass(theme);

  return renderDrawContent(assets, modifierClass);
}

/** Returns the draw assets for the selected theme. */
function getDrawAssets(theme: ThemeOption): DrawAssets {
  if (theme === 'gaming') {
    return {
      eyebrowTitle: gamingItsATitleUrl,
      mainTitle: gamingDrawTitleUrl,
      scaleIcon: gamingScaleIconUrl,
    };
  }

  return {
    eyebrowTitle: codeVibesItsATitleUrl,
    mainTitle: codeVibesDrawTitleUrl,
    scaleIcon: codeVibesScaleIconUrl,
  };
}

/** Returns the Gaming draw layout modifier. */
function getDrawModifierClass(theme: ThemeOption): string {
  return theme === 'gaming'
    ? ' result-overlay__content--gaming-draw'
    : '';
}

/** Renders the complete draw layout. */
function renderDrawContent(
  assets: DrawAssets,
  modifierClass: string,
): string {
  return `
    <section
      class="result-overlay__content result-overlay__content--draw${modifierClass}"
    >
      ${renderDrawTitleImages(assets)}
      ${renderScaleIcon(assets.scaleIcon)}
    </section>
  `;
}

/** Renders the draw eyebrow and main title images. */
function renderDrawTitleImages(assets: DrawAssets): string {
  return `
    <img
      class="result-overlay__draw-eyebrow"
      src="${assets.eyebrowTitle}"
      alt="It’s a"
    />

    <img
      id="result-overlay-title"
      class="result-overlay__draw-title"
      src="${assets.mainTitle}"
      alt="Draw"
    />
  `;
}

/** Renders the decorative scale icon. */
function renderScaleIcon(source: string): string {
  return `
    <img
      class="result-overlay__scale-icon"
      src="${source}"
      alt=""
      aria-hidden="true"
    />
  `;
}

/** Renders the button that returns to the start screen. */
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

/** Returns the winning player or a draw result. */
function getResult(scores: Scores): Result {
  if (scores.blue === scores.orange) return 'draw';

  return scores.blue > scores.orange ? 'blue' : 'orange';
}

/** Capitalizes the first character of a value. */
function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
