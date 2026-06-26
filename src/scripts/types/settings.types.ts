/**
 * Theme identifiers supported by the game settings flow.
 *
 * This keeps supported values explicit wherever the option is passed between modules.
 */
export type GameTheme = 'code-vibes' | 'gaming' | 'da-projects';

/**
 * Player colors that can start the first turn.
 *
 * This keeps supported values explicit wherever the option is passed between modules.
 */
export type PlayerColor = 'blue' | 'orange';

/**
 * Supported card counts for the game board.
 *
 * This keeps supported values explicit wherever the option is passed between modules.
 */
export type BoardSize = 16 | 24 | 36;

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
