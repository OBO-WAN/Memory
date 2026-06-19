import blueMarkerUrl from '../../assets/icons/player-marker-blue.svg';
import orangeMarkerUrl from '../../assets/icons/player-marker-orange.svg';
import exitButtonUrl from '../../assets/icons/exit.svg';
import gamingBlueMarkerUrl from '../../assets/icons/chess-pawn-blue.svg';
import gamingOrangeMarkerUrl from '../../assets/icons/chess-pawn-orange.svg';

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
  const currentPlayerMarker = getPlayerMarker(settings.player);

  return `
    <header class="game-info">
      <div class="game-info__points">
        ${renderScore(
          'blue',
          getScoreMarker(settings.theme, 'blue'),
          blueMarkerUrl,
          bluePoints,
        )}
        ${renderScore(
          'orange',
          getScoreMarker(settings.theme, 'orange'),
          orangeMarkerUrl,
          orangePoints,
        )}
      </div>

      <div class="game-info__current-player">
        <span>Current player:</span>
        <img
          class="game-info__current-marker"
          src="${currentPlayerMarker}"
          alt="${settings.player} player"
        />
      </div>

      <button
        class="game-info__exit"
        type="button"
        data-action="open-exit-dialog"
        aria-label="Exit game"
        aria-haspopup="dialog"
      >
        <img
          class="game-info__exit-image"
          src="${exitButtonUrl}"
          alt=""
          aria-hidden="true"
        />
      </button>
    </header>
  `;
}

function getPlayerMarker(player: Player): string {
  return player === 'orange' ? orangeMarkerUrl : blueMarkerUrl;
}

function getScoreMarker(
  theme: ThemeOption,
  player: Player,
): string {
  if (theme !== 'gaming') {
    return getPlayerMarker(player);
  }

  return player === 'orange'
    ? gamingOrangeMarkerUrl
    : gamingBlueMarkerUrl;
}

function renderScore(
  player: Player,
  scoreMarkerUrl: string,
  stateMarkerUrl: string,
  points: number,
): string {
  return `
    <div class="game-info__score game-info__score--${player}">
      <img
        class="game-info__score-marker"
        src="${scoreMarkerUrl}"
        alt=""
        aria-hidden="true"
      />

      <img
        class="game-info__player-marker"
        src="${stateMarkerUrl}"
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
