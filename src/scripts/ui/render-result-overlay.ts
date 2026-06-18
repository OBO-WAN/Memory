type Player = 'blue' | 'orange';
type Scores = Record<Player, number>;
type Result = Player | 'draw';

export function renderResultOverlay(scores: Scores): string {
  const result = getResult(scores);

  return `
    <dialog
      class="result-overlay result-overlay--${result}"
      aria-labelledby="result-overlay-title"
    >
      ${result === 'draw'
        ? renderDrawResult()
        : renderWinnerResult(result)}

      <button
        class="result-overlay__button"
        type="button"
        data-action="back-to-start"
      >
        Back to start
      </button>
    </dialog>
  `;
}

function renderWinnerResult(winner: Player): string {
  return `
    <div class="result-overlay__confetti" aria-hidden="true">
      ${renderConfetti()}
    </div>

    <section class="result-overlay__content">
      <p class="result-overlay__eyebrow">The winner is</p>

      <h2
        id="result-overlay-title"
        class="result-overlay__title"
      >
        ${winner.toUpperCase()} PLAYER
      </h2>

      ${renderPlayerIcon()}
    </section>
  `;
}

function renderDrawResult(): string {
  return `
    <section class="result-overlay__content">
      <p class="result-overlay__eyebrow">It’s a</p>

      <h2
        id="result-overlay-title"
        class="result-overlay__title result-overlay__title--draw"
      >
        DRAW
      </h2>

      ${renderBalanceIcon()}
    </section>
  `;
}

function renderPlayerIcon(): string {
  return `
    <svg
      class="result-overlay__player-icon"
      viewBox="0 0 160 210"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="80"
        cy="48"
        r="34"
        fill="none"
        stroke="currentColor"
        stroke-width="18"
      />
      <path
        d="M28 86H132"
        fill="none"
        stroke="currentColor"
        stroke-width="18"
        stroke-linecap="round"
      />
      <path
        d="M57 88C54 126 41 143 27 159V191H133V159C119 143 106 126 103 88"
        fill="none"
        stroke="currentColor"
        stroke-width="18"
        stroke-linejoin="round"
      />
    </svg>
  `;
}

function renderBalanceIcon(): string {
  return `
    <svg
      class="result-overlay__balance-icon"
      viewBox="0 0 220 210"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M110 32V180M55 70H165M83 180H137"
        fill="none"
        stroke="currentColor"
        stroke-width="14"
        stroke-linecap="round"
      />
      <path
        d="M44 70L20 118H68L44 70ZM176 70L152 118H200L176 70Z"
        fill="none"
        stroke="currentColor"
        stroke-width="10"
        stroke-linejoin="round"
      />
      <circle
        cx="110"
        cy="54"
        r="18"
        fill="currentColor"
      />
    </svg>
  `;
}

function renderConfetti(): string {
  const pieces = [
    ['7%', '6%', '-12deg', '#33aef3'],
    ['13%', '12%', '18deg', '#ffc400'],
    ['18%', '4%', '-4deg', '#ff1018'],
    ['24%', '9%', '72deg', '#ff1018'],
    ['31%', '5%', '12deg', '#33aef3'],
    ['37%', '12%', '-22deg', '#00b83f'],
    ['43%', '7%', '28deg', '#ffc400'],
    ['49%', '3%', '8deg', '#00b83f'],
    ['56%', '9%', '-14deg', '#ff1018'],
    ['63%', '5%', '22deg', '#ffc400'],
    ['70%', '11%', '-32deg', '#33aef3'],
    ['78%', '4%', '18deg', '#ff1018'],
    ['86%', '9%', '-8deg', '#00b83f'],
    ['92%', '5%', '25deg', '#33aef3'],
    ['11%', '19%', '35deg', '#00b83f'],
    ['22%', '17%', '-24deg', '#ffc400'],
    ['34%', '21%', '48deg', '#ff1018'],
    ['46%', '18%', '-18deg', '#33aef3'],
    ['58%', '20%', '28deg', '#00b83f'],
    ['71%', '18%', '-40deg', '#ffc400'],
    ['84%', '20%', '36deg', '#ff1018'],
  ];

  return pieces
    .map(
      ([left, top, rotation, color]) => `
        <span
          style="
            --confetti-left: ${left};
            --confetti-top: ${top};
            --confetti-rotation: ${rotation};
            --confetti-color: ${color};
          "
        ></span>
      `,
    )
    .join('');
}

function getResult(scores: Scores): Result {
  if (scores.blue === scores.orange) return 'draw';

  return scores.blue > scores.orange ? 'blue' : 'orange';
}
