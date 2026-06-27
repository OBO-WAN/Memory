import type { PlayerColor } from './settings.types';

/**
 * Stores the score belonging to each player.
 */
export type Scores = Record<PlayerColor, number>;

/**
 * Represents the result of a completed round or game.
 */
export type GameResult = PlayerColor | 'draw';
