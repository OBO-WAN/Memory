import codeVibesFinalScoreTitleUrl from '../../assets/images/game-over/final-score-title.svg';
import codeVibesGameOverTitleUrl from '../../assets/images/game-over/game-over-title.svg';
import gamingFinalScoreTitleUrl from '../../assets/images/game-over/game-theme/final-score-title.svg';
import gamingGameOverTitleUrl from '../../assets/images/game-over/game-theme/game-over-title.svg';
import bluePawnUrl from '../../assets/icons/chess-pawn-blue.svg';
import orangePawnUrl from '../../assets/icons/chess-pawn-orange.svg';

import type { ThemeOption } from './render-settings-screen';

type Player = 'blue' | 'orange';
type Scores = Record<Player, number>;
type Result = Player | 'draw';

interface GameOverAssets {
  finalScoreTitle: string;
  gameOverTitle: string;
}

export function renderGameOver(
  scores: Scores,
  theme: ThemeOption,
): string {
  const result = getResult(scores);
  const assets = getGameOverAssets(theme);

  return `
    <dialog
      class="game-over game-over--${theme}"
      aria-label="${getResultText(result)}"
    >
      <section class="game-over__content">
        <img
          class="game-over__title"
          src="${assets.gameOverTitle}"
          alt="Game over"
        />

        <div class="game-over__summary">
          <img
            class="game-over__final-score-title"
            src="${assets.finalScoreTitle}"
            alt="Final score"
          />

          ${renderScore(scores, result, theme)}
        </div>
      </section>
    </dialog>
  `;
}

function getGameOverAssets(theme: ThemeOption): GameOverAssets {
  if (theme === 'gaming') {
    return {
      finalScoreTitle: gamingFinalScoreTitleUrl,
      gameOverTitle: gamingGameOverTitleUrl,
    };
  }

  return {
    finalScoreTitle: codeVibesFinalScoreTitleUrl,
    gameOverTitle: codeVibesGameOverTitleUrl,
  };
}

function renderScore(
  scores: Scores,
  result: Result,
  theme: ThemeOption,
): string {
  const scoreContent =
    theme === 'gaming'
      ? renderGamingScore(scores, result)
      : renderCodeVibesScore(scores, result);

  return `
    <div
      class="game-over__score game-over__score--${theme}"
      aria-label="Blue ${scores.blue}, Orange ${scores.orange}. ${getResultText(result)}"
    >
      ${scoreContent}
    </div>
  `;
}

function renderCodeVibesScore(
  scores: Scores,
  result: Result,
): string {
  return `
    <div class="game-over__score-content">
      ${renderPlayerScore('blue', scores.blue, result)}
      ${renderPlayerScore('orange', scores.orange, result)}
    </div>
  `;
}

function renderGamingScore(
  scores: Scores,
  result: Result,
): string {
  return `
    <div class="game-over__score-content game-over__score-content--gaming">
      ${renderGamingPlayerScore('orange', scores.orange, result)}
      ${renderGamingPlayerScore('blue', scores.blue, result)}
    </div>
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

function renderGamingPlayerScore(
  player: Player,
  score: number,
  result: Result,
): string {
  const winnerClass = result === player ? ' is-winner' : '';

  return `
    <span
      class="game-over__player game-over__player--${player}${winnerClass}"
    >
      <img
        class="game-over__pawn"
        src="${getPawnUrl(player)}"
        alt=""
        aria-hidden="true"
      />
      <strong>${score}</strong>
    </span>
  `;
}

function getPawnUrl(player: Player): string {
  return player === 'orange' ? orangePawnUrl : bluePawnUrl;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
