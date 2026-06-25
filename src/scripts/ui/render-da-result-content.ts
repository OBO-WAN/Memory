import daBluePawnUrl from '../../assets/images/result-overlay/da-theme/blue-pawn.svg';
import daBluePlayerTitleUrl from '../../assets/images/result-overlay/da-theme/blue-player-title.svg';
import daDrawScaleUrl from '../../assets/images/result-overlay/da-theme/draw-scales.svg';
import daDrawTitleUrl from '../../assets/images/result-overlay/da-theme/draw-title.svg';
import daHomeButtonUrl from '../../assets/images/result-overlay/da-theme/home-button.svg';
import daItsATitleUrl from '../../assets/images/result-overlay/da-theme/It-s-a-title.svg';
import daOrangePawnUrl from '../../assets/images/result-overlay/da-theme/orange-pawn.svg';
import daOrangePlayerTitleUrl from '../../assets/images/result-overlay/da-theme/orange-player-title.svg';
import daWinnerTitleUrl from '../../assets/images/result-overlay/da-theme/winner-title.svg';

type Player = 'blue' | 'orange';

/**
 * Exposes the DA Projects Home button used by the shared result dialog.
 */
export const DA_HOME_BUTTON_URL = daHomeButtonUrl;

/**
 * Builds the DA Projects winner layout with the selected pawn.
 *
 * @param winner - Player announced as the winner.
 * @returns DA Projects winner markup.
 */
export function renderDaWinnerResult(winner: Player): string {
  return `
    <section
      class="result-overlay__content result-overlay__content--da-winner"
    >
      <img
        class="result-overlay__winner-title
          result-overlay__winner-title--da"
        src="${daWinnerTitleUrl}"
        alt="The winner is"
      />

      <img
        id="result-overlay-title"
        class="result-overlay__winner-name-image"
        src="${getPlayerTitle(winner)}"
        alt="${capitalize(winner)} player"
      />

      <img
        class="result-overlay__da-pawn"
        src="${getPlayerPawn(winner)}"
        alt=""
      />
    </section>
  `;
}

/**
 * Builds the DA Projects draw layout from its exported artwork.
 *
 * @returns DA Projects draw-result markup.
 */
export function renderDaDrawResult(): string {
  return `
    <section
      class="result-overlay__content
        result-overlay__content--draw
        result-overlay__content--da-draw"
    >
      <img
        class="result-overlay__draw-eyebrow"
        src="${daItsATitleUrl}"
        alt="It’s a"
      />

      <img
        id="result-overlay-title"
        class="result-overlay__draw-title"
        src="${daDrawTitleUrl}"
        alt="Draw"
      />

      <img
        class="result-overlay__scale-icon"
        src="${daDrawScaleUrl}"
        alt=""
      />
    </section>
  `;
}

/**
 * Selects the DA Projects player-title image.
 *
 * @param winner - Player whose title is required.
 * @returns Matching player-title URL.
 */
function getPlayerTitle(winner: Player): string {
  return winner === 'orange'
    ? daOrangePlayerTitleUrl
    : daBluePlayerTitleUrl;
}

/**
 * Selects the DA Projects pawn image.
 *
 * @param winner - Player whose pawn is required.
 * @returns Matching pawn URL.
 */
function getPlayerPawn(winner: Player): string {
  return winner === 'orange' ? daOrangePawnUrl : daBluePawnUrl;
}

/**
 * Formats a player identifier for accessible text.
 *
 * @param value - Player value to capitalize.
 * @returns Value with its first character capitalized.
 */
function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
