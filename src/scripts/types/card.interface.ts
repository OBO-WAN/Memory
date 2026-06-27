/**
 * Describes a unique card face available to a memory theme.
 *
 * Consumers rely on these fields to keep shared data shapes consistent across modules.
 */
export interface CardDefinition {
  id: string;
  label: string;
  image: string;
}

/**
 * Represents one rendered card instance within a shuffled deck.
 *
 * Consumers rely on these fields to keep shared data shapes consistent across modules.
 */
export interface MemoryCard extends CardDefinition {
  instanceId: string;
  pairId: string;
}
