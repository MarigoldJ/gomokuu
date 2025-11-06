<script lang="ts">
  import { gameState, placeStone } from '$lib/stores/game';
  import type { Cell, Position, Winner } from '$lib/stores/game';

  const toKey = (row: number, col: number) => `${row}:${col}`;

  const symbolFor = (cell: Cell) => {
    if (cell === 'black') return '●';
    if (cell === 'white') return '○';
    return '';
  };

  const classFor = (cell: Cell) => {
    if (cell === 'black') return 'bg-black text-white';
    if (cell === 'white') return 'bg-white text-black border border-zinc-500';
    return '';
  };

  let size = 15;
  let board: Cell[][] = [];
  let winner: Winner | null = null;
  let winningCells = new Set<string>();
  let boardStyle = '';
  let cellSize = '0%';

  $: size = $gameState.config.size;
  $: board = $gameState.board;
  $: winner = $gameState.winner;
  $: winningCells = new Set(winner ? winner.positions.map((pos: Position) => toKey(pos.row, pos.col)) : []);
  $: cellSize = `${(100 / size).toFixed(6)}%`;
  $: boardStyle = `grid-template-columns: repeat(${size}, minmax(0, 1fr)); --board-size: ${size}; --cell-size: ${cellSize};`;

  const handleCellClick = (row: number, col: number) => {
    placeStone(row, col);
  };
</script>

<div class="board" style={boardStyle}>
  {#each board as row, rowIndex}
    {#each row as cell, colIndex}
      <button
        class={`cell ${winningCells.has(toKey(rowIndex, colIndex)) ? 'cell--winner' : ''}`}
        type="button"
        aria-label={`(${rowIndex + 1}, ${colIndex + 1}) ${cell ? (cell === 'black' ? '흑' : '백') : '빈칸'}`}
        on:click={() => handleCellClick(rowIndex, colIndex)}
        disabled={Boolean(cell) || Boolean(winner)}
      >
        {#if cell}
          <span class={`stone ${classFor(cell)}`}>
            {symbolFor(cell)}
          </span>
        {/if}
      </button>
    {/each}
  {/each}
</div>

<style>
  :global(:root) {
    --board-line-color: rgba(0, 0, 0, 0.4);
    --board-bg: #f5d39a;
  }

  .board {
    display: grid;
    gap: 0;
    width: 100%;
    max-width: min(90vw, 640px);
    aspect-ratio: 1;
    margin: 0 auto;
    padding: clamp(0.75rem, 1vw, 1.25rem);
    background-color: var(--board-bg);
    border-radius: 0.75rem;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
    background-origin: content-box;
    background-clip: content-box;
    background-image:
      linear-gradient(0deg, var(--board-line-color) 1px, transparent 1px),
      linear-gradient(90deg, var(--board-line-color) 1px, transparent 1px);
    background-size: var(--cell-size) var(--cell-size);
    background-position: calc(var(--cell-size) / 2) calc(var(--cell-size) / 2);
  }

  .cell {
    position: relative;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: transform 0.1s ease-in-out;
  }

  .cell:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: -4px;
  }

  .cell:disabled {
    cursor: default;
  }

  .cell:not(:disabled):hover::after {
    content: '';
    position: absolute;
    width: 25%;
    height: 25%;
    border-radius: 50%;
    background-color: rgba(59, 130, 246, 0.35);
  }

  .stone {
    display: grid;
    place-items: center;
    width: 70%;
    height: 70%;
    border-radius: 9999px;
    font-size: clamp(0.8rem, 3vw, 1.2rem);
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  }

  .cell--winner .stone {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.55), 0 2px 6px rgba(0, 0, 0, 0.4);
  }
</style>
