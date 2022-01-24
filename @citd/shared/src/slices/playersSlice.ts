import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditorChangeLinkedList, Position } from "codemirror";

type Change = EditorChangeLinkedList;
type Selection = { anchor: Position; head: Position };
type Operation = Change | Selection[];

export type PlayerState = {
  id: string;
  name: string;
  isReady: boolean;
  codeOperations: Operation[];
};
export type PlayersState = Record<string, PlayerState>;

const initialState: PlayersState = {};
const initialCodeOperations: Operation[] = [
  // Add basic code structure:
  {
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
  // Place the cursor at position 4:3:
  [
    {
      anchor: { ch: 4, line: 3 },
      head: { ch: 4, line: 3 },
    },
  ],
];

export const players = createSlice({
  name: "players",
  initialState,
  reducers: {
    addPlayer: (
      state,
      action: PayloadAction<Pick<PlayerState, "id" | "name">>
    ) => {
      const user = action.payload;
      state[user.id] = {
        ...user,
        isReady: false,
        codeOperations: initialCodeOperations,
      };
    },
    removePlayer: (state, action: PayloadAction<PlayerState["id"]>) => {
      const id = action.payload;
      delete state[id];
    },
    setPlayerReadyStatus: (
      state,
      action: PayloadAction<Pick<PlayerState, "id" | "isReady">>
    ) => {
      const { id, isReady } = action.payload;
      const user = state[id];
      if (user) {
        user.isReady = isReady;
      }
    },
    addPlayerOperation: (
      state,
      action: PayloadAction<{ id: PlayerState["id"]; codeOperation: Operation }>
    ) => {
      const { id, codeOperation } = action.payload;
      const user = state[id];
      if (user) {
        user.codeOperations.push(codeOperation);
      }
    },
  },
});
