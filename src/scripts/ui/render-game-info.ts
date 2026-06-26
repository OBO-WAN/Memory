import blueMarkerUrl from '../../assets/icons/player-marker-blue.svg';
import orangeMarkerUrl from '../../assets/icons/player-marker-orange.svg';
import gamingBlueMarkerUrl from '../../assets/icons/chess-pawn-blue.svg';
import gamingOrangeMarkerUrl from '../../assets/icons/chess-pawn-orange.svg';
import gamingCurrentPlayerSvg from '../../assets/icons/game-theme/chess-pawn-blue.svg?raw';

import type { ThemeOption } from './render-settings-screen';

const DEFAULT_SCORE_ORDER = ['blue', 'orange'] as const;
const ORANGE_FIRST_SCORE_ORDER = ['orange', 'blue'] as const;

type Player = 'blue' | 'orange';
type Scores = Record<Player, number>;

interface GameInfoSettings {
  theme: ThemeOption;
  player: Player;
  bluePoints?: number;
  orangePoints?: number;
}

/**
 * Builds the in-game header for the active theme.
 *
 * The header exposes both scores, identifies the current player, and provides
 * the control that opens the exit confirmation dialog.
 *
 * @param settings - Active theme, player, and optional score values.
 * @returns Header markup configured for the current game state.
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
      ${renderExitButton(settings.theme)}
    </header>
  `;
}

/**
 * Normalizes the optional score values used by the header.
 *
 * Missing values are converted to zero so both score displays always receive
 * a valid number.
 *
 * @param settings - Current game information containing optional scores.
 * @returns Score values for the blue and orange players.
 */
function getScores(settings: GameInfoSettings): Scores {
  return {
    blue: settings.bluePoints ?? 0,
    orange: settings.orangePoints ?? 0,
  };
}

/**
 * Builds both live score displays in the order required by the active theme.
 *
 * @param theme - Theme that determines score order and marker artwork.
 * @param scores - Current point totals for both players.
 * @returns Combined markup for the two live score indicators.
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
 * Determines the player order used by the score panel.
 *
 * Gaming and DA Projects place orange first to match their Figma layouts,
 * while the remaining themes retain the default blue-first order.
 *
 * @param theme - Active visual theme.
 * @returns Player identifiers in their required display order.
 */
function getScoreOrder(
  theme: ThemeOption,
): readonly Player[] {
  return theme === 'gaming' || theme === 'da-projects'
    ? ORANGE_FIRST_SCORE_ORDER
    : DEFAULT_SCORE_ORDER;
}

/**
 * Builds the current-player indicator required by the active theme.
 *
 * @param theme - Theme that determines the indicator structure and artwork.
 * @param player - Player currently taking a turn.
 * @returns Theme-specific current-player markup.
 */
function renderCurrentPlayer(
  theme: ThemeOption,
  player: Player,
): string {
  if (theme === 'gaming') {
    return renderGamingCurrentPlayer(player);
  }

  if (theme === 'da-projects') {
    return renderDaProjectsCurrentPlayer(player);
  }

  return renderCodeVibesCurrentPlayer(player);
}

/**
 * Builds the Code Vibes current-player label and image marker.
 *
 * @param player - Player currently taking a turn.
 * @returns Current-player markup using the Code Vibes marker asset.
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
 * Builds the Gaming current-player label and color-controlled pawn marker.
 *
 * The player identifier is stored as data so the controller can update the
 * marker color and accessible label after each turn.
 *
 * @param player - Player currently taking a turn.
 * @returns Current-player markup styled for the Gaming theme.
 */
function renderGamingCurrentPlayer(player: Player): string {
  return `
    <div class="game-info__current-player">
      <span class="game-info__current-title">Current player:</span>
      ${renderPawnCurrentPlayerMarker(player)}
    </div>
  `;
}

/**
 * Builds the DA Projects current-player label and pawn badge.
 *
 * @param player - Player currently taking a turn.
 * @returns Text-and-badge markup matching the DA Projects header.
 */
function renderDaProjectsCurrentPlayer(player: Player): string {
  return `
    <div class="game-info__current-player">
      <span>Current player:</span>
      ${renderPawnCurrentPlayerMarker(player)}
    </div>
  `;
}

/**
 * Builds the pawn badge shared by themes with a graphic player indicator.
 *
 * The player data attribute supports visual updates without replacing the
 * embedded SVG after the active player changes.
 *
 * @param player - Player represented by the badge.
 * @returns Accessible pawn badge markup for the current player.
 */
function renderPawnCurrentPlayerMarker(player: Player): string {
  return `
    <span
      class="game-info__current-marker"
      data-current-player="${player}"
      role="img"
      aria-label="${player} player"
    >
      ${gamingCurrentPlayerSvg}
    </span>
  `;
}

/**
 * Builds the exit control used by the active theme.
 *
 * DA Projects keeps its dedicated text button, while Code Vibes and Gaming
 * share the standard semantic text button.
 *
 * @param theme - Theme that determines the exit button presentation.
 * @returns Exit button markup that opens the confirmation dialog.
 */
function renderExitButton(theme: ThemeOption): string {
  return theme === 'da-projects'
    ? renderDaProjectsExitButton()
    : renderStandardExitButton();
}

/**
 * Builds the standard text exit button used by Code Vibes and Gaming.
 *
 * @returns Semantic exit button markup with a decorative icon and live label.
 */
function renderStandardExitButton(): string {
  return `
    <button
      class="game-info__exit"
      type="button"
      data-action="open-exit-dialog"
      aria-haspopup="dialog"
    >
      <span class="game-info__exit-icon" aria-hidden="true">
        ${renderExitIcon()}
      </span>

      <span class="game-info__exit-label">Exit game</span>
    </button>
  `;
}

/**
 * Builds the shared decorative exit icon for labelled exit buttons.
 *
 * @returns Inline SVG markup that inherits the surrounding button color.
 */
function renderExitIcon(): string {
  return renderDaProjectsExitIcon();
}

/**
 * Builds the labelled DA Projects exit button.
 *
 * The visible label supplies the accessible name, and the decorative icon
 * inherits the button color for its default and hover states.
 *
 * @returns DA Projects exit button markup with icon and visible text.
 */
function renderDaProjectsExitButton(): string {
  return `
    <button
      class="game-info__exit game-info__exit--labelled"
      type="button"
      data-action="open-exit-dialog"
      aria-haspopup="dialog"
    >
      <span class="game-info__exit-icon" aria-hidden="true">
        ${renderDaProjectsExitIcon()}
      </span>
      <span class="game-info__exit-label">Exit game</span>
    </button>
  `;
}

/**
 * Builds the exit icon used inside the DA Projects text button.
 *
 * @returns Decorative inline SVG markup that follows the button text color.
 */
function renderDaProjectsExitIcon(): string {
  return `
    <svg
      viewBox="24 16 30 30"
      fill="none"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M49.1875 32.25H35.25C34.8958 32.25 34.599 32.1302 34.3594 31.8906C34.1198 31.651 34 31.3542 34 31C34 30.6458 34.1198 30.349 34.3594 30.1094C34.599 29.8698 34.8958 29.75 35.25 29.75H49.1875L48.125 28.6875C47.875 28.4375 47.7552 28.1458 47.7656 27.8125C47.776 27.4792 47.8958 27.1875 48.125 26.9375C48.375 26.6875 48.6719 26.5573 49.0156 26.5469C49.3594 26.5365 49.6562 26.6562 49.9062 26.9062L53.125 30.125C53.375 30.375 53.5 30.6667 53.5 31C53.5 31.3333 53.375 31.625 53.125 31.875L49.9062 35.0938C49.6562 35.3438 49.3594 35.4635 49.0156 35.4531C48.6719 35.4427 48.375 35.3125 48.125 35.0625C47.8958 34.8125 47.776 34.5208 47.7656 34.1875C47.7552 33.8542 47.875 33.5625 48.125 33.3125L49.1875 32.25ZM42.75 26V22.25H30.25V39.75H42.75V36C42.75 35.6458 42.8698 35.349 43.1094 35.1094C43.349 34.8698 43.6458 34.75 44 34.75C44.3542 34.75 44.651 34.8698 44.8906 35.1094C45.1302 35.349 45.25 35.6458 45.25 36V39.75C45.25 40.4375 45.0052 41.026 44.5156 41.5156C44.026 42.0052 43.4375 42.25 42.75 42.25H30.25C29.5625 42.25 28.974 42.0052 28.4844 41.5156C27.9948 41.026 27.75 40.4375 27.75 39.75V22.25C27.75 21.5625 27.9948 20.974 28.4844 20.4844C28.974 19.9948 29.5625 19.75 30.25 19.75H42.75C43.4375 19.75 44.026 19.9948 44.5156 20.4844C45.0052 20.974 45.25 21.5625 45.25 22.25V26C45.25 26.3542 45.1302 26.651 44.8906 26.8906C44.651 27.1302 44.3542 27.25 44 27.25C43.6458 27.25 43.349 27.1302 43.1094 26.8906C42.8698 26.651 42.75 26.3542 42.75 26Z"
      />
    </svg>
  `;
}

/**
 * Selects the standard image marker associated with a player.
 *
 * @param player - Player whose marker asset is required.
 * @returns Imported blue or orange player marker URL.
 */
function getPlayerMarker(player: Player): string {
  return player === 'orange' ? orangeMarkerUrl : blueMarkerUrl;
}

/**
 * Selects the score-marker artwork required by a theme and player.
 *
 * Gaming and DA Projects share the pawn assets, while the remaining themes
 * use the standard Code Vibes markers.
 *
 * @param theme - Theme that determines the marker family.
 * @param player - Player whose marker color is required.
 * @returns Imported marker asset URL for the score display.
 */
function getScoreMarker(
  theme: ThemeOption,
  player: Player,
): string {
  if (theme !== 'gaming' && theme !== 'da-projects') {
    return getPlayerMarker(player);
  }

  return player === 'orange'
    ? gamingOrangeMarkerUrl
    : gamingBlueMarkerUrl;
}

/**
 * Builds one live score display with its decorative marker and point value.
 *
 * A visually hidden standard marker remains available to the game controller
 * when an image-based current-player indicator must change players.
 *
 * @param theme - Theme that determines the visible score marker.
 * @param player - Player represented by this score.
 * @param points - Current point total displayed for the player.
 * @returns Markup for one live score indicator.
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
      />

      <img
        class="game-info__player-marker"
        src="${getPlayerMarker(player)}"
        alt=""
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
