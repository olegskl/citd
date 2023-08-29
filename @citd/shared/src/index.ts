import type * as monaco from "monaco-editor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export type User = {
  id: string;
  name: string;
  avatar?: any;
};

export type Player = User & {
  readyToPlay: boolean;
};

export enum GameStatus {
  WAITING = "WAITING",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  ENDED = "ENDED",
}

export type Game = {
  status: GameStatus;
  timeRemaining: number;
  players: Player[];
  operations: { userId: string; operation: Operation }[];
};

export type Operation = {
  edits?: monaco.editor.IIdentifiedSingleEditOperation[];
  selections?: monaco.ISelection[];
};

const MAX_PLAYERS = 2;
const INITIAL_EDIT: monaco.editor.IIdentifiedSingleEditOperation = {
  range: { startColumn: 0, startLineNumber: 0, endColumn: 0, endLineNumber: 0 },
  text: `<!doctype html>\n<html>\n\n<body>\n  \n</body>\n\n</html>\n`,
};
const INITIAL_SELECTION: monaco.ISelection = {
  selectionStartColumn: 3,
  selectionStartLineNumber: 5,
  positionColumn: 3,
  positionLineNumber: 5,
};

export type Action =
  | { type: "tick" }
  | { type: "reset" }
  | { type: "joinGame"; userId: string }
  | { type: "changeName"; userId: string; payload: string }
  | { type: "changeReadyToPlayStatus"; userId: string; payload: boolean }
  | { type: "kickPlayer"; userId: string; payload: string }
  | { type: "start"; userId: string }
  | { type: "pause"; userId: string }
  | { type: "unpause"; userId: string }
  | { type: "operation"; userId: string; payload: Operation };

export function reducer(state: Game, action: Action): Game {
  switch (action.type) {
    case "tick": {
      const newTimeRemaining = state.timeRemaining - 1;
      if (newTimeRemaining <= 0) {
        return {
          ...state,
          status: GameStatus.ENDED,
          timeRemaining: 0,
        };
      }
      return {
        ...state,
        timeRemaining: state.timeRemaining - 1,
      };
    }
    case "reset": {
      return createInitialGame();
    }
    case "operation": {
      return {
        ...state,
        operations: [
          ...state.operations,
          { userId: action.userId, operation: action.payload },
        ],
      };
    }
    case "joinGame": {
      if (state.players.length >= MAX_PLAYERS) {
        return state;
      }
      if (state.players.find((player) => player.id === action.userId)) {
        return state;
      }
      return {
        ...state,
        players: [
          ...state.players,
          {
            id: action.userId,
            name: "",
            readyToPlay: false,
          },
        ],
        operations: [
          ...state.operations,
          {
            userId: action.userId,
            operation: {
              edits: [INITIAL_EDIT],
              selections: [INITIAL_SELECTION],
            },
          },
        ],
      };
    }
    case "changeName": {
      return {
        ...state,
        players: state.players.map((player) => {
          return player.id === action.userId
            ? { ...player, name: action.payload }
            : player;
        }),
      };
    }
    case "changeReadyToPlayStatus":
      return {
        ...state,
        players: state.players.map((player) => {
          return player.id === action.userId
            ? { ...player, readyToPlay: action.payload }
            : player;
        }),
      };
    case "kickPlayer":
      return {
        ...state,
        players: state.players.filter((player) => player.id !== action.payload),
        operations: state.operations.filter(
          (operation) => operation.userId !== action.payload
        ),
      };
    case "start":
      return { ...state, status: GameStatus.PLAYING };
    case "pause":
      return { ...state, status: GameStatus.PAUSED };
    default:
      throw Error("Unknown action: " + action.type);
  }
}

export function createInitialGame(): Game {
  return {
    status: GameStatus.WAITING,
    timeRemaining: 15 * 60,
    players: [],
    operations: [],
  };
}
