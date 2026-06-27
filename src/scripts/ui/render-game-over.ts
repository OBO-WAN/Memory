import bluePawnUrl from '../../assets/icons/chess-pawn-blue.svg';
import orangePawnUrl from '../../assets/icons/chess-pawn-orange.svg';
import codeVibesFinalScoreTitleUrl from '../../assets/images/game-over/final-score-title.svg';
import codeVibesGameOverTitleUrl from '../../assets/images/game-over/game-over-title.svg';
import gamingFinalScoreTitleUrl from '../../assets/images/game-over/game-theme/final-score-title.svg';
import gamingGameOverTitleUrl from '../../assets/images/game-over/game-theme/game-over-title.svg';
import { formatPlayerLabel } from '../utils/format-player-label';

import type { GameResult, Scores } from '../types/game.types';
import type { GameTheme, PlayerColor } from '../types/settings.types';

const CODE_VIBES_SCORE_ORDER = ['blue', 'orange'] as const;
const ORANGE_FIRST_SCORE_ORDER = ['orange', 'blue'] as const;

type ImageGameOverTheme = Exclude<GameTheme, 'da-projects'>;

interface GameOverAssets {
  finalScoreTitle: string;
  gameOverTitle: string;
}

/**
 * Builds the transient Game Over dialog for the selected theme.
 *
 * The final scores determine the accessible result announcement and the
 * winner styling shown before the dialog is dismissed.
 * @param scores - Final point totals for the blue and orange players.
 * @param theme - Active theme used to select titles, score order, and styling.
 * @returns Complete dialog markup for the finished game state.
 */
export function renderGameOver(
  scores: Scores,
  theme: GameTheme,
): string {
  const result = getResult(scores);

  return renderGameOverDialog(scores, result, theme);
}

/**
 * Builds the modal shell for the finished game state.
 *
 * The dialog receives a concise accessible label while the visible content
 * presents the theme-specific title and final score panel.
 * @param scores - Final point totals displayed inside the dialog.
 * @param result - Winning player or draw state derived from the scores.
 * @param theme - Active theme applied as a dialog modifier.
 * @returns Game Over dialog markup for the selected theme.
 */
function renderGameOverDialog(
  scores: Scores,
  result: GameResult,
  theme: GameTheme,
): string {
  return `
    <dialog
      class="game-over game-over--${theme}"
      aria-label="Game over. ${getResultText(result)}"
    >
      ${renderGameOverContent(scores, result, theme)}
    </dialog>
  `;
}

/**
 * Builds the visible title and score summary inside the dialog.
 *
 * DA Projects uses live text for its headings, while the existing themes keep
 * their supplied title artwork.
 * @param scores - Final point totals rendered in the score panel.
 * @param result - Winning player or draw state used for winner styling.
 * @param theme - Active theme used to select the presentation.
 * @returns Content section containing the title and final score.
 */
function renderGameOverContent(
  scores: Scores,
  result: GameResult,
  theme: GameTheme,
): string {
  return `
    <section class="game-over__content">
      ${renderGameOverTitle(theme)}

      <div class="game-over__summary">
        ${renderFinalScoreTitle(theme)}
        ${renderScore(scores, result, theme)}
      </div>
    </section>
  `;
}

/**
 * Builds the main Game Over heading for the active theme.
 *
 * DA Projects renders semantic text so its Figtree typography can be styled
 * responsively without introducing another image asset.
 * @param theme - Active theme whose heading should be rendered.
 * @returns Text or image markup for the main Game Over heading.
 */
function renderGameOverTitle(theme: GameTheme): string {
  if (theme === 'da-projects') {
    return `
      <h2 class="game-over__title game-over__title--text">
        GAME OVER
      </h2>
    `;
  }

  const assets = getGameOverAssets(theme);

  return renderTitleImage(
    'game-over__title',
    assets.gameOverTitle,
    'Game over',
  );
}

/**
 * Builds the label placed immediately above the final score panel.
 *
 * DA Projects uses visible text, while Code Vibes and Gaming retain their
 * original exported artwork.
 * @param theme - Active theme whose score label should be rendered.
 * @returns Text or image markup for the final-score label.
 */
function renderFinalScoreTitle(theme: GameTheme): string {
  if (theme === 'da-projects') {
    return `
      <p
        class="game-over__final-score-title
          game-over__final-score-title--text"
      >
        Final score
      </p>
    `;
  }

  const assets = getGameOverAssets(theme);

  return renderTitleImage(
    'game-over__final-score-title',
    assets.finalScoreTitle,
    'Final score',
  );
}

/**
 * Builds a supplied title image with meaningful alternative text.
 * @param className - CSS class used to size the selected title artwork.
 * @param source - Imported asset URL inserted into the image element.
 * @param alternativeText - Accessible title announced instead of the artwork.
 * @returns Image markup for a theme-specific dialog title.
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
 * Selects the exported title artwork for an image-based theme.
 *
 * @param theme - Active image-based theme used to choose the title assets.
 * @returns Imported Game Over and final-score title URLs.
 */
function getGameOverAssets(
  theme: ImageGameOverTheme,
): GameOverAssets {
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
 * Builds the final score panel and its accessible result announcement.
 *
 * The visible score children are hidden from assistive technology because the
 * surrounding group already provides the complete score and winner text.
 * @param scores - Final point totals shown for both players.
 * @param result - Winning player or draw state included in the announcement.
 * @param theme - Active theme used for score ordering and artwork.
 * @returns Accessible final-score group markup.
 */
function renderScore(
  scores: Scores,
  result: GameResult,
  theme: GameTheme,
): string {
  return `
    <div
      class="game-over__score game-over__score--${theme}"
      role="group"
      aria-label="${getScoreLabel(scores, result)}"
    >
      <div class="game-over__score-content" aria-hidden="true">
        ${renderScoreContent(scores, result, theme)}
      </div>
    </div>
  `;
}

/**
 * Builds a complete spoken summary of both scores and the result.
 * @param scores - Final point totals for the blue and orange players.
 * @param result - Winning player or draw state announced after the totals.
 * @returns Accessible score and winner sentence.
 */
function getScoreLabel(scores: Scores, result: GameResult): string {
  return `Blue ${scores.blue}, Orange ${scores.orange}. ${getResultText(result)}`;
}

/**
 * Joins both visual score entries in the order required by the theme.
 *
 * Gaming and DA Projects place orange first to match their Figma layouts;
 * other themes retain the original blue-first order.
 * @param scores - Final point totals mapped by player.
 * @param result - Winning player or draw state used for winner modifiers.
 * @param theme - Active theme used to select order and score artwork.
 * @returns Visual score entries for both players.
 */
function renderScoreContent(
  scores: Scores,
  result: GameResult,
  theme: GameTheme,
): string {
  return getScoreOrder(theme)
    .map((player) =>
      renderPlayerScore(theme, player, scores[player], result),
    )
    .join('');
}

/**
 * Selects the visual player order used by the active theme.
 * @param theme - Active theme whose final-score order should be returned.
 * @returns Read-only player sequence used while rendering the score panel.
 */
function getScoreOrder(theme: GameTheme): readonly PlayerColor[] {
  return theme === 'gaming' || theme === 'da-projects'
    ? ORANGE_FIRST_SCORE_ORDER
    : CODE_VIBES_SCORE_ORDER;
}

/**
 * Compares the final scores and identifies the game outcome.
 * @param scores - Final point totals for both players.
 * @returns The winning player, or `draw` when the totals are equal.
 */
function getResult(scores: Scores): GameResult {
  if (scores.blue === scores.orange) return 'draw';

  return scores.blue > scores.orange ? 'blue' : 'orange';
}

/**
 * Converts a game result into a concise accessible announcement.
 * @param result - Winning player or draw state to describe.
 * @returns Human-readable result sentence.
 */
function getResultText(result: GameResult): string {
  if (result === 'draw') return "It's a draw.";

  return `${formatPlayerLabel(result)} wins.`;
}

/**
 * Builds one score entry using the presentation required by the theme.
 *
 * Gaming and DA Projects use pawn artwork, while Code Vibes retains its
 * labelled marker style.
 *
 * @param theme - Active theme used to choose the score presentation.
 * @param player - Player represented by the score entry.
 * @param score - Final point total displayed for the player.
 * @param result - Game result used to apply the winner modifier.
 * @returns One visual player-score entry.
 */
function renderPlayerScore(
  theme: GameTheme,
  player: PlayerColor,
  score: number,
  result: GameResult,
): string {
  return usesPawnScores(theme)
    ? renderPawnPlayerScore(player, score, result)
    : renderCodeVibesPlayerScore(player, score, result);
}

/**
 * Determines whether a theme displays pawn-based score entries.
 * @param theme - Active theme being evaluated.
 * @returns `true` for Gaming and DA Projects score presentations.
 */
function usesPawnScores(theme: GameTheme): boolean {
  return theme === 'gaming' || theme === 'da-projects';
}

/**
 * Builds a labelled Code Vibes score entry with its directional marker.
 * @param player - Player represented by the entry.
 * @param score - Final point total displayed for the player.
 * @param result - Game result used to identify the winner.
 * @returns Labelled score markup for one player.
 */
function renderCodeVibesPlayerScore(
  player: PlayerColor,
  score: number,
  result: GameResult,
): string {
  return `
    <span
      class="game-over__player
        game-over__player--${player}${getWinnerClass(player, result)}"
    >
      <span class="game-over__marker"></span>
      <span>${formatPlayerLabel(player)}</span>
      <strong>${score}</strong>
    </span>
  `;
}

/**
 * Builds a compact pawn-and-value score entry.
 *
 * The same semantic-free visual structure is shared by Gaming and DA Projects
 * because the parent score group supplies the accessible announcement.
 * @param player - Player whose pawn artwork should be displayed.
 * @param score - Final point total displayed beside the pawn.
 * @param result - Game result used to identify the winner.
 * @returns Pawn-based score markup for one player.
 */
function renderPawnPlayerScore(
  player: PlayerColor,
  score: number,
  result: GameResult,
): string {
  return `
    <span
      class="game-over__player
        game-over__player--${player}${getWinnerClass(player, result)}"
    >
      <img
        class="game-over__pawn"
        src="${getPawnUrl(player)}"
        alt=""
      />
      <strong>${score}</strong>
    </span>
  `;
}

/**
 * Returns the winner modifier for the supplied player.
 * @param player - Player whose result should be checked.
 * @param result - Winning player or draw state.
 * @returns Winner class suffix, or an empty string when not applicable.
 */
function getWinnerClass(player: PlayerColor, result: GameResult): string {
  return result === player ? ' is-winner' : '';
}

/**
 * Selects the pawn image associated with a player.
 * @param player - Player whose pawn artwork is required.
 * @returns Imported orange or blue pawn asset URL.
 */
function getPawnUrl(player: PlayerColor): string {
  return player === 'orange' ? orangePawnUrl : bluePawnUrl;
}
