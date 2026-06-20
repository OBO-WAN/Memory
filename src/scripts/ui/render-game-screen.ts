import codeVibesCardBackUrl from '../../assets/images/cards/code-vibes/card-back.svg';
import gamingCardBackUrl from '../../assets/images/cards/game-theme/card-back.svg';

import { codeVibesCards } from '../data/code-vibes-cards';
import { gamingCards } from '../data/gaming-cards';
import { createCardDeck } from '../game/create-card-deck';
import type {
  CardDefinition,
  MemoryCard,
} from '../types/card.types';
import { renderGameInfo } from './render-game-info';
import type { ThemeOption } from './render-settings-screen';

interface GameScreenSettings {
  theme: ThemeOption;
  player: string;
  boardSize: number;
}

export function renderGameScreen(
  settings: GameScreenSettings,
): string {
  const definitions = getCardDefinitions(settings.theme);
  const cards = createCardDeck(definitions, settings.boardSize);
  const cardBackUrl = getCardBackUrl(settings.theme);
  const currentPlayer = getCurrentPlayer(settings.player);

  return `
    <main class="game-screen game-screen--${settings.theme}">
      ${renderGameInfo({
        theme: settings.theme,
        player: currentPlayer,
      })}

      <section
        class="game-board game-board--${settings.boardSize}"
        aria-label="Memory game board"
      >
        ${cards.map((card, index) => renderGameCard(card, index, cardBackUrl)).join('')}
      </section>
    </main>
  `;
}

function getCardDefinitions(theme: ThemeOption): CardDefinition[] {
  return theme === 'gaming' ? gamingCards : codeVibesCards;
}

function getCardBackUrl(theme: ThemeOption): string {
  return theme === 'gaming'
    ? gamingCardBackUrl
    : codeVibesCardBackUrl;
}

function getCurrentPlayer(player: string): 'blue' | 'orange' {
  return player === 'orange' ? 'orange' : 'blue';
}

function renderGameCard(
  card: MemoryCard,
  index: number,
  cardBackUrl: string,
): string {
  return `
    <button
      class="game-card"
      type="button"
      data-action="flip-card"
      data-card-id="${card.instanceId}"
      data-pair-id="${card.pairId}"
      aria-label="Memory card ${index + 1}"
      aria-pressed="false"
    >
      <span class="game-card__inner">
        <span class="game-card__face game-card__face--back">
          <img
            class="game-card__back-image"
            src="${cardBackUrl}"
            alt=""
            aria-hidden="true"
          />
        </span>

        <span class="game-card__face game-card__face--front">
          <img
            class="game-card__logo"
            src="${card.image}"
            alt="${card.label}"
          />
        </span>
      </span>
    </button>
  `;
}
