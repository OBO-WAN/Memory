export function initApp(): void {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) return;

  app.innerHTML = `
    <main class="memory">
      <h1>Memory</h1>
      <p>Project initialized successfully.</p>
    </main>
  `;
}