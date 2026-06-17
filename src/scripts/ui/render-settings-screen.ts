import chessPawnIconUrl from '../../assets/icons/chess-pawn.svg';
import markerUrl from '../../assets/icons/line-with-diamond.svg';
import paletteIconUrl from '../../assets/icons/palette.svg';
import styleIconUrl from '../../assets/icons/style.svg';

import daThemeUrl from '../../assets/images/themes/DAtheme.svg';
import codingVibesUrl from '../../assets/images/themes/coding-vibes.svg';
import foodsThemeUrl from '../../assets/images/themes/foodsTheme.svg';
import gamingThemeUrl from '../../assets/images/themes/gameTheme.svg';

export type ThemeOption = 'code-vibes' | 'gaming' | 'da-projects' | 'foods';

interface ThemePreview {
  src: string;
  alt: string;
}

type SettingsOption = [value: string, label: string];

interface SettingsGroupConfig {
  icon: string;
  title: string;
  name: string;
  options: SettingsOption[];
}

export const themePreviewMap: Record<ThemeOption, ThemePreview> = {
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
            <span
              class="settings-screen__title-line"
              aria-hidden="true"
            ></span>
          </header>

          ${renderSettingsGroup({
            icon: paletteIconUrl,
            title: 'Game themes',
            name: 'theme',
            options: [
              ['code-vibes', 'Code vibes theme'],
              ['gaming', 'Gaming theme'],
              ['da-projects', 'DA Projects theme'],
              ['foods', 'Foods theme'],
            ],
          })}

          ${renderSettingsGroup({
            icon: chessPawnIconUrl,
            title: 'Choose player',
            name: 'player',
            options: [
              ['blue', 'Blue'],
              ['orange', 'Orange'],
            ],
          })}

          ${renderSettingsGroup({
            icon: styleIconUrl,
            title: 'Board size',
            name: 'boardSize',
            options: [
              ['16', '16 cards'],
              ['24', '24 cards'],
              ['36', '36 cards'],
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
            <span class="settings-summary__item" data-summary="theme">
              Game theme
            </span>

            <span
              class="settings-summary__separator"
              aria-hidden="true"
            ></span>

            <span class="settings-summary__item" data-summary="player">
              Player
            </span>

            <span
              class="settings-summary__separator"
              aria-hidden="true"
            ></span>

            <span class="settings-summary__item" data-summary="boardSize">
              Board size
            </span>

            <button
              class="settings-summary__start"
              type="button"
              data-action="start-game"
              disabled
            >
              ${renderStartIcon()}
              <span class="settings-summary__start-label">Start</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderStartIcon(): string {
  return `
    <svg
      class="settings-summary__start-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M10.275 16L15.85 12.425C16 12.325 16.075 12.1833 16.075 12C16.075 11.8167 16 11.675 15.85 11.575L10.275 8C10.1083 7.88333 9.9375 7.875 9.7625 7.975C9.5875 8.075 9.5 8.225 9.5 8.425V15.575C9.5 15.775 9.5875 15.925 9.7625 16.025C9.9375 16.125 10.1083 16.1167 10.275 16ZM4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM4 18H20V6H4V18Z"
      />
    </svg>
  `;
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
          .map(([value, label]) =>
            renderRadioOption(config.name, value, label),
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
): string {
  return `
    <label class="radio-option">
      <input
        class="radio-option__input"
        type="radio"
        name="${name}"
        value="${value}"
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
