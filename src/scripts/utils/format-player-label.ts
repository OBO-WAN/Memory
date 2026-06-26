/**
 * Formats a lowercase player identifier for visible or accessible text.
 *
 * @param player - Player identifier to format.
 * @returns Player identifier with its first character capitalized.
 */
export function formatPlayerLabel(player: string): string {
  return player.charAt(0).toUpperCase() + player.slice(1);
}