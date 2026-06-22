import bluePawnUrl from '../../assets/icons/chess-pawn-blue.svg';
import orangePawnUrl from '../../assets/icons/chess-pawn-orange.svg';
import codeVibesFinalScoreTitleUrl from '../../assets/images/game-over/final-score-title.svg';
import codeVibesGameOverTitleUrl from '../../assets/images/game-over/game-over-title.svg';
import gamingFinalScoreTitleUrl from '../../assets/images/game-over/game-theme/final-score-title.svg';
import gamingGameOverTitleUrl from '../../assets/images/game-over/game-theme/game-over-title.svg';

import type { ThemeOption } from './render-settings-screen';

const CODE_VIBES_SCORE_ORDER = ['blue', 'orange'] as const;
const GAMING_SCORE_ORDER = ['orange', 'blue'] as const;

type Player = 'blue' | 'orange';
type Scores = Record<Player, number>;
type Result = Player | 'draw';

interface GameOverAssets {
  finalScoreTitle: string;
  gameOverTitle: string;
}

/** Renders the Game Over dialog for the selected theme. */
export function renderGameOver(
  scores: Scores,
  theme: ThemeOption,
): string {
  const result = getResult(scores);
  const assets = getGameOverAssets(theme);

  return renderGameOverDialog(scores, result, theme, assets);
}

/** Renders the complete Game Over dialog markup. */
function renderGameOverDialog(
  scores: Scores,
  result: Result,
  theme: ThemeOption,
  assets: GameOverAssets,
): string {
  return `
    <dialog
      class="game-over game-over--${theme}"
      aria-label="${getResultText(result)}"
    >
      ${renderGameOverContent(scores, result, theme, assets)}
    </dialog>
  `;
}

/** Renders the title and final score content. */
function renderGameOverContent(
  scores: Scores,
  result: Result,
  theme: ThemeOption,
  assets: GameOverAssets,
): string {
  return `
    <section class="game-over__content">
      ${renderTitleImage(
        'game-over__title',
        assets.gameOverTitle,
        'Game over',
      )}

      <div class="game-over__summary">
        ${renderTitleImage(
          'game-over__final-score-title',
          assets.finalScoreTitle,
          'Final score',
        )}
        ${renderScore(scores, result, theme)}
      </div>
    </section>
  `;
}

/** Renders one decorative title image. */
function renderTitleImage(
  className: string,
  source: string,
  alternativeText: string,
): string {
  return `
    <img
      class="${className}"
      src="${source}"
      alt="${alternativeText}"
    />
  `;
}

/** Returns the Game Over assets for the selected theme. */
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

/** Renders the accessible final score container. */
function renderScore(
  scores: Scores,
  result: Result,
  theme: ThemeOption,
): string {
  return `
    <div
      class="game-over__score game-over__score--${theme}"
      aria-label="${getScoreLabel(scores, result)}"
    >
      ${renderScoreContent(scores, result, theme)}
    </div>
  `;
}

/** Returns the accessible final score label. */
function getScoreLabel(scores: Scores, result: Result): string {
  return `Blue ${scores.blue}, Orange ${scores.orange}. ${getResultText(result)}`;
}

/** Renders both player scores in theme-specific order. */
function renderScoreContent(
  scores: Scores,
  result: Result,
  theme: ThemeOption,
): string {
  const modifier = theme === 'gaming'
    ? ' game-over__score-content--gaming'
    : '';
  const playerScores = getScoreOrder(theme)
    .map((player) => renderPlayerScore(theme, player, scores[player], result))
    .join('');

  return `
    <div class="game-over__score-content${modifier}">
      ${playerScores}
    </div>
  `;
}

/** Returns the player order used by the selected theme. */
function getScoreOrder(theme: ThemeOption): readonly Player[] {
  return theme === 'gaming'
    ? GAMING_SCORE_ORDER
    : CODE_VIBES_SCORE_ORDER;
}

/** Returns the winning player or a draw result. */
function getResult(scores: Scores): Result {
  if (scores.blue === scores.orange) return 'draw';

  return scores.blue > scores.orange ? 'blue' : 'orange';
}

/** Returns a readable result announcement. */
function getResultText(result: Result): string {
  if (result === 'draw') return "It's a draw.";

  return `${capitalize(result)} wins.`;
}

/** Renders one player's final score. */
function renderPlayerScore(
  theme: ThemeOption,
  player: Player,
  score: number,
  result: Result,
): string {
  return theme === 'gaming'
    ? renderGamingPlayerScore(player, score, result)
    : renderCodeVibesPlayerScore(player, score, result);
}

/** Renders one Code Vibes player score. */
function renderCodeVibesPlayerScore(
  player: Player,
  score: number,
  result: Result,
): string {
  return `
    <span
      class="game-over__player game-over__player--${player}${getWinnerClass(player, result)}"
    >
      <span class="game-over__marker" aria-hidden="true"></span>
      <span>${capitalize(player)}</span>
      <strong>${score}</strong>
    </span>
  `;
}

/** Renders one Gaming player score. */
function renderGamingPlayerScore(
  player: Player,
  score: number,
  result: Result,
): string {
  return `
    <span
      class="game-over__player game-over__player--${player}${getWinnerClass(player, result)}"
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

/** Returns the winner modifier for one player. */
function getWinnerClass(player: Player, result: Result): string {
  return result === player ? ' is-winner' : '';
}

/** Returns the Gaming pawn image for one player. */
function getPawnUrl(player: Player): string {
  return player === 'orange' ? orangePawnUrl : bluePawnUrl;
}

/** Capitalizes the first character of a value. */
function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
