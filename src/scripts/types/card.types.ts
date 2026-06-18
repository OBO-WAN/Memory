export interface CardDefinition {
  id: string;
  label: string;
  image: string;
}

export interface MemoryCard extends CardDefinition {
  instanceId: string;
  pairId: string;
}
