/**
 * Defines the form control names and summary identifiers used by the settings UI.
 */
export const SETTING_NAMES = {
  theme: 'theme',
  player: 'player',
  boardSize: 'boardSize',
} as const;

/**
 * Represents a supported settings identifier derived from `SETTING_NAMES`.
 */
export type SettingName =
  (typeof SETTING_NAMES)[keyof typeof SETTING_NAMES];

