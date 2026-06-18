import type {
  CardDefinition,
  MemoryCard,
} from '../types/card.types';

export function createCardDeck(
  definitions: CardDefinition[],
  boardSize: number,
): MemoryCard[] {
  validateBoardSize(definitions, boardSize);

  const pairCount = boardSize / 2;
  const selectedCards = definitions.slice(0, pairCount);
  const deck = selectedCards.flatMap(createPair);

  return shuffleCards(deck);
}

function createPair(card: CardDefinition): MemoryCard[] {
  return [0, 1].map((copyIndex) => ({
    ...card,
    pairId: card.id,
    instanceId: `${card.id}-${copyIndex + 1}`,
  }));
}

function shuffleCards(cards: MemoryCard[]): MemoryCard[] {
  const shuffledCards = [...cards];

  for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffledCards[index], shuffledCards[randomIndex]] = [
      shuffledCards[randomIndex],
      shuffledCards[index],
    ];
  }

  return shuffledCards;
}

function validateBoardSize(
  definitions: CardDefinition[],
  boardSize: number,
): void {
  const hasValidPairCount = Number.isInteger(boardSize) && boardSize % 2 === 0;
  const hasEnoughCards = boardSize / 2 <= definitions.length;

  if (!hasValidPairCount || !hasEnoughCards) {
    throw new Error(`Unsupported board size: ${boardSize}`);
  }
}
