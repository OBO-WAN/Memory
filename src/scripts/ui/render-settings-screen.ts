import codingVibesUrl from '../../assets/images/themes/coding-vibes.svg';
import gamingThemeUrl from '../../assets/images/themes/gameTheme.svg';
import daThemeUrl from '../../assets/images/themes/DAtheme.svg';
import foodsThemeUrl from '../../assets/images/themes/foodsTheme.svg';

import paletteIconUrl from '../../assets/icons/palette.svg';
import chessPawnIconUrl from '../../assets/icons/chess-pawn.svg';
import styleIconUrl from '../../assets/icons/style.svg';
import markerUrl from '../../assets/icons/line-with-diamond.svg';

export type ThemeOption = 'code-vibes' | 'gaming' | 'da-projects' | 'foods';

export const themePreviewMap: Record<ThemeOption, { src: string; alt: string }> = {
  'code-vibes': {
    src: codingVibesUrl,
    alt: 'Coding vibes theme preview',
  },
  gaming: {
    src: gamingThemeUrl,
    alt: 'Gaming theme preview',
  },
  'da-projects': {
    src: daThemeUrl,
    alt: 'DA Projects theme preview',
  },
  foods: {
    src: foodsThemeUrl,
    alt: 'Foods theme preview',
  },
};

export function renderSettingsScreen(): string {
  const initialTheme = themePreviewMap['code-vibes'];

  return `
    <main class="settings-screen">
      <section class="settings-screen__panel">
        <div class="settings-screen__left">
          <header class="settings-screen__header">
            <h1 class="settings-screen__title">Settings</h1>
            <span class="settings-screen__title-line"></span>
          </header>

          ${renderSettingsGroup({
            icon: paletteIconUrl,
            title: 'Game themes',
            name: 'theme',
            options: [
              ['code-vibes', 'Code vibes theme', true],
              ['gaming', 'Gaming theme', false],
              ['da-projects', 'DA Projects theme', false],
              ['foods', 'Foods theme', false],
            ],
          })}

          ${renderSettingsGroup({
            icon: chessPawnIconUrl,
            title: 'Choose player',
            name: 'player',
            options: [
              ['blue', 'Blue', true],
              ['orange', 'Orange', false],
            ],
          })}

          ${renderSettingsGroup({
            icon: styleIconUrl,
            title: 'Board size',
            name: 'boardSize',
            options: [
              ['16', '16 cards', true],
              ['24', '24 cards', false],
              ['36', '36 cards', false],
            ],
          })}
        </div>

        <div class="settings-screen__right">
          <img
            class="settings-screen__preview"
            src="${initialTheme.src}"
            alt="${initialTheme.alt}"
          />

          <div class="settings-summary">
            <span class="settings-summary__item">Game theme</span>
            <span class="settings-summary__separator"></span>
            <span class="settings-summary__item">Player</span>
            <span class="settings-summary__separator"></span>
            <span class="settings-summary__item">Board size</span>

            <button
              class="settings-summary__start"
              type="button"
              data-action="start-game"
            >
              Start
            </button>
          </div>
        </div>
      </section>
    </main>
  `;
}

interface SettingsGroupConfig {
  icon: string;
  title: string;
  name: string;
  options: [string, string, boolean][];
}

function renderSettingsGroup(config: SettingsGroupConfig): string {
  return `
    <fieldset class="settings-group">
      <legend class="settings-group__legend">
        <span class="settings-group__icon">
          <img src="${config.icon}" alt="" aria-hidden="true" />
        </span>
        <span>${config.title}</span>
      </legend>

      <div class="settings-group__options">
        ${config.options
          .map(([value, label, checked]) =>
            renderRadioOption(config.name, value, label, checked),
          )
          .join('')}
      </div>
    </fieldset>
  `;
}

function renderRadioOption(
  name: string,
  value: string,
  label: string,
  checked: boolean,
): string {
  return `
    <label class="radio-option">
      <input
        class="radio-option__input"
        type="radio"
        name="${name}"
        value="${value}"
        ${checked ? 'checked' : ''}
      />
      <span class="radio-option__control"></span>
      <span class="radio-option__text">${label}</span>
      <img
        class="radio-option__marker"
        src="${markerUrl}"
        alt=""
        aria-hidden="true"
      />
    </label>
  `;
}
