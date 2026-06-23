import type {
  CardDefinition,
  MemoryCard,
} from '../types/card.types';

const CARDS_PER_PAIR = 2;

/**
 * Creates the requested number of paired cards and returns them shuffled.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param definitions - Available card face definitions used to build the requested deck.
 * @param boardSize - Number of cards requested for the board and used to calculate pair count.
 * @returns Playable card instances for the requested deck or pair.
 */
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

/**
 * Expands one card definition into the two instances needed for a pair.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param definition - Card face definition expanded into playable card instances.
 * @returns Playable card instances for the requested deck or pair.
 */
function createCardPair(
  definition: CardDefinition,
): MemoryCard[] {
  return Array.from(
    { length: CARDS_PER_PAIR },
    (_, copyIndex) => createCardInstance(definition, copyIndex),
  );
}

/**
 * Adds pair and instance identifiers to a card definition.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param definition - Card face definition expanded into playable card instances.
 * @param copyIndex - Zero-based copy number used to make a stable card instance identifier.
 * @returns Value produced for the caller according to the documented responsibility.
 */
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

/**
 * Returns a shuffled copy of the supplied card deck.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param cards - Card collection rendered, shuffled, validated, or reordered for play.
 * @returns Playable card instances for the requested deck or pair.
 */
function shuffleCards(
  cards: readonly MemoryCard[],
): MemoryCard[] {
  const shuffledCards = [...cards];

  for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
    swapCards(shuffledCards, index, getRandomIndex(index));
  }

  return shuffledCards;
}

/**
 * Chooses a random index from the unshuffled portion of the deck.
 *
 * Callers use the result to render markup, validate state, or choose the next UI step.
 *
 * @param maximumIndex - Highest index still eligible during the shuffle step.
 * @returns Numeric value used by the caller for the next calculation.
 */
function getRandomIndex(maximumIndex: number): number {
  return Math.floor(Math.random() * (maximumIndex + 1));
}

/**
 * Mutates the deck by exchanging two card positions.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param cards - Card collection rendered, shuffled, validated, or reordered for play.
 * @param firstIndex - First deck position participating in the swap.
 * @param secondIndex - Second deck position participating in the swap.
 */
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

/**
 * Throws when the requested board size cannot be built from the theme cards.
 *
 * It performs the required DOM, focus, timer, or game-state side effect without returning data.
 *
 * @param definitions - Available card face definitions used to build the requested deck.
 * @param boardSize - Number of cards requested for the board and used to calculate pair count.
 */
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
