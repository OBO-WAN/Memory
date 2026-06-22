import type {
  CardDefinition,
  MemoryCard,
} from '../types/card.types';

const CARDS_PER_PAIR = 2;

/** Creates and shuffles a deck for the selected board size. */
export function createCardDeck(
  definitions: readonly CardDefinition[],
  boardSize: number,
): MemoryCard[] {
  validateBoardSize(definitions, boardSize);

  const pairCount = boardSize / CARDS_PER_PAIR;
  const selectedDefinitions = definitions.slice(0, pairCount);
  const deck = selectedDefinitions.flatMap(createCardPair);

  return shuffleCards(deck);
}

/** Creates both card instances belonging to one pair. */
function createCardPair(
  definition: CardDefinition,
): MemoryCard[] {
  return Array.from(
    { length: CARDS_PER_PAIR },
    (_, copyIndex) => createCardInstance(definition, copyIndex),
  );
}

/** Creates one playable card instance. */
function createCardInstance(
  definition: CardDefinition,
  copyIndex: number,
): MemoryCard {
  return {
    ...definition,
    pairId: definition.id,
    instanceId: `${definition.id}-${copyIndex + 1}`,
  };
}

/** Shuffles cards with the Fisher-Yates algorithm. */
function shuffleCards(
  cards: readonly MemoryCard[],
): MemoryCard[] {
  const shuffledCards = [...cards];

  for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
    swapCards(shuffledCards, index, getRandomIndex(index));
  }

  return shuffledCards;
}

/** Returns a random index within the remaining shuffle range. */
function getRandomIndex(maximumIndex: number): number {
  return Math.floor(Math.random() * (maximumIndex + 1));
}

/** Swaps two cards in the supplied deck. */
function swapCards(
  cards: MemoryCard[],
  firstIndex: number,
  secondIndex: number,
): void {
  [cards[firstIndex], cards[secondIndex]] = [
    cards[secondIndex],
    cards[firstIndex],
  ];
}

/** Validates whether the requested board size is supported. */
function validateBoardSize(
  definitions: readonly CardDefinition[],
  boardSize: number,
): void {
  const hasValidPairCount =
    Number.isInteger(boardSize) &&
    boardSize % CARDS_PER_PAIR === 0;
  const hasEnoughDefinitions =
    boardSize / CARDS_PER_PAIR <= definitions.length;

  if (!hasValidPairCount || !hasEnoughDefinitions) {
    throw new Error(`Unsupported board size: ${boardSize}`);
  }
}
