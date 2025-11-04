import { writable } from 'svelte/store';

export type Stone = 'black' | 'white';
export type Cell = Stone | null;

export interface Position {
  row: number;
  col: number;
}

interface GameConfig {
  size: number;
  enforceRenju: boolean;
}

export interface GameLogEntry {
  move: number;
  player: Stone;
  position: Position;
  note?: string;
}

export interface Winner {
  player: Stone;
  positions: Position[];
}

export interface GameState {
  board: Cell[][];
  currentTurn: Stone;
  winner: Winner | null;
  isDraw: boolean;
  log: GameLogEntry[];
  config: GameConfig;
  forbiddenReason: string | null;
}

const defaultConfig: GameConfig = {
  size: 15,
  enforceRenju: false
};

const createBoard = (size: number): Cell[][] =>
  Array.from({ length: size }, () => Array<Cell>(size).fill(null));

const createInitialState = (config: GameConfig = defaultConfig): GameState => ({
  board: createBoard(config.size),
  currentTurn: 'black',
  winner: null,
  isDraw: false,
  log: [],
  config,
  forbiddenReason: null
});

const directions = [
  { dr: 0, dc: 1 },
  { dr: 1, dc: 0 },
  { dr: 1, dc: 1 },
  { dr: 1, dc: -1 }
] as const;

type Direction = (typeof directions)[number];

const stoneToChar = (stone: Stone): 'B' | 'W' => (stone === 'black' ? 'B' : 'W');

const checkWinner = (board: Cell[][], row: number, col: number, stone: Stone) => {
  const size = board.length;
  const positionsForWinner: Position[] = [];
  let longest = 1;
  let winningPositions: Position[] | null = null;

  for (const { dr, dc } of directions) {
    const linePositions: Position[] = [{ row, col }];
    let count = 1;

    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && c >= 0 && r < size && c < size && board[r][c] === stone) {
      linePositions.push({ row: r, col: c });
      count += 1;
      r += dr;
      c += dc;
    }

    r = row - dr;
    c = col - dc;
    while (r >= 0 && c >= 0 && r < size && c < size && board[r][c] === stone) {
      linePositions.unshift({ row: r, col: c });
      count += 1;
      r -= dr;
      c -= dc;
    }

    if (count > longest) {
      longest = count;
      winningPositions = [...linePositions];
    } else if (count === longest && winningPositions === null) {
      winningPositions = [...linePositions];
    }
  }

  if (longest >= 5 && winningPositions) {
    positionsForWinner.push(...winningPositions);
  }

  return {
    longest,
    positions: positionsForWinner
  };
};

const gatherLine = (board: Cell[][], row: number, col: number, { dr, dc }: Direction) => {
  const size = board.length;
  const span = 4;
  const chars: string[] = [];

  for (let offset = -span; offset <= span; offset += 1) {
    const r = row + dr * offset;
    const c = col + dc * offset;

    if (r < 0 || c < 0 || r >= size || c >= size) {
      chars.push('X');
    } else {
      const cell = board[r][c];
      if (cell === null) {
        chars.push('.');
      } else {
        chars.push(stoneToChar(cell));
      }
    }
  }

  return chars.join('');
};

const countSegments = (
  line: string,
  stoneChar: 'B' | 'W',
  opponentChar: 'B' | 'W',
  length: number,
  predicate: (segment: string) => boolean
) => {
  let count = 0;
  const center = Math.floor(line.length / 2);
  const maxStart = line.length - length;
  const minStart = Math.max(0, center - (length - 1));
  const maxRelevantStart = Math.min(maxStart, center);

  for (let start = minStart; start <= maxRelevantStart; start += 1) {
    const segment = line.slice(start, start + length);
    if (segment.includes(opponentChar) || segment.includes('X')) {
      continue;
    }
    if (predicate(segment)) {
      count += 1;
    }
  }

  return count;
};

const detectForbidden = (board: Cell[][], row: number, col: number, stone: Stone) => {
  if (stone !== 'black') {
    return null;
  }

  const stoneChar = stoneToChar(stone);
  const opponentChar: 'B' | 'W' = 'W';
  let openThreeCount = 0;
  let fourCount = 0;

  for (const direction of directions) {
    const line = gatherLine(board, row, col, direction);

    fourCount += countSegments(line, stoneChar, opponentChar, 5, (segment) => {
      const stones = segment.split('').filter((ch) => ch === stoneChar).length;
      if (stones !== 4) return false;
      const openEnds = Number(segment[0] === '.') + Number(segment[segment.length - 1] === '.');
      return openEnds > 0;
    });

    openThreeCount += countSegments(line, stoneChar, opponentChar, 5, (segment) => {
      const stones = segment.split('').filter((ch) => ch === stoneChar).length;
      if (stones !== 3) return false;
      const openEnds = Number(segment[0] === '.') + Number(segment[segment.length - 1] === '.');
      const empties = segment.split('').filter((ch) => ch === '.').length;
      return openEnds === 2 && empties === 2;
    });

    openThreeCount += countSegments(line, stoneChar, opponentChar, 6, (segment) => {
      if (segment.split('').filter((ch) => ch === stoneChar).length !== 3) {
        return false;
      }
      const openEnds = Number(segment[0] === '.') + Number(segment[segment.length - 1] === '.');
      if (openEnds !== 2) {
        return false;
      }
      return /\.BB\.B\.|\.B\.BB\./.test(segment);
    });
  }

  if (fourCount >= 2) {
    return '이 수는 흑의 쌍사(이중 사목) 금수입니다.';
  }

  if (openThreeCount >= 2) {
    return '이 수는 흑의 쌍삼 금수입니다.';
  }

  return null;
};

const isBoardFull = (board: Cell[][]) => board.every((row) => row.every((cell) => cell !== null));

const gameStore = writable<GameState>(createInitialState());

export const gameState = { subscribe: gameStore.subscribe };

export const placeStone = (row: number, col: number) => {
  gameStore.update((state) => {
    if (state.winner || state.isDraw) {
      return { ...state, forbiddenReason: null };
    }

    if (state.board[row][col] !== null) {
      return { ...state, forbiddenReason: null };
    }

    const board = state.board.map((r) => [...r]);
    const stone = state.currentTurn;
    board[row][col] = stone;

    const { longest, positions } = checkWinner(board, row, col, stone);

    if (state.config.enforceRenju && stone === 'black') {
      if (longest > 5) {
        return {
          ...state,
          forbiddenReason: '장목(6목 이상)은 흑의 금수입니다.'
        };
      }

      if (longest < 5) {
        const forbidden = detectForbidden(board, row, col, stone);
        if (forbidden) {
          return {
            ...state,
            forbiddenReason: forbidden
          };
        }
      }
    }

    const winner = longest >= 5 ? { player: stone, positions } : null;
    const isDraw = !winner && isBoardFull(board);
    const moveNumber = state.log.length + 1;

    const logEntry: GameLogEntry = {
      move: moveNumber,
      player: stone,
      position: { row, col },
      note: winner ? '승리' : undefined
    };

    return {
      board,
      currentTurn: stone === 'black' ? 'white' : 'black',
      winner,
      isDraw,
      log: [...state.log, logEntry],
      config: state.config,
      forbiddenReason: null
    };
  });
};

export const resetGame = (config?: Partial<GameConfig>) => {
  gameStore.update((state) => {
    const mergedConfig: GameConfig = {
      ...state.config,
      ...config
    };

    return createInitialState(mergedConfig);
  });
};

export const setBoardSize = (size: number) => {
  if (!Number.isInteger(size) || size < 5) {
    return;
  }

  gameStore.update((state) => {
    const newConfig: GameConfig = {
      ...state.config,
      size
    };

    return createInitialState(newConfig);
  });
};

export const toggleRenju = () => {
  gameStore.update((state) => {
    const newConfig: GameConfig = {
      ...state.config,
      enforceRenju: !state.config.enforceRenju
    };

    return createInitialState(newConfig);
  });
};
