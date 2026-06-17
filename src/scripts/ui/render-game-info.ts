import blueMarkerUrl from '../../assets/icons/player-marker-blue.svg';
import orangeMarkerUrl from '../../assets/icons/player-marker-orange.svg';
import exitButtonUrl from '../../assets/icons/exit.svg';

type Player = 'blue' | 'orange';

interface GameInfoSettings {
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
        ${renderScore('blue', blueMarkerUrl, bluePoints)}
        ${renderScore('orange', orangeMarkerUrl, orangePoints)}
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
        data-action="open-settings"
        aria-label="Exit game"
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

function renderScore(
  player: Player,
  markerUrl: string,
  points: number,
): string {
  return `
    <div class="game-info__score game-info__score--${player}">
      <img
        class="game-info__player-marker"
        src="${markerUrl}"
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
