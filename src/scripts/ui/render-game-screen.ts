import type { ThemeOption } from './render-settings-screen';
import { renderGameInfo } from './render-game-info';

interface GameScreenSettings {
  theme: ThemeOption;
  player: string;
  boardSize: number;
}

export function renderGameScreen(settings: GameScreenSettings): string {
  const cards = createCardNumbers(settings.boardSize);
  const currentPlayer = getCurrentPlayer(settings.player);

  return `
    <main class="game-screen game-screen--${settings.theme}">
      ${renderGameInfo({
        player: currentPlayer,
      })}

      <section
        class="game-board game-board--${settings.boardSize}"
        aria-label="Memory cards"
      >
        ${cards.map(renderGameCard).join('')}
      </section>
    </main>
  `;
}

function createCardNumbers(boardSize: number): number[] {
  return Array.from(
    { length: boardSize },
    (_, index) => index + 1,
  );
}

function getCurrentPlayer(player: string): 'blue' | 'orange' {
  return player === 'orange' ? 'orange' : 'blue';
}

function renderGameCard(card: number): string {
  return `
    <button
      class="game-card"
      type="button"
      data-card="${card}"
      aria-label="Card ${card}"
    >
      <span class="game-card__icon">&lt;/&gt;</span>
    </button>
  `;
}