export type GameTheme = 'code-vibes' | 'gaming' | 'da-projects' | 'foods';
export type PlayerColor = 'blue' | 'orange';
export type BoardSize = 16 | 24 | 36;

export interface GameSettings {
  theme: GameTheme;
  player: PlayerColor;
  boardSize: BoardSize;
}