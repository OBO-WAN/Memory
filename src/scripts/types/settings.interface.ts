import type {
  BoardSize,
  GameTheme,
  PlayerColor,
} from './settings.types';

/**
 * Complete settings chosen before a game starts.
 *
 * Consumers rely on these fields to keep shared data shapes consistent across modules.
 */
export interface GameSettings {
  theme: GameTheme;
  player: PlayerColor;
  boardSize: BoardSize;
}