type Player = 'blue' | 'orange';
type Scores = Record<Player, number>;
type Result = Player | 'draw';

export function renderGameOver(scores: Scores): string {
  const result = getResult(scores);

  return `
    <dialog
      class="game-over"
      aria-labelledby="game-over-title"
      aria-describedby="game-over-result"
    >
      <section class="game-over__panel">
        <h2 id="game-over-title" class="game-over__title">
          Game over
        </h2>

        <p
          id="game-over-result"
          class="game-over__result game-over__result--${result}"
        >
          ${getResultText(result)}
        </p>

        <p class="game-over__label">Final Score</p>

        <div class="game-over__score" aria-label="Final score">
          ${renderPlayerScore('blue', scores.blue)}
          ${renderPlayerScore('orange', scores.orange)}
        </div>

        <div class="game-over__actions">
          <button
            class="game-over__button game-over__button--primary"
            type="button"
            data-action="play-again"
          >
            Play again
          </button>

          <button
            class="game-over__button"
            type="button"
            data-action="back-to-settings"
          >
            Settings
          </button>
        </div>
      </section>
    </dialog>
  `;
}

function getResult(scores: Scores): Result {
  if (scores.blue === scores.orange) return 'draw';

  return scores.blue > scores.orange ? 'blue' : 'orange';
}

function getResultText(result: Result): string {
  if (result === 'draw') return "It's a draw!";

  const playerName =
    result.charAt(0).toUpperCase() + result.slice(1);

  return `${playerName} wins!`;
}

function renderPlayerScore(
  player: Player,
  score: number,
): string {
  const playerName =
    player.charAt(0).toUpperCase() + player.slice(1);

  return `
    <span class="game-over__player game-over__player--${player}">
      <span class="game-over__marker" aria-hidden="true"></span>
      <span>${playerName}</span>
      <strong>${score}</strong>
    </span>
  `;
}
