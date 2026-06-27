import backButtonUrl from '../../assets/images/result-overlay/back-button.svg';
import { formatPlayerLabel } from '../utils/format-player-label';

import {
  DA_HOME_BUTTON_URL,
  renderDaDrawResult,
  renderDaWinnerResult,
} from './render-da-result-content';
import {
  CODE_VIBES_CONFETTI_URL,
  GAMING_TROPHY_URL,
  getStandardDrawAssets,
  getStandardWinnerAssets,
} from './result-overlay-theme-assets';
import type {
  DrawAssets,
  WinnerAssets,
} from './result-overlay-theme-assets';
import type { GameResult, Scores } from '../types/game.types';
import type { GameTheme, PlayerColor } from '../types/settings.types';

type StandardResultTheme = Exclude<GameTheme, 'da-projects'>;

/**
 * Builds the final result dialog for a winner or draw.
 * @param scores - Final scores used to determine the result.
 * @param theme - Active theme used to select artwork and layout.
 * @returns Complete result-dialog markup.
 */
export function renderResultOverlay(
  scores: Scores,
  theme: GameTheme,
): string {
  const result = getResult(scores);

  return `
    <dialog
      class="result-overlay result-overlay--${theme} result-overlay--${result}"
      aria-labelledby="result-overlay-title"
    >
      ${renderResult(result, theme)}
      ${renderHomeButton(theme)}
    </dialog>
  `;
}

/**
 * Chooses the winner or draw layout for the computed result.
 * @param result - Winning player or draw state.
 * @param theme - Theme used to select the presentation.
 * @returns Theme-specific result content.
 */
function renderResult(result: GameResult, theme: GameTheme): string {
  return result === 'draw'
    ? renderDrawResult(theme)
    : renderWinnerResult(result, theme);
}

/**
 * Builds the winner layout required by the active theme.
 * @param winner - Player announced as the winner.
 * @param theme - Theme used to select the layout.
 * @returns Winner announcement markup.
 */
function renderWinnerResult(
  winner: PlayerColor,
  theme: GameTheme,
): string {
  if (theme === 'da-projects') {
    return renderDaWinnerResult(winner);
  }

  const assets = getStandardWinnerAssets(winner, theme);

  return theme === 'gaming'
    ? renderGamingWinner(assets, winner)
    : renderCodeVibesWinner(assets, winner);
}

/**
 * Builds the Code Vibes winner layout with confetti.
 * @param assets - Artwork used by the announcement.
 * @param winner - Player announced as the winner.
 * @returns Code Vibes winner markup.
 */
function renderCodeVibesWinner(
  assets: WinnerAssets,
  winner: PlayerColor,
): string {
  return `
    <img
      class="result-overlay__confetti"
      src="${CODE_VIBES_CONFETTI_URL}"
      alt=""
    />

    <section class="result-overlay__content">
      ${renderWinnerTitle(assets.winnerTitle)}
      ${renderWinnerName(assets.playerTitle, winner)}
      ${renderPlayerIcon(assets.playerIcon)}
    </section>
  `;
}

/**
 * Builds the Gaming winner layout with its trophy.
 * @param assets - Artwork used by the announcement.
 * @param winner - Player announced as the winner.
 * @returns Gaming winner markup.
 */
function renderGamingWinner(
  assets: WinnerAssets,
  winner: PlayerColor,
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
        src="${GAMING_TROPHY_URL}"
        alt=""
      />
    </section>
  `;
}

/**
 * Builds the decorative winner-introduction image.
 * @param source - Imported winner-title asset URL.
 * @param modifierClass - Optional theme-specific class suffix.
 * @returns Winner-title image markup.
 */
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

/**
 * Builds the image that names the winning player.
 *
 * @param source - Imported player-title asset URL.
 * @param winner - Player named by the artwork.
 * @returns Accessible winner-name image markup.
 */
function renderWinnerName(source: string, winner: PlayerColor): string {
  return `
    <img
      id="result-overlay-title"
      class="result-overlay__winner-name-image"
      src="${source}"
      alt="${formatPlayerLabel(winner)} player"
    />
  `;
}

/**
 * Builds the decorative Code Vibes player icon.
 * @param source - Optional player-icon asset URL.
 * @returns Player-icon markup, or an empty string.
 */
function renderPlayerIcon(source?: string): string {
  if (!source) return '';

  return `
    <img
      class="result-overlay__player-icon"
      src="${source}"
      alt=""
    />
  `;
}

/**
 * Builds the draw layout using theme-specific artwork.
 *
 * @param theme - Theme used to select draw assets.
 * @returns Draw-result markup.
 */
function renderDrawResult(theme: GameTheme): string {
  if (theme === 'da-projects') return renderDaDrawResult();

  return renderDrawContent(
    getStandardDrawAssets(theme),
    getDrawModifierClass(theme),
  );
}

/**
 * Returns the additional Gaming draw-layout class.
 *
 * @param theme - Standard result theme whose modifier is required.
 * @returns Gaming class suffix, or an empty string.
 */
function getDrawModifierClass(
  theme: StandardResultTheme,
): string {
  return theme === 'gaming'
    ? ' result-overlay__content--gaming-draw'
    : '';
}

/**
 * Builds the shared draw layout from supplied artwork.
 * @param assets - Artwork used by the draw announcement.
 * @param modifierClass - Optional theme-specific class suffix.
 * @returns Draw content markup.
 */
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

/**
 * Builds the two title images used by a draw.
 * @param assets - Draw-title assets for the active theme.
 * @returns Eyebrow and main draw-title markup.
 */
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

/**
 * Builds the decorative scale image displayed for a draw.
 * @param source - Imported scale asset URL.
 * @returns Decorative scale image markup.
 */
function renderScaleIcon(source: string): string {
  return `
    <img
      class="result-overlay__scale-icon"
      src="${source}"
      alt=""
    />
  `;
}

/**
 * Builds the action that returns to the start screen.
 * @param theme - Theme used to select button artwork and label.
 * @returns Home or back-button markup.
 */
function renderHomeButton(theme: GameTheme): string {
  const isDaProjects = theme === 'da-projects';
  const source = isDaProjects ? DA_HOME_BUTTON_URL : backButtonUrl;
  const label = isDaProjects ? 'Home' : 'Back to start';

  return `
    <button
      class="result-overlay__back-button"
      type="button"
      data-action="back-to-start"
      aria-label="${label}"
    >
      <img src="${source}" alt="" />
    </button>
  `;
}

/**
 * Compares final scores and returns the game result.
 * @param scores - Final scores for both players.
 * @returns Winning player, or `draw` for equal scores.
 */
function getResult(scores: Scores): GameResult {
  if (scores.blue === scores.orange) return 'draw';

  return scores.blue > scores.orange ? 'blue' : 'orange';
}
