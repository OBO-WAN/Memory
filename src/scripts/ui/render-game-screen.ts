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

/**
 * Builds the full game view for the selected theme, player, and board size.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param settings - Selected game settings used to initialize state or render UI.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Selects the card faces and back image used by a theme.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param theme - Active theme used to choose ordering, artwork, or theme-specific markup.
 * @returns Card definitions and back artwork used to render the selected theme.
 */
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

/**
 * Builds the accessible board region containing every shuffled card.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param cards - Card collection rendered, shuffled, validated, or reordered for play.
 * @param boardSize - Number of cards requested for the board and used to calculate pair count.
 * @param cardBackUrl - Value used by this declaration to produce its documented behavior.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Joins the rendered card buttons for a shuffled deck.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param cards - Card collection rendered, shuffled, validated, or reordered for play.
 * @param cardBackUrl - Value used by this declaration to produce its documented behavior.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Builds one card button with pair metadata and accessible label.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param card - Rendered card or card data used to update the board markup or state.
 * @param index - Value used by this declaration to produce its documented behavior.
 * @param cardBackUrl - Value used by this declaration to produce its documented behavior.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Builds the decorative back face shown before a card is flipped.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param cardBackUrl - Value used by this declaration to produce its documented behavior.
 * @returns HTML markup or display text consumed by the caller.
 */
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

/**
 * Builds the front face that reveals the card image and label.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param card - Rendered card or card data used to update the board markup or state.
 * @returns HTML markup or display text consumed by the caller.
 */
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
