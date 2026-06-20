import blueMarkerUrl from '../../assets/icons/player-marker-blue.svg';
import orangeMarkerUrl from '../../assets/icons/player-marker-orange.svg';
import exitButtonSvg from '../../assets/icons/exit.svg?raw';
import gamingBlueMarkerUrl from '../../assets/icons/chess-pawn-blue.svg';
import gamingOrangeMarkerUrl from '../../assets/icons/chess-pawn-orange.svg';
import gamingCurrentPlayerSvg from '../../assets/icons/game-theme/chess-pawn-blue.svg?raw';
import gamingCurrentPlayerTitleUrl from '../../assets/icons/game-theme/headline.svg';

import type { ThemeOption } from './render-settings-screen';

type Player = 'blue' | 'orange';

interface GameInfoSettings {
  theme: ThemeOption;
  player: Player;
  bluePoints?: number;
  orangePoints?: number;
}

export function renderGameInfo(settings: GameInfoSettings): string {
  const bluePoints = settings.bluePoints ?? 0;
  const orangePoints = settings.orangePoints ?? 0;

  return `
    <header class="game-info">
      <div class="game-info__points">
        ${renderScores(settings.theme, bluePoints, orangePoints)}
      </div>

      ${renderCurrentPlayer(settings.theme, settings.player)}
      ${renderExitButton()}
    </header>
  `;
}

function renderScores(
  theme: ThemeOption,
  bluePoints: number,
  orangePoints: number,
): string {
  const blueScore = renderScore(theme, 'blue', bluePoints);
  const orangeScore = renderScore(theme, 'orange', orangePoints);

  return theme === 'gaming'
    ? `${orangeScore}${blueScore}`
    : `${blueScore}${orangeScore}`;
}

function renderCurrentPlayer(
  theme: ThemeOption,
  player: Player,
): string {
  if (theme === 'gaming') return renderGamingCurrentPlayer(player);

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

function getPlayerMarker(player: Player): string {
  return player === 'orange' ? orangeMarkerUrl : blueMarkerUrl;
}

function getScoreMarker(
  theme: ThemeOption,
  player: Player,
): string {
  if (theme !== 'gaming') return getPlayerMarker(player);

  return player === 'orange'
    ? gamingOrangeMarkerUrl
    : gamingBlueMarkerUrl;
}

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
