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

import type { GameTheme, PlayerColor } from '../types/settings.types';

export interface WinnerAssets {
  playerIcon?: string;
  playerTitle: string;
  winnerTitle: string;
}

export interface DrawAssets {
  eyebrowTitle: string;
  mainTitle: string;
  scaleIcon: string;
}

/** Decorative confetti used by the Code Vibes winner layout. */
export const CODE_VIBES_CONFETTI_URL = codeVibesConfettiUrl;

/** Trophy artwork used by the Gaming winner layout. */
export const GAMING_TROPHY_URL = gamingTrophyUrl;

/**
 * Selects winner artwork for Code Vibes or Gaming.
 * @param winner - Player whose artwork is required.
 * @param theme - Theme used to choose the asset set.
 * @returns Artwork consumed by the shared winner renderer.
 */
export function getStandardWinnerAssets(
  winner: PlayerColor,
  theme: GameTheme,
): WinnerAssets {
  if (theme === 'gaming') {
    return {
      playerTitle: getGamingPlayerTitle(winner),
      winnerTitle: gamingWinnerTitleUrl,
    };
  }

  return {
    playerIcon: getCodeVibesPlayerIcon(winner),
    playerTitle: getCodeVibesPlayerTitle(winner),
    winnerTitle: codeVibesWinnerTitleUrl,
  };
}

/**
 * Selects draw artwork for Code Vibes or Gaming.
 * @param theme - Theme used to choose the asset set.
 * @returns Artwork consumed by the shared draw renderer.
 */
export function getStandardDrawAssets(
  theme: GameTheme,
): DrawAssets {
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
 * Selects the Code Vibes player-title image.
 * @param winner - Player whose title is required.
 * @returns Matching player-title URL.
 */
function getCodeVibesPlayerTitle(winner: PlayerColor): string {
  return winner === 'orange'
    ? codeVibesOrangePlayerTitleUrl
    : codeVibesBluePlayerTitleUrl;
}

/**
 * Selects the Code Vibes player-icon image.
 * @param winner - Player whose icon is required.
 * @returns Matching player-icon URL.
 */
function getCodeVibesPlayerIcon(winner: PlayerColor): string {
  return winner === 'orange'
    ? codeVibesOrangePlayerIconUrl
    : codeVibesBluePlayerIconUrl;
}

/**
 * Selects the Gaming player-title image.
 * @param winner - Player whose title is required.
 * @returns Matching player-title URL.
 */
function getGamingPlayerTitle(winner: PlayerColor): string {
  return winner === 'orange'
    ? gamingOrangePlayerTitleUrl
    : gamingBluePlayerTitleUrl;
}
