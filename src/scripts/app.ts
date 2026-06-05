import { renderStartScreen } from './ui/render-start-screen';

export function initApp(): void {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return;

  app.innerHTML = renderStartScreen();
  app.addEventListener('click', handleAppClick);
}

function handleAppClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  const playButton = target.closest('[data-action="start-game"]');

  if (!playButton) return;

  console.log('Start game clicked');
}