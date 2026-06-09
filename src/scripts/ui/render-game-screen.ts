import type { ThemeOption } from './render-settings-screen';

interface GameScreenSettings {
  theme: ThemeOption;
  player: string;
  boardSize: number;
}

export function renderGameScreen(settings: GameScreenSettings): string {
  const cards = Array.from({ length: settings.boardSize }, (_, index) => index + 1);

  return `
    <main class="game-screen game-screen--${settings.theme}">
      <header class="game-screen__header">
        <div class="game-screen__score">
          <span class="game-screen__player game-screen__player--blue">
            Blue 0
          </span>
          <span class="game-screen__player game-screen__player--orange">
            Orange 0
          </span>
        </div>

        <p class="game-screen__current-player">
          Current player: <span>${settings.player}</span>
        </p>

        <button
          class="game-screen__exit"
          type="button"
          data-action="open-settings"
        >
          Exit game
        </button>
      </header>

      <section
        class="game-board game-board--${settings.boardSize}"
        aria-label="Memory cards"
      >
        ${cards.map((card) => renderGameCard(card)).join('')}
      </section>
    </main>
  `;
}

function renderGameCard(card: number): string {
  return `
    <button class="game-card" type="button" aria-label="Card ${card}">
      <span class="game-card__icon">&lt;/&gt;</span>
    </button>
  `;
}