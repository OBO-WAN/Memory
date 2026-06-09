import { renderStartScreen } from './ui/render-start-screen';
import {
  renderSettingsScreen,
  themePreviewMap,
} from './ui/render-settings-screen';

export function initApp(): void {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return;

  renderStartView(app);
  app.addEventListener('click', handleAppClick);
  app.addEventListener('change', handleAppChange);
}

function renderStartView(app: HTMLDivElement): void {
  app.innerHTML = renderStartScreen();
}

function renderSettingsView(app: HTMLDivElement): void {
  app.innerHTML = renderSettingsScreen();
}

function handleAppClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  const actionElement = target.closest<HTMLElement>('[data-action]');

  if (!actionElement) return;

  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return;

  const action = actionElement.dataset.action;

  if (action === 'open-settings') {
    renderSettingsView(app);
    return;
  }

  if (action === 'start-game') {
    console.log('Start game from settings');
  }
}

function handleAppChange(event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return;

  const input = event.target;

  if (input.name !== 'theme') return;

  const selectedPreview =
    themePreviewMap[input.value as keyof typeof themePreviewMap];

  if (!selectedPreview) return;

  const previewImage = document.querySelector<HTMLImageElement>(
    '.settings-screen__preview',
  );

  if (!previewImage) return;

  previewImage.src = selectedPreview.src;
  previewImage.alt = selectedPreview.alt;
}