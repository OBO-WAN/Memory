import { renderStartScreen } from './ui/render-start-screen';
import { renderSettingsScreen } from './ui/render-settings-screen';

export function initApp(): void {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return;

  renderStartView(app);
  app.addEventListener('click', handleAppClick);
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