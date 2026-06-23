import blueMarkerUrl from '../../assets/icons/player-marker-blue.svg';
import orangeMarkerUrl from '../../assets/icons/player-marker-orange.svg';
import exitButtonSvg from '../../assets/icons/exit.svg?raw';
import gamingBlueMarkerUrl from '../../assets/icons/chess-pawn-blue.svg';
import gamingOrangeMarkerUrl from '../../assets/icons/chess-pawn-orange.svg';
import gamingCurrentPlayerSvg from '../../assets/icons/game-theme/chess-pawn-blue.svg?raw';
import gamingCurrentPlayerTitleUrl from '../../assets/icons/game-theme/headline.svg';

import type { ThemeOption } from './render-settings-screen';

const DEFAULT_SCORE_ORDER = ['blue', 'orange'] as const;
const GAMING_SCORE_ORDER = ['orange', 'blue'] as const;

type Player = 'blue' | 'orange';
type Scores = Record<Player, number>;

interface GameInfoSettings {
  theme: ThemeOption;
  player: Player;
  bluePoints?: number;
  orangePoints?: number;
}

/**
 * Builds the in-game header containing scores, current player, and exit control.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param settings - Selected game settings used to initialize state or render UI.
 * @returns HTML markup or display text consumed by the caller.
 */
export function renderGameInfo(
  settings: GameInfoSettings,
): string {
  const scores = getScores(settings);

  return `
    <header class="game-info">
      <div class="game-info__points">
        ${renderScores(settings.theme, scores)}
      </div>

      ${renderCurrentPlayer(settings.theme, settings.player)}
      ${renderExitButton()}
    </header>
  `;
}

/**
 * Returns score values for both players, defaulting missing scores to zero.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param settings - Selected game settings used to initialize state or render UI.
 * @returns Score record with values for both players.
 */
function getScores(settings: GameInfoSettings): Scores {
  return {
    blue: settings.bluePoints ?? 0,
    orange: settings.orangePoints ?? 0,
  };
}

/**
 * Builds the live score markers in the order expected by the theme.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @param scores - Current score values used to render or calculate the game result.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderScores(
  theme: ThemeOption,
  scores: Scores,
): string {
  return getScoreOrder(theme)
    .map((player) => renderScore(theme, player, scores[player]))
    .join('');
}

/**
 * Returns the live score display order for the active theme.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns Ordered player identifiers used while rendering score displays.
 */
function getScoreOrder(
  theme: ThemeOption,
): readonly Player[] {
  return theme === 'gaming'
    ? GAMING_SCORE_ORDER
    : DEFAULT_SCORE_ORDER;
}

/**
 * Builds the current-player indicator appropriate for the theme.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @param player - Player identifier used to choose artwork, order, or score values.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderCurrentPlayer(
  theme: ThemeOption,
  player: Player,
): string {
  return theme === 'gaming'
    ? renderGamingCurrentPlayer(player)
    : renderCodeVibesCurrentPlayer(player);
}

/**
 * Builds the Code Vibes current-player label and marker image.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param player - Player identifier used to choose artwork, order, or score values.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderCodeVibesCurrentPlayer(player: Player): string {
  return `
    <div class="game-info__current-player">
      <span>Current player:</span>
      <img
        class="game-info__current-marker"
        src="${getPlayerMarker(player)}"
        alt="${player} player"
      />
    </div>
  `;
}

/**
 * Builds the Gaming current-player artwork and dataset marker.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param player - Player identifier used to choose artwork, order, or score values.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderGamingCurrentPlayer(player: Player): string {
  return `
    <div class="game-info__current-player">
      <img
        class="game-info__current-title"
        src="${gamingCurrentPlayerTitleUrl}"
        alt="Current player:"
      />
      <span
        class="game-info__current-marker"
        data-current-player="${player}"
        role="img"
        aria-label="${player} player"
      >
        ${gamingCurrentPlayerSvg}
      </span>
    </div>
  `;
}

/**
 * Builds the in-game exit button that opens confirmation.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns HTML markup or display text consumed by the caller.
 */
function renderExitButton(): string {
  return `
    <button
      class="game-info__exit"
      type="button"
      data-action="open-exit-dialog"
      aria-label="Exit game"
      aria-haspopup="dialog"
    >
      <span class="game-info__exit-image" aria-hidden="true">
        ${exitButtonSvg}
      </span>
    </button>
  `;
}

/**
 * Selects the Code Vibes marker image associated with a player.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param player - Player identifier used to choose artwork, order, or score values.
 * @returns HTML markup or display text consumed by the caller.
 */
function getPlayerMarker(player: Player): string {
  return player === 'orange' ? orangeMarkerUrl : blueMarkerUrl;
}

/**
 * Selects the live score marker artwork for a theme and player.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @param player - Player identifier used to choose artwork, order, or score values.
 * @returns HTML markup or display text consumed by the caller.
 */
function getScoreMarker(
  theme: ThemeOption,
  player: Player,
): string {
  if (theme !== 'gaming') return getPlayerMarker(player);

  return player === 'orange'
    ? gamingOrangeMarkerUrl
    : gamingBlueMarkerUrl;
}

/**
 * Builds one live score display with marker artwork and point value.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @param player - Player identifier used to choose artwork, order, or score values.
 * @param points - Score value displayed for the player.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderScore(
  theme: ThemeOption,
  player: Player,
  points: number,
): string {
  return `
    <div class="game-info__score game-info__score--${player}">
      <img
        class="game-info__score-marker"
        src="${getScoreMarker(theme, player)}"
        alt=""
        aria-hidden="true"
      />

      <img
        class="game-info__player-marker"
        src="${getPlayerMarker(player)}"
        alt=""
        aria-hidden="true"
      />

      <span
        class="game-info__score-value"
        data-score="${player}"
      >
        ${points}
      </span>
    </div>
  `;
}
