import type { GameSettings } from '../types/settings.types';

interface AppState {
  settings: GameSettings;
}

export const appState: AppState = {
  settings: {
    theme: 'code-vibes',
    player: 'blue',
    boardSize: 16,
  },
};
