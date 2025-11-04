<script lang="ts">
  import Board from '$lib/components/Board.svelte';
  import { gameState, resetGame, setBoardSize, toggleRenju } from '$lib/stores/game';
  import type { GameLogEntry, Winner } from '$lib/stores/game';

  const sizeOptions = [13, 15, 17, 19];

  let currentTurn: 'black' | 'white' = 'black';
  let winner: Winner | null = null;
  let isDraw = false;
  let log: GameLogEntry[] = [];
  let forbiddenReason: string | null = null;
  let boardSize = 15;
  let renjuEnabled = false;

  $: currentTurn = $gameState.currentTurn;
  $: winner = $gameState.winner;
  $: isDraw = $gameState.isDraw;
  $: log = $gameState.log;
  $: forbiddenReason = $gameState.forbiddenReason;
  $: boardSize = $gameState.config.size;
  $: renjuEnabled = $gameState.config.enforceRenju;

  const handleSizeChange = (event: Event) => {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!Number.isNaN(value)) {
      setBoardSize(value);
    }
  };

  const handleReset = () => {
    resetGame();
  };

  const handleToggleRenju = () => {
    toggleRenju();
  };

  const describeTurn = (turn: 'black' | 'white') => (turn === 'black' ? '흑(●)' : '백(○)');
</script>

<section class="page">
  <header class="space-y-3 text-center">
    <h1 class="text-3xl font-semibold">Gomoku</h1>
    <p class="text-on-surface-variant">15×15 오목판에서 턴을 번갈아 돌을 두고 다섯 줄을 먼저 완성하세요.</p>
  </header>

  <div class="controls">
    <label class="control">
      <span class="control__label">보드 크기</span>
      <select class="control__input" on:change={handleSizeChange} bind:value={boardSize}>
        {#each sizeOptions as option}
          <option value={option}>{option} × {option}</option>
        {/each}
      </select>
    </label>

    <label class="control">
      <span class="control__label">금수 규칙</span>
      <button
        type="button"
        class={`toggle ${renjuEnabled ? 'toggle--active' : ''}`}
        on:click={handleToggleRenju}
      >
        {renjuEnabled ? '적용' : '미적용'}
      </button>
    </label>

    <button type="button" class="reset" on:click={handleReset}>
      게임 리셋
    </button>
  </div>

  <div class="status space-y-2 text-center">
    {#if winner}
      <p class="text-xl font-semibold text-emerald-600">{describeTurn(winner.player)} 승리!</p>
    {:else if isDraw}
      <p class="text-xl font-semibold text-amber-600">무승부입니다.</p>
    {:else}
      <p class="text-lg">현재 턴: <strong>{describeTurn(currentTurn)}</strong></p>
    {/if}

    {#if forbiddenReason}
      <p class="text-sm text-rose-600">{forbiddenReason}</p>
    {/if}
  </div>

  <Board />

  <section class="log">
    <h2 class="text-lg font-semibold">게임 로그</h2>
    {#if log.length === 0}
      <p class="text-sm text-on-surface-variant">아직 수가 없습니다.</p>
    {:else}
      <ol class="log__list">
        {#each log as entry (entry.move)}
          <li>
            <span class="log__move">{entry.move}.</span>
            <span class={`log__stone ${entry.player === 'black' ? 'log__stone--black' : 'log__stone--white'}`}>
              {entry.player === 'black' ? '●' : '○'}
            </span>
            ({entry.position.row + 1}, {entry.position.col + 1})
            {#if entry.note}
              <span class="log__note">- {entry.note}</span>
            {/if}
          </li>
        {/each}
      </ol>
    {/if}
  </section>
</section>

<style>
  .page {
    display: grid;
    gap: 1.5rem;
    padding: clamp(1.5rem, 5vw, 3rem) clamp(1rem, 6vw, 3rem);
    max-width: 960px;
    margin: 0 auto;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    align-items: center;
  }

  .control {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 10rem;
    align-items: flex-start;
  }

  .control__label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-on-surface, #1f2937);
  }

  .control__input {
    width: 100%;
    padding: 0.4rem 0.6rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    background-color: white;
  }

  .toggle {
    width: 100%;
    padding: 0.45rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
    font-weight: 600;
    transition: all 0.15s ease-in-out;
  }

  .toggle--active {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    border-color: rgba(34, 197, 94, 0.8);
  }

  .toggle:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .reset {
    padding: 0.5rem 1.25rem;
    border-radius: 0.75rem;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.25);
    transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
  }

  .reset:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.25);
  }

  .reset:focus-visible {
    outline: 2px solid #1d4ed8;
    outline-offset: 2px;
  }

  .status {
    min-height: 3.5rem;
  }

  .log {
    background: rgba(255, 255, 255, 0.85);
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  }

  .log__list {
    margin-top: 0.5rem;
    display: grid;
    gap: 0.4rem;
    font-size: 0.95rem;
  }

  .log__move {
    font-weight: 600;
    margin-right: 0.25rem;
  }

  .log__stone {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-right: 0.35rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .log__stone--black {
    background-color: black;
    color: white;
  }

  .log__stone--white {
    background-color: white;
    color: black;
  }

  .log__note {
    color: #16a34a;
    font-weight: 600;
    margin-left: 0.5rem;
  }

  @media (max-width: 600px) {
    .control {
      min-width: 8rem;
    }
  }
</style>
