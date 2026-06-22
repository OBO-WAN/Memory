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

/** Renders the score, active player, and exit control. */
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

/** Returns normalized score values for both players. */
function getScores(settings: GameInfoSettings): Scores {
  return {
    blue: settings.bluePoints ?? 0,
    orange: settings.orangePoints ?? 0,
  };
}

/** Renders both scores in the theme-specific order. */
function renderScores(
  theme: ThemeOption,
  scores: Scores,
): string {
  return getScoreOrder(theme)
    .map((player) => renderScore(theme, player, scores[player]))
    .join('');
}

/** Returns the score order used by the selected theme. */
function getScoreOrder(
  theme: ThemeOption,
): readonly Player[] {
  return theme === 'gaming'
    ? GAMING_SCORE_ORDER
    : DEFAULT_SCORE_ORDER;
}

/** Renders the current-player area for the selected theme. */
function renderCurrentPlayer(
  theme: ThemeOption,
  player: Player,
): string {
  return theme === 'gaming'
    ? renderGamingCurrentPlayer(player)
    : renderCodeVibesCurrentPlayer(player);
}

/** Renders the Code Vibes current-player marker. */
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

/** Renders the Gaming current-player marker. */
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

/** Renders the exit-game button. */
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

/** Returns the Code Vibes marker for one player. */
function getPlayerMarker(player: Player): string {
  return player === 'orange' ? orangeMarkerUrl : blueMarkerUrl;
}

/** Returns the score marker for the selected theme. */
function getScoreMarker(
  theme: ThemeOption,
  player: Player,
): string {
  if (theme !== 'gaming') return getPlayerMarker(player);

  return player === 'orange'
    ? gamingOrangeMarkerUrl
    : gamingBlueMarkerUrl;
}

/** Renders one player's score. */
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
