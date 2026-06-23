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

/**
 * Builds the transient Game Over dialog for the selected theme.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param scores - Current score values used to render or calculate the game result.
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns HTML markup or display text consumed by the caller.
 */
export function renderGameOver(
  scores: Scores,
  theme: ThemeOption,
): string {
  const result = getResult(scores);
  const assets = getGameOverAssets(theme);

  return renderGameOverDialog(scores, result, theme, assets);
}

/**
 * Builds the modal shell containing Game Over and final score content.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param scores - Current score values used to render or calculate the game result.
 * @param result - Computed final outcome used to choose labels, classes, or winner styling.
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @param assets - Theme-specific artwork consumed by the rendered result section.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Builds the themed Game Over title and score summary content.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param scores - Current score values used to render or calculate the game result.
 * @param result - Computed final outcome used to choose labels, classes, or winner styling.
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @param assets - Theme-specific artwork consumed by the rendered result section.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Builds one themed title image with supplied accessible text.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param className - CSS class applied to the generated title image.
 * @param source - Asset URL inserted into the rendered image markup.
 * @param alternativeText - Accessible text assigned to the rendered image when it is meaningful.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Selects the title artwork used by the Game Over dialog.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns Theme-specific artwork required by the Game Over dialog.
 */
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

/**
 * Builds the final score region with a screen-reader score label.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param scores - Current score values used to render or calculate the game result.
 * @param result - Computed final outcome used to choose labels, classes, or winner styling.
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Builds a readable score and winner announcement for assistive tech.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param scores - Current score values used to render or calculate the game result.
 * @param result - Computed final outcome used to choose labels, classes, or winner styling.
 * @returns HTML markup or display text consumed by the caller.
 */
function getScoreLabel(scores: Scores, result: Result): string {
  return `Blue ${scores.blue}, Orange ${scores.orange}. ${getResultText(result)}`;
}

/**
 * Builds both score values in the order expected by the theme.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param scores - Current score values used to render or calculate the game result.
 * @param result - Computed final outcome used to choose labels, classes, or winner styling.
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Returns the display order for final scores in the selected theme.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns Ordered player identifiers used while rendering score displays.
 */
function getScoreOrder(theme: ThemeOption): readonly Player[] {
  return theme === 'gaming'
    ? GAMING_SCORE_ORDER
    : CODE_VIBES_SCORE_ORDER;
}

/**
 * Compares final scores and returns the winning player or draw state.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param scores - Current score values used to render or calculate the game result.
 * @returns Final outcome identifier derived from the two player scores.
 */
function getResult(scores: Scores): Result {
  if (scores.blue === scores.orange) return 'draw';

  return scores.blue > scores.orange ? 'blue' : 'orange';
}

/**
 * Converts a result into text suitable for the score announcement.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param result - Computed final outcome used to choose labels, classes, or winner styling.
 * @returns HTML markup or display text consumed by the caller.
 */
function getResultText(result: Result): string {
  if (result === 'draw') return "It's a draw.";

  return `${capitalize(result)} wins.`;
}

/**
 * Builds a single final score entry using the active theme style.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @param player - Player identifier used to choose artwork, order, or score values.
 * @param score - Final score value displayed for one player.
 * @param result - Computed final outcome used to choose labels, classes, or winner styling.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Builds a Code Vibes final score entry and winner marker.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param player - Player identifier used to choose artwork, order, or score values.
 * @param score - Final score value displayed for one player.
 * @param result - Computed final outcome used to choose labels, classes, or winner styling.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Builds a Gaming final score entry with pawn artwork.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param player - Player identifier used to choose artwork, order, or score values.
 * @param score - Final score value displayed for one player.
 * @param result - Computed final outcome used to choose labels, classes, or winner styling.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Returns the CSS modifier when the supplied player won.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param player - Player identifier used to choose artwork, order, or score values.
 * @param result - Computed final outcome used to choose labels, classes, or winner styling.
 * @returns HTML markup or display text consumed by the caller.
 */
function getWinnerClass(player: Player, result: Result): string {
  return result === player ? ' is-winner' : '';
}

/**
 * Selects the Gaming pawn image associated with a player.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param player - Player identifier used to choose artwork, order, or score values.
 * @returns HTML markup or display text consumed by the caller.
 */
function getPawnUrl(player: Player): string {
  return player === 'orange' ? orangePawnUrl : bluePawnUrl;
}

/**
 * Formats a lowercase player value for visible result text.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param value - String value being validated or formatted for display.
 * @returns HTML markup or display text consumed by the caller.
 */
function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
