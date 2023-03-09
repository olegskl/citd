import { EditorChangeLinkedList, Position } from "codemirror";

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

export type Change = EditorChangeLinkedList;
export type Selection = { anchor: Position; head: Position };
export type Operation = Change | Selection[];

export function isChange(operation: Operation): operation is Change {
  return !Array.isArray(operation);
}

export function isSelections(operation: Operation): operation is Selection[] {
  return Array.isArray(operation);
}

const MAX_PLAYERS = 2;

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
      return { ...INITIAL_GAME };
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
              from: { ch: 0, line: 0 },
              to: { ch: 0, line: 0 },
              text: [
                "<!doctype html>",
                "<html>",
                "  <body>",
                "    ",
                "  </body>",
                "</html>",
              ],
            },
          },
          {
            userId: action.userId,
            operation: [
              {
                anchor: { ch: 4, line: 3 },
                head: { ch: 4, line: 3 },
              },
            ],
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
      };
    case "start":
      return { ...state, status: GameStatus.PLAYING };
    case "pause":
      return { ...state, status: GameStatus.PAUSED };
    default:
      throw Error("Unknown action: " + action.type);
  }
}

export const INITIAL_GAME: Readonly<Game> = {
  status: GameStatus.WAITING,
  timeRemaining: 15 * 60,
  players: [],
  operations: [],
};
