import codeVibesCardBackUrl from '../../assets/images/cards/code-vibes/card-back.svg';
import daProjectsCardBackUrl from '../../assets/images/cards/da-theme/card-back.svg';
import gamingCardBackUrl from '../../assets/images/cards/game-theme/card-back.svg';

import { codeVibesCards } from '../data/code-vibes-cards';
import { daProjectsCards } from '../data/da-projects-cards';
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
 * Builds the complete game screen from the selected theme and board settings.
 *
 * @param settings - Confirmed settings used to choose assets, create the deck,
 * and identify the active player.
 * @returns Main game markup containing the information header and card board.
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
 * Selects the card definitions and back artwork assigned to a theme.
 *
 * Themes without dedicated game assets continue to use the Code Vibes deck
 * until their own card set is implemented.
 *
 * @param theme - Active theme selected on the settings screen.
 * @returns Card definitions and back artwork used to build the selected deck.
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

  if (theme === 'da-projects') {
    return {
      cardBackUrl: daProjectsCardBackUrl,
      definitions: daProjectsCards,
    };
  }

  return {
    cardBackUrl: codeVibesCardBackUrl,
    definitions: codeVibesCards,
  };
}

/**
 * Builds the labelled board region containing the shuffled card buttons.
 *
 * @param cards - Shuffled card instances rendered as playable buttons.
 * @param boardSize - Selected card count used by the responsive board class.
 * @param cardBackUrl - Theme-specific artwork shown on every concealed card.
 * @returns Section markup containing the complete playable memory board.
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
 * Converts every shuffled card instance into its button markup.
 *
 * @param cards - Card instances created for the selected board size.
 * @param cardBackUrl - Theme-specific artwork shared by all card backs.
 * @returns Concatenated card button markup in shuffled board order.
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
 * Builds one accessible card button with its pair and instance metadata.
 *
 * @param card - Card data used for matching and rendering the revealed face.
 * @param index - Zero-based board position used in the accessible card label.
 * @param cardBackUrl - Theme-specific artwork displayed while the card is hidden.
 * @returns Button markup containing the card's concealed and revealed faces.
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
 * Builds the decorative back face displayed before a card is revealed.
 *
 * @param cardBackUrl - Imported theme artwork used for the concealed card state.
 * @returns Back-face markup with an image ignored by assistive technology.
 */
function renderCardBack(cardBackUrl: string): string {
  return `
    <span class="game-card__face game-card__face--back">
      <img
        class="game-card__back-image"
        src="${cardBackUrl}"
        alt=""
      />
    </span>
  `;
}

/**
 * Builds the revealed face containing the card's meaningful illustration.
 *
 * @param card - Card definition providing the image source and accessible label.
 * @returns Front-face markup displayed when the card is flipped or matched.
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
