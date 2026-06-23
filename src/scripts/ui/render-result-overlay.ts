import backButtonUrl from '../../assets/images/result-overlay/back-button.svg';
import codeVibesBluePlayerTitleUrl from '../../assets/images/result-overlay/blue-player.svg';
import codeVibesConfettiUrl from '../../assets/images/result-overlay/confetti.svg';
import codeVibesDrawTitleUrl from '../../assets/images/result-overlay/draw-green.svg';
import codeVibesItsATitleUrl from '../../assets/images/result-overlay/its-a.svg';
import codeVibesOrangePlayerTitleUrl from '../../assets/images/result-overlay/orange-player.svg';
import codeVibesBluePlayerIconUrl from '../../assets/images/result-overlay/player-blue.svg';
import codeVibesOrangePlayerIconUrl from '../../assets/images/result-overlay/player.svg';
import codeVibesScaleIconUrl from '../../assets/images/result-overlay/scale-icon.svg';
import codeVibesWinnerTitleUrl from '../../assets/images/result-overlay/winner-title.svg';
import gamingBluePlayerTitleUrl from '../../assets/images/result-overlay/game-theme/blue-player.svg';
import gamingDrawTitleUrl from '../../assets/images/result-overlay/game-theme/draw.svg';
import gamingItsATitleUrl from '../../assets/images/result-overlay/game-theme/its-a.svg';
import gamingOrangePlayerTitleUrl from '../../assets/images/result-overlay/game-theme/orange-player.svg';
import gamingScaleIconUrl from '../../assets/images/result-overlay/game-theme/scale-icon.svg';
import gamingTrophyUrl from '../../assets/images/result-overlay/game-theme/trophy.svg';
import gamingWinnerTitleUrl from '../../assets/images/result-overlay/game-theme/winner-title.svg';

import type { ThemeOption } from './render-settings-screen';

type Player = 'blue' | 'orange';
type Scores = Record<Player, number>;
type Result = Player | 'draw';

interface WinnerAssets {
  playerIcon?: string;
  playerTitle: string;
  winnerTitle: string;
}

interface DrawAssets {
  eyebrowTitle: string;
  mainTitle: string;
  scaleIcon: string;
}

/**
 * Builds the final modal overlay for the winning player or draw.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param scores - Current score values used to render or calculate the game result.
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns HTML markup or display text consumed by the caller.
 */
export function renderResultOverlay(
  scores: Scores,
  theme: ThemeOption,
): string {
  const result = getResult(scores);

  return `
    <dialog
      class="result-overlay result-overlay--${theme} result-overlay--${result}"
      aria-labelledby="result-overlay-title"
    >
      ${renderResult(result, theme)}
      ${renderBackButton()}
    </dialog>
  `;
}

/**
 * Chooses the winner or draw layout for the computed result.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param result - Computed final outcome used to choose labels, classes, or winner styling.
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderResult(
  result: Result,
  theme: ThemeOption,
): string {
  if (result === 'draw') return renderDrawResult(theme);

  return renderWinnerResult(result, theme);
}

/**
 * Builds the themed winner announcement for one player.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param winner - Winning player used to select artwork and accessible labels.
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderWinnerResult(
  winner: Player,
  theme: ThemeOption,
): string {
  const assets = getWinnerAssets(winner, theme);

  return theme === 'gaming'
    ? renderGamingWinner(assets, winner)
    : renderCodeVibesWinner(assets, winner);
}

/**
 * Selects the title and player artwork for a winner announcement.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param winner - Winning player used to select artwork and accessible labels.
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns Theme-specific artwork required to announce the winner.
 */
function getWinnerAssets(
  winner: Player,
  theme: ThemeOption,
): WinnerAssets {
  return theme === 'gaming'
    ? getGamingWinnerAssets(winner)
    : getCodeVibesWinnerAssets(winner);
}

/**
 * Selects the Code Vibes artwork for the winning player.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param winner - Winning player used to select artwork and accessible labels.
 * @returns Theme-specific artwork required to announce the winner.
 */
function getCodeVibesWinnerAssets(
  winner: Player,
): WinnerAssets {
  return {
    playerIcon: getCodeVibesPlayerIcon(winner),
    playerTitle: getCodeVibesPlayerTitle(winner),
    winnerTitle: codeVibesWinnerTitleUrl,
  };
}

/**
 * Selects the Gaming title artwork for the winning player.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param winner - Winning player used to select artwork and accessible labels.
 * @returns Theme-specific artwork required to announce the winner.
 */
function getGamingWinnerAssets(
  winner: Player,
): WinnerAssets {
  return {
    playerTitle: getGamingPlayerTitle(winner),
    winnerTitle: gamingWinnerTitleUrl,
  };
}

/**
 * Builds the Code Vibes winner layout with confetti and player icon.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param assets - Theme-specific artwork consumed by the rendered result section.
 * @param winner - Winning player used to select artwork and accessible labels.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderCodeVibesWinner(
  assets: WinnerAssets,
  winner: Player,
): string {
  return `
    <img
      class="result-overlay__confetti"
      src="${codeVibesConfettiUrl}"
      alt=""
      aria-hidden="true"
    />

    <section class="result-overlay__content">
      ${renderWinnerTitle(assets.winnerTitle)}
      ${renderWinnerName(assets.playerTitle, winner)}
      ${renderPlayerIcon(assets.playerIcon)}
    </section>
  `;
}

/**
 * Builds the Gaming winner layout with themed title artwork.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param assets - Theme-specific artwork consumed by the rendered result section.
 * @param winner - Winning player used to select artwork and accessible labels.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderGamingWinner(
  assets: WinnerAssets,
  winner: Player,
): string {
  return `
    <section
      class="result-overlay__content result-overlay__content--gaming-winner"
    >
      ${renderWinnerTitle(
        assets.winnerTitle,
        ' result-overlay__winner-title--gaming',
      )}
      ${renderWinnerName(assets.playerTitle, winner)}

      <img
        class="result-overlay__trophy"
        src="${gamingTrophyUrl}"
        alt=""
        aria-hidden="true"
      />
    </section>
  `;
}

/**
 * Builds the decorative winner-title image with an optional modifier.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param source - Asset URL inserted into the rendered image markup.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderWinnerTitle(
  source: string,
  modifierClass = '',
): string {
  return `
    <img
      class="result-overlay__winner-title${modifierClass}"
      src="${source}"
      alt="The winner is"
    />
  `;
}

/**
 * Builds the accessible image naming the winning player.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param source - Asset URL inserted into the rendered image markup.
 * @param winner - Winning player used to select artwork and accessible labels.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderWinnerName(
  source: string,
  winner: Player,
): string {
  return `
    <img
      id="result-overlay-title"
      class="result-overlay__winner-name-image"
      src="${source}"
      alt="${capitalize(winner)} player"
    />
  `;
}

/**
 * Builds the Code Vibes winner icon when that asset exists.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param source - Asset URL inserted into the rendered image markup.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderPlayerIcon(source?: string): string {
  if (!source) return '';

  return `
    <img
      class="result-overlay__player-icon"
      src="${source}"
      alt=""
      aria-hidden="true"
    />
  `;
}

/**
 * Selects the Code Vibes title image for the winning player.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param winner - Winning player used to select artwork and accessible labels.
 * @returns HTML markup or display text consumed by the caller.
 */
function getCodeVibesPlayerTitle(winner: Player): string {
  return winner === 'orange'
    ? codeVibesOrangePlayerTitleUrl
    : codeVibesBluePlayerTitleUrl;
}

/**
 * Selects the Code Vibes icon image for the winning player.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param winner - Winning player used to select artwork and accessible labels.
 * @returns HTML markup or display text consumed by the caller.
 */
function getCodeVibesPlayerIcon(winner: Player): string {
  return winner === 'orange'
    ? codeVibesOrangePlayerIconUrl
    : codeVibesBluePlayerIconUrl;
}

/**
 * Selects the Gaming title image for the winning player.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param winner - Winning player used to select artwork and accessible labels.
 * @returns HTML markup or display text consumed by the caller.
 */
function getGamingPlayerTitle(winner: Player): string {
  return winner === 'orange'
    ? gamingOrangePlayerTitleUrl
    : gamingBluePlayerTitleUrl;
}

/**
 * Builds the draw layout using assets for the active theme.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderDrawResult(theme: ThemeOption): string {
  const assets = getDrawAssets(theme);
  const modifierClass = getDrawModifierClass(theme);

  return renderDrawContent(assets, modifierClass);
}

/**
 * Selects title and icon assets for a draw result.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns Theme-specific artwork required to announce a draw.
 */
function getDrawAssets(theme: ThemeOption): DrawAssets {
  if (theme === 'gaming') {
    return {
      eyebrowTitle: gamingItsATitleUrl,
      mainTitle: gamingDrawTitleUrl,
      scaleIcon: gamingScaleIconUrl,
    };
  }

  return {
    eyebrowTitle: codeVibesItsATitleUrl,
    mainTitle: codeVibesDrawTitleUrl,
    scaleIcon: codeVibesScaleIconUrl,
  };
}

/**
 * Returns the extra draw-layout modifier required by the Gaming theme.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns HTML markup or display text consumed by the caller.
 */
function getDrawModifierClass(theme: ThemeOption): string {
  return theme === 'gaming'
    ? ' result-overlay__content--gaming-draw'
    : '';
}

/**
 * Builds the shared draw result layout with theme-specific modifiers.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param assets - Theme-specific artwork consumed by the rendered result section.
 * @param modifierClass - Optional CSS modifier appended to generated markup.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderDrawContent(
  assets: DrawAssets,
  modifierClass: string,
): string {
  return `
    <section
      class="result-overlay__content result-overlay__content--draw${modifierClass}"
    >
      ${renderDrawTitleImages(assets)}
      ${renderScaleIcon(assets.scaleIcon)}
    </section>
  `;
}

/**
 * Builds the accessible title images used by the draw result.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param assets - Theme-specific artwork consumed by the rendered result section.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderDrawTitleImages(assets: DrawAssets): string {
  return `
    <img
      class="result-overlay__draw-eyebrow"
      src="${assets.eyebrowTitle}"
      alt="It’s a"
    />

    <img
      id="result-overlay-title"
      class="result-overlay__draw-title"
      src="${assets.mainTitle}"
      alt="Draw"
    />
  `;
}

/**
 * Builds the decorative scale icon shown for a draw.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param source - Asset URL inserted into the rendered image markup.
 * @returns HTML markup or display text consumed by the caller.
 */
function renderScaleIcon(source: string): string {
  return `
    <img
      class="result-overlay__scale-icon"
      src="${source}"
      alt=""
      aria-hidden="true"
    />
  `;
}

/**
 * Builds the result action that returns the user to the start screen.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @returns HTML markup or display text consumed by the caller.
 */
function renderBackButton(): string {
  return `
    <button
      class="result-overlay__back-button"
      type="button"
      data-action="back-to-start"
      aria-label="Back to start"
    >
      <img src="${backButtonUrl}" alt="" aria-hidden="true" />
    </button>
  `;
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
