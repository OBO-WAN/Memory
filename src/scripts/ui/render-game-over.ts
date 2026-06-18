import finalScoreTitleUrl from '../../assets/images/game-over/final-score-title.svg';
import gameOverTitleUrl from '../../assets/images/game-over/game-over-title.svg';

type Player = 'blue' | 'orange';
type Scores = Record<Player, number>;
type Result = Player | 'draw';

export function renderGameOver(scores: Scores): string {
  const result = getResult(scores);

  return `
    <dialog
      class="game-over"
      aria-label="${getResultText(result)}"
    >
      <section class="game-over__content">
        <img
          class="game-over__title"
          src="${gameOverTitleUrl}"
          alt="Game over"
        />

        <div class="game-over__summary">
          <img
            class="game-over__final-score-title"
            src="${finalScoreTitleUrl}"
            alt="Final score"
          />

          <div
            class="game-over__score"
            aria-label="Blue ${scores.blue}, Orange ${scores.orange}. ${getResultText(result)}"
          >
            <div class="game-over__score-content">
              ${renderPlayerScore('blue', scores.blue, result)}
              ${renderPlayerScore('orange', scores.orange, result)}
            </div>
          </div>
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
  if (result === 'draw') return "It's a draw.";

  return `${capitalize(result)} wins.`;
}

function renderPlayerScore(
  player: Player,
  score: number,
  result: Result,
): string {
  const winnerClass = result === player ? ' is-winner' : '';

  return `
    <span
      class="game-over__player game-over__player--${player}${winnerClass}"
    >
      <span class="game-over__marker" aria-hidden="true"></span>
      <span>${capitalize(player)}</span>
      <strong>${score}</strong>
    </span>
  `;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
