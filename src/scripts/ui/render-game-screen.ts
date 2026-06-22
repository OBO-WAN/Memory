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

type Player = 'blue' | 'orange';

interface GameScreenSettings {
  theme: ThemeOption;
  player: Player;
  boardSize: number;
}

interface ThemeCardAssets {
  cardBackUrl: string;
  definitions: readonly CardDefinition[];
}

/** Renders the complete game screen for the selected settings. */
export function renderGameScreen(
  settings: GameScreenSettings,
): string {
  const assets = getThemeCardAssets(settings.theme);
  const cards = createCardDeck(
    assets.definitions,
    settings.boardSize,
  );

  return `
    <main class="game-screen game-screen--${settings.theme}">
      ${renderGameInfo({
        theme: settings.theme,
        player: settings.player,
      })}

      ${renderGameBoard(
        cards,
        settings.boardSize,
        assets.cardBackUrl,
      )}
    </main>
  `;
}

/** Returns the card definitions and card back for one theme. */
function getThemeCardAssets(
  theme: ThemeOption,
): ThemeCardAssets {
  if (theme === 'gaming') {
    return {
      cardBackUrl: gamingCardBackUrl,
      definitions: gamingCards,
    };
  }

  return {
    cardBackUrl: codeVibesCardBackUrl,
    definitions: codeVibesCards,
  };
}

/** Renders the game board and all shuffled cards. */
function renderGameBoard(
  cards: readonly MemoryCard[],
  boardSize: number,
  cardBackUrl: string,
): string {
  return `
    <section
      class="game-board game-board--${boardSize}"
      aria-label="Memory game board"
    >
      ${renderGameCards(cards, cardBackUrl)}
    </section>
  `;
}

/** Renders every card in the supplied deck. */
function renderGameCards(
  cards: readonly MemoryCard[],
  cardBackUrl: string,
): string {
  return cards
    .map((card, index) =>
      renderGameCard(card, index, cardBackUrl),
    )
    .join('');
}

/** Renders one playable memory card. */
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
        ${renderCardBack(cardBackUrl)}
        ${renderCardFront(card)}
      </span>
    </button>
  `;
}

/** Renders the hidden card face. */
function renderCardBack(cardBackUrl: string): string {
  return `
    <span class="game-card__face game-card__face--back">
      <img
        class="game-card__back-image"
        src="${cardBackUrl}"
        alt=""
        aria-hidden="true"
      />
    </span>
  `;
}

/** Renders the visible card face. */
function renderCardFront(card: MemoryCard): string {
  return `
    <span class="game-card__face game-card__face--front">
      <img
        class="game-card__logo"
        src="${card.image}"
        alt="${card.label}"
      />
    </span>
  `;
}
