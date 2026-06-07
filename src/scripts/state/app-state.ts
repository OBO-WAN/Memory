import type { GameSettings } from '../types/settings.types';

export const appState: { settings: GameSettings } = {
  settings: {
    theme: 'code-vibes',
    player: 'blue',
    boardSize: 16,
  },
};